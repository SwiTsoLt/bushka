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
                return ({
                    user: {
                        _id: user._id,
                        gmail: user.gmail,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        city: user.city,
                        region: user.region,
                        phone: user.phone
                    }, status: HttpStatus.OK
                })
            })
            .catch(e => ({ message: e, status: HttpStatus.INTERNAL_SERVER_ERROR }))
    }

    public async getUserByJWT(token: string) {
        return jwt.verify(token, config.get("jwtSecret"), async (error, decoded) => {
            if (error) {
                if (error.message === "jwt expired") {
                    return ({ message: authModel.errorEnums.jwtExpired, status: HttpStatus.INTERNAL_SERVER_ERROR })
                }
                return ({ message: error.message, status: HttpStatus.UNAUTHORIZED })
            }
            return await this.userModel.findById(decoded.id)
                .then(user => {
                    if (!user) {
                        return ({ message: authModel.errorEnums.userNotFound(decoded.id), status: HttpStatus.NOT_FOUND })
                    }

                    return ({
                        user: {
                            _id: user._id,
                            gmail: user.gmail,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            city: user.city,
                            region: user.region,
                            phone: user.phone
                        }, status: HttpStatus.OK
                    })
                })
                .catch(e => ({ message: e, status: HttpStatus.INTERNAL_SERVER_ERROR }))
        })
    }
}