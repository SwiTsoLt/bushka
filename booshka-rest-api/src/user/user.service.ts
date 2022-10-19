import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as userModel from "./models/user.model";
import * as authModel from "../auth/models/auth.model";
import { User, UserDocument } from "./schemas/user.schema";

const jwt = require('jsonwebtoken');
const config = require('config');

@Injectable()
export class UserService {

    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>
    ) { }

    public async getUserById(id: string): Promise<userModel.IUserServiceResponse> {
        return await this.userModel.findById(id)
            .then(user => {
                if (!user) {
                    return ({ message: authModel.errorEnums.userNotFound(id), status: HttpStatus.NOT_FOUND })
                }
                const userCopy = user
                delete userCopy.password
                return ({user: userCopy, status: HttpStatus.OK})
            })
            .catch(e => ({ message: e, status: HttpStatus.INTERNAL_SERVER_ERROR }))
    }

    public async getUserByJWT(req: any) {
        const userCopy = req?.user

        if (!userCopy) {
            return ({ message: authModel.errorEnums.somethingWentWrong, status: HttpStatus.INTERNAL_SERVER_ERROR })
        }

        delete userCopy.password
        return ({user: userCopy, status: HttpStatus.OK})
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

    public async getUserFavorites(req: any) {
        const user = req?.user
        if (!user) {
            return ({ message: authModel.errorEnums.somethingWentWrong, status: HttpStatus.INTERNAL_SERVER_ERROR })
        }

        return ({ favorites: user.favorites, status: HttpStatus.OK })
    }
}