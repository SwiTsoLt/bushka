import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { google } from 'googleapis';
import { Model } from "mongoose";
import * as userModel from "./models/user.model";
import * as authModel from "../auth/models/auth.model";
import { User, UserDocument } from "./schemas/user.schema";
import { Request } from "express";
import { Announcement, AnnouncementDocument } from "src/announcements/schemas/announcement.schema";
import * as announcementModel from "../announcements/models/announcement.model";
import { City, CityDocument } from "./schemas/city.schema";
import { Region, RegionDocument } from "./schemas/region.schema";

import * as uuid from 'uuid'
import * as path from 'path'
import * as fs from 'fs'
import * as config from "config"
import { AnnouncementsService } from "src/announcements/announcements.service";

@Injectable()
export class UserService {

    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(City.name) private cityModel: Model<CityDocument>,
        @InjectModel(Region.name) private regionModel: Model<RegionDocument>,
        @InjectModel(Announcement.name) private announcementModel: Model<AnnouncementDocument>,
        private announcementService: AnnouncementsService
    ) {

        this.auth.setCredentials({ refresh_token: this.refresh_token })
    }

    private parents_id = config.get("parents_user_avatar_id")
    private client_id = config.get("client_id")
    private client_secret = config.get("client_secret")
    private redirect_uri = config.get("redirect_uri")
    private refresh_token = config.get("refresh_token")

    private auth = new google.auth.OAuth2(this.client_id, this.client_secret, this.redirect_uri)
    private driveService = google.drive({ version: "v3", auth: this.auth })

    public async getUserById(id: string): Promise<userModel.IUserServiceResponse> {
        return await this.userModel.findById(id)
            .then(user => {
                if (!user) {
                    return ({ message: authModel.errorEnums.userNotFound(id), status: HttpStatus.NOT_FOUND })
                }
                const userCopy = user
                userCopy.password = undefined
                return ({ user: userCopy, status: HttpStatus.OK })
            })
            .catch(e => ({ message: e, status: HttpStatus.INTERNAL_SERVER_ERROR }))
    }

    public async getUserByJWT(req: any) {
        const userCopy = req?.user

        if (!userCopy) {
            return ({ message: authModel.errorEnums.somethingWentWrong, status: HttpStatus.INTERNAL_SERVER_ERROR })
        }

        userCopy.password = undefined
        return ({ user: userCopy, status: HttpStatus.OK })
    }

    public async editUserByJWT(req: any) {
        const file = req?.files?.image
        const user = req.user
        // const newUser = req?.body?.user || ""
        const newUser = JSON.parse(req?.body?.user || "")

        if (file) {
            const newFileId = Date.now()
            const newFileType = file.mimetype
            const newFileName = `${newFileId}.${newFileType.split("image/")[1]}`

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
                mimeType: newFileType,
                body: fs.createReadStream(newFilePath)
            }

            const responseDriveService = await this.driveService.files.create({
                requestBody: fileMetaData,
                media,
                fields: "id"
            })

            const newFileInDriveServiceId = responseDriveService?.data?.id
            const newFileInDriveServiceLink = await this.announcementService.generatePublicUrl(newFileInDriveServiceId)

            const newUserConfig = {
                firstName: newUser?.firstName || undefined,
                lastName: newUser?.lastName || undefined,
                city: newUser?.city || undefined,
                region: newUser?.region || undefined,
                phone: newUser?.phone || undefined,
                avatarLink: newFileInDriveServiceLink || undefined,
            }
            const newUserOptions = {
                new: true
            }

            const newEditedUser = await this.userModel.findByIdAndUpdate(user._id, newUserConfig, newUserOptions)

            this.clearCache()
            const oldAvatarId = user?.avatarLink?.split("id=")[1].split("&export")[0]
            oldAvatarId && this.removeFileInDriveServiceById(oldAvatarId)

            return ({
                user: newEditedUser,
                message: userModel.UserServiseResponseEnumsSuccess.edit,
                status: HttpStatus.OK
            })
        }

        const newUserConfig = {
            firstName: newUser?.firstName || undefined,
            lastName: newUser?.lastName || undefined,
            city: newUser?.city || undefined,
            region: newUser?.region || undefined,
            phone: newUser?.phone || undefined,
        }
        const newUserOptions = {
            new: true
        }

        const newEditedUser = await this.userModel.findByIdAndUpdate(user._id, newUserConfig, newUserOptions)

        return ({
            user: newEditedUser,
            message: userModel.UserServiseResponseEnumsSuccess.edit,
            status: HttpStatus.OK
        })
    }

    public async getUserAnnouncementIdList(id: string) {
        return await this.userModel.findById(id)
            .then(user => {
                if (!user) {
                    return ({ message: authModel.errorEnums.userNotFound(id), status: HttpStatus.NOT_FOUND })
                }

                return ({ announcementIdList: user.announcementIdList, status: HttpStatus.OK })
            })
            .catch(e => {
                console.log(e);
                return ({ message: e, status: HttpStatus.INTERNAL_SERVER_ERROR })
            })
    }

    public async toggleIdea(req: any) {
        const user = req?.user
        const { id } = req?.body

        if (!id?.trim()) {
            return ({ message: authModel.errorEnums.somethingWentWrong, status: HttpStatus.INTERNAL_SERVER_ERROR })
        }

        if (!user) {
            return ({ message: authModel.errorEnums.somethingWentWrong, status: HttpStatus.INTERNAL_SERVER_ERROR })
        }

        const newIdeaList = user.ideas.includes(id)
            ? { ideas: user.ideas.filter((userIdeaId: string) => userIdeaId !== id) }
            : { ideas: [id, ...user.ideas] }

        return await this.announcementModel.findById(id)
            .then(async candidate => {
                if (!candidate) {
                    return ({ message: announcementModel.announcementErrorEnum.notFount(id), status: HttpStatus.NOT_FOUND })
                }

                return await this.userModel.findByIdAndUpdate(
                    user._id,
                    newIdeaList,
                    { new: true }
                )
                    .then(newUser => {
                        if (!newUser) {
                            return ({ message: authModel.errorEnums.somethingWentWrong, status: HttpStatus.INTERNAL_SERVER_ERROR })
                        }

                        return ({ user: newUser, status: HttpStatus.OK })
                    })
                    .catch(e => {
                        console.log(e);
                        return ({ message: authModel.errorEnums.somethingWentWrong, status: HttpStatus.INTERNAL_SERVER_ERROR })
                    })
            })
            .catch(e => {
                console.log(e);
                return ({ message: authModel.errorEnums.somethingWentWrong, status: HttpStatus.INTERNAL_SERVER_ERROR })
            })
    }

    public async getCityAll() {
        return this.cityModel.find()
            .then(cityList => {
                if (cityList?.length) {
                    return ({ cityList, status: HttpStatus.OK })
                }
                return ({ message: authModel.errorEnums.somethingWentWrong, status: HttpStatus.INTERNAL_SERVER_ERROR })
            })
            .catch(e => {
                console.log(e);
                return ({ message: authModel.errorEnums.somethingWentWrong, status: HttpStatus.INTERNAL_SERVER_ERROR })
            })
    }

    public removeFileInDriveServiceById(id: string) {
        console.log(id);
        this.driveService.files.delete({ fileId: id })
    }

    public clearCache() {
        const cachePath = path.join(__dirname, "../", "cache")
        if (!fs.existsSync(cachePath)) {
            fs.mkdirSync(cachePath)
        }

        fs.readdirSync(cachePath).forEach(file => {
            const filePath = path.join(__dirname, "../", "cache", file)
            fs.unlinkSync(filePath)
        })
    }
}