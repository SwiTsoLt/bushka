import { Controller, Get, Param, Query, Res, Req, HttpStatus } from "@nestjs/common";
import { Request, Response } from "express";
import * as userModel from "./models/user.model";
import { UserService } from "./user.service";

@Controller('api/user')
export class UserController {

    constructor(
        private userService: UserService
    ){}

    @Get()
    public async getUserByJWT(@Req() req: Request, @Res() res: Response): Promise<Response<userModel.IUserResponse>> {
        const token = req.headers?.authorization?.split(' ')[1]
        if (!token) {
            return res.status(HttpStatus.UNAUTHORIZED).json({  message: userModel.userResponseErrorEnums.notAuthorized })
        }
        const userServiceResponse: userModel.IUserServiceResponse = await this.userService.getUserByJWT(token)

        if (userServiceResponse.user) {
            return res.status(userServiceResponse.status).json({ user: userServiceResponse.user, message: userServiceResponse.message })
        }

        return res.status(userServiceResponse.status).json({ message: userServiceResponse.message })
    }

    @Get(':id')
    public async getUserById(@Param('id') id: string, @Res() res: Response): Promise<Response<userModel.IUserResponse>> {
        const userServiceResponse: userModel.IUserServiceResponse = await this.userService.getUserById(id)
       
        if (userServiceResponse.user) {
            return res.status(userServiceResponse.status).json({ user: userServiceResponse.user })
        }

        return res.status(userServiceResponse.status).json({ message: userServiceResponse.message })
    }
}