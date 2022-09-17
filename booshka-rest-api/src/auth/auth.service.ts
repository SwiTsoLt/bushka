import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { RegistrationUserDto } from './dto/registration-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from '../user/schemas/user.schema';
import * as authModel from './models/auth.model';
import * as argon2 from 'argon2';
const jwt = require('jsonwebtoken');
const config = require('config');

const generateAccessToken = (id: string, roles: string[]): string => {
    const payload = {id, roles}
    return jwt.sign(payload, config.get("jwtSecret"), {expiresIn: "24h"})
}

@Injectable()
export class AuthService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

    public async registration(registrationUserDto: RegistrationUserDto): Promise<authModel.IRegistrationResponse> {
        try {
            return await this.userModel.findOne({ gmail: registrationUserDto.gmail })
                .then(async candidate => {
                    if (candidate) {
                        return { message: authModel.errorEnums.suchUserAlreadyExists, status: HttpStatus.AMBIGUOUS }
                    }
                    const hashedPassword = await argon2.hash(registrationUserDto.password)
                    const newUser = new this.userModel({
                        ...registrationUserDto,
                        password: hashedPassword,
                        roles: ["USER"],
                        registrationDate: Date.now()
                    })
                    return await newUser.save()
                        .then(() => ({ message: authModel.successEnums.userWasCreatedSuccessful, status: HttpStatus.OK }))
                        .catch(e => ({ message: e, status: HttpStatus.INTERNAL_SERVER_ERROR }))
                })
                .catch(e => ({ message: e, status: HttpStatus.INTERNAL_SERVER_ERROR }))

        } catch (e) {
            return { message: e, status: HttpStatus.INTERNAL_SERVER_ERROR }
        }

    }

    public async login(loginUserDto: LoginUserDto): Promise<authModel.ILoginResponse> {
        try {
            return await this.userModel.findOne({ gmail: loginUserDto.gmail })
                .then(async user => {
                    if (user) {
                        const passwordVerify = await argon2.verify(user.password, loginUserDto.password)
                        if (passwordVerify) {
                            const token = generateAccessToken(user._id, user.roles)

                            return {
                                token,
                                message: authModel.successEnums.LoggedInSuccess,
                                status: HttpStatus.OK
                            }
                        }
                        return { message: authModel.errorEnums.wrongPassword, status: HttpStatus.UNPROCESSABLE_ENTITY }
                    }
                    return { message: authModel.errorEnums.userNotFoundByGmail(loginUserDto.gmail), status: HttpStatus.NOT_FOUND }
                })
                .catch(e => ({ message: e, status: HttpStatus.INTERNAL_SERVER_ERROR }))
        } catch (e) {
            return { message: e, status: HttpStatus.INTERNAL_SERVER_ERROR }
        }
    }
}
