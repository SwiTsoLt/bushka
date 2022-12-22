import { Controller, Get, Param, Query, Res, Req, HttpStatus, Put, Delete, Post } from "@nestjs/common";
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

        if (userServiceResponse?.user) {
            return res.status(userServiceResponse.status).json({ user: userServiceResponse.user, message: userServiceResponse.message })
        }

        return res.status(userServiceResponse.status).json({ message: userServiceResponse.message })
    }

    @Post('/edit')
    public async editUserByJWT(@Res() res: Response, @Req() req: Request<any> ): Promise<Response<userModel.IUserResponse>> {
        const userServiceResponse: userModel.IUserServiceResponse = await this.userService.editUserByJWT(req)

        console.log(userServiceResponse);

        if (userServiceResponse?.user) {
            return res.status(userServiceResponse.status).json({ user: userServiceResponse?.user, message: userServiceResponse?.message })
        }

        return res.status(userServiceResponse.status).json({ message: userServiceResponse.message })
    }

    @Put('/toggleIdea')
    public async toggleIdea(@Res() res: Response, @Req() req: Request<any>): Promise<Response<userModel.IUserResponse>> {
        const userServiceResponse: userModel.IUserServiceResponse = await this.userService.toggleIdea(req)

        if (userServiceResponse?.user) {
            return res.status(userServiceResponse.status).json({ user: userServiceResponse?.user })
        }

        return res.status(userServiceResponse.status).json({ message: userServiceResponse.message })
    }

    @Get('/city')
    public async getCityAll(@Res() res: Response): Promise<Response<userModel.ICityResponse>> {
        const userServiceResponse: userModel.ICityServiceResponse = await this.userService.getCityAll()
        
        if (userServiceResponse?.cityList) {
            return res.status(userServiceResponse.status).json({ cityList: userServiceResponse.cityList })
        }

        return res.status(userServiceResponse.status).json({ message: userServiceResponse.message })
    }

    @Get(':id')
    public async getUserById(@Param('id') id: string, @Res() res: Response): Promise<Response<userModel.IUserResponse>> {
        const userServiceResponse: userModel.IUserServiceResponse = await this.userService.getUserById(id)

        if (userServiceResponse?.user) {
            return res.status(userServiceResponse.status).json({ user: userServiceResponse.user })
        }

        return res.status(userServiceResponse.status).json({ message: userServiceResponse.message })
    }

    @Get('/:id/announcement')
    public async getUserAnnouncementIdList(@Param('id') id: string, @Res() res: Response): Promise<Response<userModel.IUserResponse>> {
        const userServiceResponse: userModel.IUserServiceResponse = await this.userService.getUserAnnouncementIdList(id)

        if (userServiceResponse?.announcementIdList) {
            return res.status(userServiceResponse.status).json({ announcementIdList: userServiceResponse.announcementIdList })
        }

        return res.status(userServiceResponse.status).json({ message: userServiceResponse.message })
    }
}