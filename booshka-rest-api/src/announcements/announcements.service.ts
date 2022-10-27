import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { google } from 'googleapis';

import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import * as announcementModel from './models/announcement.model';
import { Announcement, AnnouncementDocument } from './schemas/announcement.schema';
import { AnnouncementCategory, AnnouncementCategoryDocument } from './schemas/announcement-category.schema';


import * as uuid from 'uuid'
import * as path from 'path'
import * as fs from 'fs'
import { AnnouncementCategoryChildren, AnnouncementCategoryChildrenDocument } from './schemas/announcement-category-children.schema';
import { User, UserDocument } from 'src/user/schemas/user.schema';

const config = require('config');

@Injectable()
export class AnnouncementsService {
    constructor(
        @InjectModel(Announcement.name) private AnnouncementModel: Model<AnnouncementDocument>,
        @InjectModel(AnnouncementCategory.name) private AnnouncementCategoryModel: Model<AnnouncementCategoryDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) {
    }

    private KEY_FILE_PATH = path.join(__dirname, "models", "serviceAccountCred.json")
    private parents_id = config.get("parents_id")
    private scopes = config.get("scopes")

    private auth = new google.auth.GoogleAuth({
        keyFile: this.KEY_FILE_PATH,
        scopes: this.scopes
    })
    private driveService = google.drive({ version: "v3", auth: this.auth })

    async getAll(): Promise<announcementModel.IAnnouncementGetAllServiceResponse> {
        return await this.AnnouncementModel.find().exec()
            .then((data: Announcement[]) => ({
                announcementList: data.reverse(),
                status: HttpStatus.OK
            }))
            .catch((e: string) => {
                console.log(e);
                return {
                    message: announcementModel.announcementErrorEnum.somethingWentWrong,
                    status: HttpStatus.INTERNAL_SERVER_ERROR
                }
            })
    }

    async getOne(id: string): Promise<announcementModel.IAnnouncementGetOneServiceResponse> {
        return await this.AnnouncementModel.findById(id)
            .then((data: Announcement) => {
                if (!data || !Object.keys(data).length) {
                    return ({ message: announcementModel.announcementErrorEnum.notFount(id), status: HttpStatus.NOT_FOUND })
                }

                return ({ announcement: data, status: HttpStatus.OK })
            })
            .catch((e: string) => {
                console.log(e);
                return {
                    message: announcementModel.announcementErrorEnum.somethingWentWrong,
                    status: HttpStatus.INTERNAL_SERVER_ERROR
                }
            })
    }

    async getCategoryAll(): Promise<announcementModel.IAnnouncementCategoryGetAllServiceResponse> {
        return await this.AnnouncementCategoryModel.find()
            .then((categoryList) => {
                if (categoryList.length) {
                    return {
                        categoryList,
                        status: HttpStatus.OK
                    }
                }

                return {
                    categoryList: [],
                    message: announcementModel.announcementErrorEnum.somethingWentWrong,
                    status: HttpStatus.INTERNAL_SERVER_ERROR
                }
            })
            .catch(e => {
                console.log(e);
                return {
                    categoryList: [],
                    message: announcementModel.announcementErrorEnum.somethingWentWrong,
                    status: HttpStatus.INTERNAL_SERVER_ERROR
                }
            })
    }

    private async getCategoryById(id: string): Promise<AnnouncementCategoryChildren> {
        return await this.AnnouncementCategoryModel.find()
            .then((categoryList: AnnouncementCategory[]) => {
                const resultCategoryList = categoryList.filter((category: AnnouncementCategory) => category.id.toString() === id)
                if (resultCategoryList.length) {
                    return resultCategoryList[0]
                }
                const resultCategoryChildrenList = categoryList.reduce((acc, cur) => acc = [...acc, ...cur.children.filter(children => children.id.toString() === id)], [])

                if (!resultCategoryChildrenList.length) {
                    return null
                }

                return resultCategoryChildrenList[0]
            })
            .catch(e => {
                console.log(e);
                return null
            })
    }

