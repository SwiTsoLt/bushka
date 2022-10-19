import { Controller, Get, Param, Query, Res, Req, HttpStatus } from "@nestjs/common";
import { Request, Response } from "express";
import * as userModel from "./models/user.model";
import { UserService } from "./user.service";

@Controller('api/user')
export class UserController {

    constructor(
        private userService: UserService
    ) { }

    @Get()
    public async getUserByJWT(@Req() req: Request, @Res() res: Response): Promise<Response<userModel.IUserResponse>> {
        const userServiceResponse: userModel.IUserServiceResponse = await this.userService.getUserByJWT(req)

        if (userServiceResponse.user) {
            return res.status(userServiceResponse.status).json({ user: userServiceResponse.user, message: userServiceResponse.message })
        }

        return res.status(userServiceResponse.status).json({ message: userServiceResponse.message })
    }

    @Get('/favorites')
    public async getUserFavorites(@Res() res: Response, @Req() req: any): Promise<Response<userModel.IUserResponse>> {
        const userServiceResponse: userModel.IUserServiceResponse = await this.userService.getUserFavorites(req)
     
        if (userServiceResponse.favorites) {
            return res.status(userServiceResponse.status).json({ favorites: userServiceResponse.favorites })
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

    @Get('/:id/announcement')
    public async getUserAnnouncementIdList(@Param('id') id: string, @Res() res: Response): Promise<Response<userModel.IUserResponse>> {
        const userServiceResponse: userModel.IUserServiceResponse = await this.userService.getUserAnnouncementIdList(id)
     
        if (userServiceResponse.announcementIdList) {
            return res.status(userServiceResponse.status).json({ announcementIdList: userServiceResponse.announcementIdList })
        }

        return res.status(userServiceResponse.status).json({ message: userServiceResponse.message })
    }
}