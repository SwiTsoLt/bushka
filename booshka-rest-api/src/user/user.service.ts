import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as userModel from "./models/user.model";
import * as authModel from "../auth/models/auth.model";
import { User, UserDocument } from "./schemas/user.schema";
import { Request } from "express";
import { Announcement, AnnouncementDocument } from "src/announcements/schemas/announcement.schema";
import * as announcementModel from "../announcements/models/announcement.model";

const jwt = require('jsonwebtoken');
const config = require('config');

@Injectable()
export class UserService {

    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(Announcement.name) private announcementModel: Model<AnnouncementDocument>
    ) { }

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
}