    async create(createAnnouncementDto: CreateAnnouncementDto, req: any): Promise<announcementModel.IAnnouncementCreateServiceResponse> {
        const user = req?.user

        if (!user) {
            return ({ message: announcementModel.announcementErrorEnum.somethingWentWrong, status: HttpStatus.INTERNAL_SERVER_ERROR })
        }

        const imageList = req?.files?.imageList
            ? (
                req?.files?.imageList?.name
                    ? [req?.files?.imageList]
                    : (
                        req?.files?.imageList?.length
                            ? req?.files?.imageList
                            : []
                    )
            ) : []

        if (imageList?.length) {
            return await imageList.reduce(async (acc, file) => {
                const newFileId: string = uuid.v4()
                const newFileName: string = `${newFileId}.png`

                const cachePath = path.join(__dirname, "../", "cache")
                if (!fs.existsSync(cachePath)) {
                    fs.mkdirSync(cachePath)
                }

                const newFilePath = path.join(cachePath, newFileName)
                file.mv(newFilePath)

                const fileMetaData = {
                    "name": newFileName,
                    "parents": [this.parents_id]
                }

                const media = {
                    mimeType: "image/png",
                    body: fs.createReadStream(newFilePath)
                }

                return await this.driveService.files.create({
                    requestBody: fileMetaData,
                    media,
                    fields: "id"
                })
                    .then(async responseFileId => await this.generatePublicUrl(responseFileId.data.id)
                        .then(newFileLink => [...acc, newFileLink])
                        .catch(e => {
                            console.log(e);
                            return acc
                        })
                    )
                    .catch(e => {
                        console.log(e);
                        return acc
                    })
                    .finally(() => fs.unlinkSync(newFilePath))
            }, [])
                .then(async imageLinkList => {
                    const category = await this.getCategoryById(createAnnouncementDto.categoryId.toString())

                    const newAnnouncement = new this.AnnouncementModel({
                        ...createAnnouncementDto,
                        category: {
                            id: category.id,
                            title: category.title
                        },
                        imageLinkList,
                        createDate: Date.now()
                    })

                    // return new Promise((res, rej) => {
                    //    setTimeout(() => {
                    //     res({
                    //         message: "Объявление успешно опубликованно 2",
                    //         status: 201,
                    //         announcement: {
                    //             ...createAnnouncementDto,
                    //             category: {
                    //                 id: 0,
                    //                 title: "test"
                    //             },
                    //             createDate: new Date(Date.now())
                    //         }
                    //     })
                    //    }, 6000);
                    // })

                    return await newAnnouncement.save()
                        .then(async (announcement) => {
                            return await this.userModel.findByIdAndUpdate(user._id, {
                                ...user,
                                announcementIdList: [
                                    ...user.announcementIdList,
                                    announcement._id
                                ]
                            }, { new: true })
                                .then(newUser => ({
                                    user: newUser,
                                    announcement,
                                    message: announcementModel.announcementSuccessEnum.created,
                                    status: HttpStatus.CREATED
                                }))
                                .catch(e => {
                                    console.log(e)
                                    return ({
                                        message: announcementModel.announcementErrorEnum.somethingWentWrong,
                                        status: HttpStatus.INTERNAL_SERVER_ERROR
                                    })
                                })
                        })
                        .catch((e: string) => {
                            console.log(e);
                            return {
                                message: announcementModel.announcementErrorEnum.somethingWentWrong,
                                status: HttpStatus.INTERNAL_SERVER_ERROR
                            }
                        })
                })
        }

        const category = await this.getCategoryById(createAnnouncementDto.categoryId.toString())

        const newAnnouncement = new this.AnnouncementModel({
            ...createAnnouncementDto,
            category: {
                id: category.id,
                title: category.title
            },
            imageLinkList: [],
            createDate: Date.now()
        })

        // return new Promise((res, rej) => {
        //    setTimeout(() => {
        //     res({
        //         message: "Объявление успешно опубликованно 2",
        //         status: 201,
        //         announcement: {
        //             ...createAnnouncementDto,
        //             category: {
        //                 id: 0,
        //                 title: "test"
        //             },
        //             createDate: new Date(Date.now())
        //         }
        //     })
        //    }, 6000);
        // })

        return await newAnnouncement.save()
            .then(async (announcement) => {
                return await this.userModel.findByIdAndUpdate(user._id, {
                    announcementIdList: [
                        ...user.announcementIdList,
                        announcement._id
                    ]
                }, { new: true })
                    .then(newUser => {
                        console.log("res: ", ({
                            user: newUser,
                            announcement,
                            status: HttpStatus.CREATED,
                            message: announcementModel.announcementSuccessEnum.created
                        }));
                        return ({
                            user: newUser,
                            announcement,
                            status: HttpStatus.CREATED,
                            message: announcementModel.announcementSuccessEnum.created
                        })
                    })
                    .catch(e => {
                        console.log(e);
                        return ({
                            message: e,
                            status: HttpStatus.INTERNAL_SERVER_ERROR
                        })
                    })
            })
            .catch((e: string) => {
                console.log(e);
                return {
                    message: announcementModel.announcementErrorEnum.somethingWentWrong,
                    status: HttpStatus.INTERNAL_SERVER_ERROR
                }
            })

    }

    async remove(id: string, req: any): Promise<announcementModel.IAnnouncementDeleteServiceResponse> {
        const user = req?.user

        if (!user) {
            return ({ message: announcementModel.announcementErrorEnum.somethingWentWrong, status: HttpStatus.INTERNAL_SERVER_ERROR })
        }

        return await this.AnnouncementModel.findByIdAndRemove(id)
            .then(async (announcement) => {
                if (announcement?.imageLinkList?.length) {
                    await announcement.imageLinkList.forEach(async link => {
                        const fileId = link.split("?id=")[1].split("&export")[0]
                        await this.driveService.files.delete({
                            'fileId': fileId
                        });
                    })
                }

                if (announcement?._id) {
                    return await this.userModel.findByIdAndUpdate(user._id, {
                        announcementIdList: [...user.announcementIdList.filter(el => el.toString() !== announcement._id.toString())]
                    })
                        .then(newUser => ({
                            user: newUser,
                            announcement,
                            status: HttpStatus.ACCEPTED,
                            message: announcementModel.announcementSuccessEnum.delete
                        }))
                }

                return {
                    message: announcementModel.announcementErrorEnum.notFount(id),
                    status: HttpStatus.NOT_FOUND
                }
            })
            .catch(e => {
                console.log(e)
                return {
                    message: announcementModel.announcementErrorEnum.somethingWentWrong,
                    status: HttpStatus.INTERNAL_SERVER_ERROR
                }
            })
    }

    async update(id: string, updateAnnouncementDto: UpdateAnnouncementDto): Promise<Announcement> {
        return await this.AnnouncementModel.findByIdAndUpdate(id, updateAnnouncementDto, { new: true })
    }

    async generatePublicUrl(fileId: string): Promise<string | null> {
        try {
            const result = await this.driveService.files.get({
                fileId: fileId,
                fields: 'webViewLink, webContentLink'
            })

            if (result.data.webViewLink) {
                return result.data.webContentLink
            }

            return null
        } catch (error) {
            console.error(error.message);
        }
    }
}
