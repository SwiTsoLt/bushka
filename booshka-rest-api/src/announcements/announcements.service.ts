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

const config = require('config');

@Injectable()
export class AnnouncementsService {
    constructor(
        @InjectModel(Announcement.name) private AnnouncementModel: Model<AnnouncementDocument>,
        @InjectModel(AnnouncementCategory.name) private AnnouncementCategoryModel: Model<AnnouncementCategoryDocument>,
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

    async create(createAnnouncementDto: CreateAnnouncementDto, files: any): Promise<announcementModel.IAnnouncementCreateServiceResponse> {
        const imageList = files?.imageList?.length ? files?.imageList : [files?.imageList]
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

            const responseFileId = await this.driveService.files.create({
                requestBody: fileMetaData,
                media,
                fields: "id"
            })

            const newFileLink = await this.generatePublicUrl(responseFileId.data.id)

            fs.unlinkSync(newFilePath)
            return [...(await acc), newFileLink]
        }, [])
            .then(async imageLinkList => {
                const category = await this.getCategoryById(createAnnouncementDto.categoryId.toString())
                console.log(imageLinkList);

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
                    .then((data: Announcement) => ({
                        announcement: data,
                        message: announcementModel.announcementSuccessEnum.created,
                        status: HttpStatus.CREATED
                    }))
                    .catch((e: string) => {
                        console.log(e);
                        return {
                            message: announcementModel.announcementErrorEnum.somethingWentWrong,
                            status: HttpStatus.INTERNAL_SERVER_ERROR
                        }
                    })
            })
    }

    async remove(id: string): Promise<announcementModel.IAnnouncementDeleteServiceResponse> {
        return await this.AnnouncementModel.findByIdAndRemove(id)
            .then((announcement: Announcement) => {
                if (announcement) {
                    return {
                        announcement: announcement,
                        message: announcementModel.announcementSuccessEnum.delete,
                        status: HttpStatus.OK
                    }
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
