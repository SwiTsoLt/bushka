import { HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { NextFunction, Request, Response } from "express";
import { Model } from "mongoose";
import { User, UserDocument } from "src/user/schemas/user.schema";
import * as authModel from "../models/auth.model";

const jwt = require('jsonwebtoken');
const config = require('config');

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>
    ) { }

    async use(req: any, res: Response, next: NextFunction) {
        const token = req?.headers?.authorization?.split(' ')[1]

        if (!token) {
            return res.status(HttpStatus.UNAUTHORIZED).json({ message: authModel.errorEnums.jwtMalformed })
        }

        await jwt.verify(token, config.get('jwtSecret'), async (error, decoded) => {
            if (error) {
                console.log(error);

                if (error?.message === "jwt malformed") {
                    return res.status(HttpStatus.UNAUTHORIZED).json({ message: authModel.errorEnums.jwtMalformed })

                }

                if (error?.message === "jwt expired") {
                    return res.status(HttpStatus.UNAUTHORIZED).json({ message: authModel.errorEnums.jwtExpired })

                }

                return res.status(HttpStatus.UNAUTHORIZED).json({ message: authModel.errorEnums.somethingWentWrong })
            }

            await this.userModel.findById(decoded?.id)
                .then(user => {
                    req.user = user
                    next()
                })
                .catch(e => {
                    console.log(e);
                    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: authModel.errorEnums.somethingWentWrong })
                })
        })
    }
}
