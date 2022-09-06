import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Res, Req } from '@nestjs/common';
import * as announcementModel from './models/announcement.model';
import { AnnouncementsService } from './announcements.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { Response, Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('/api/announcement')
export class AnnouncementsController {
  constructor(
    private readonly announcementsService: AnnouncementsService
  ) { }

  @Get()
  async getAll(@Res() res: Response): Promise<Response<announcementModel.IAnnouncementGetAllResponse>> {
    const announcementResponse: announcementModel.IAnnouncementGetAllServiceResponse = await this.announcementsService.getAll()
    if (announcementResponse) {
      return res.status(announcementResponse.status).json({
        announcementList: announcementResponse.announcementList
      })
    }

    return res.status(announcementResponse.status).json({
      message: announcementResponse.message
    })
  }

  @Get(':id')
  async getOne(@Param('id') id: string, @Res() res: Response): Promise<Response<announcementModel.IAnnouncementGetOneResponse>> {
    const announcementResponse = await this.announcementsService.getOne(id)
    if (announcementResponse.announcement) {
      return res.status(announcementResponse.status).json({
        announcement: announcementResponse.announcement
      })
    }

    return res.status(announcementResponse.status).json({
      message: announcementResponse.message
    })
  }

  @Post()
  async create(@Body() createAnnouncementDto: CreateAnnouncementDto, @Req() req: Request, @Res() res: Response): Promise<Response<announcementModel.IAnnouncementCreateResponse>> {
    const announcementResponse = await this.announcementsService.create({
      ...createAnnouncementDto 
    }, req.files)
   
    if (announcementResponse.announcement) {
      return res.status(announcementResponse.status).json({
        announcement: announcementResponse.announcement,
        message: announcementResponse.message
      })
    }

    return res.status(announcementResponse.status).json({
      message: announcementResponse.message
    })
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Res() res: Response): Promise<Response<announcementModel.IAnnouncementDeleteResponse>> {
    const deleteAnnouncementResponse = await this.announcementsService.remove(id)
    if (deleteAnnouncementResponse.announcement) {
      return res.status(deleteAnnouncementResponse.status).json({
        announcement: deleteAnnouncementResponse.announcement,
        message: deleteAnnouncementResponse.message
      })
    }
  }
}
