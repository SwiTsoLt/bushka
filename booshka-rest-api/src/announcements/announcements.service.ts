import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import * as announcementModel from './models/announcement.model';
import { Announcement, AnnouncementDocument } from './schemas/announcement.schema';

@Injectable()
export class AnnouncementsService {
    constructor(@InjectModel(Announcement.name) private AnnouncementModel: Model<AnnouncementDocument>) { }

    async getAll(): Promise<announcementModel.IAnnouncementGetAllServiceResponse> {
        return await this.AnnouncementModel.find().exec()
            .then((data: Announcement[]) => ({
                announcementList: data,
                status: HttpStatus.OK
            }))
            .catch((e: string) => {
                console.log(e);
                return {
                    message: announcementModel.announcementErrorEnum.somethingWentWrong,
                    status: HttpStatus.INTERNAL_SERVER_ERROR
                }
            })
    }

    async getOne(id: string): Promise<announcementModel.IAnnouncementGetOneServiceResponse> {
        return await this.AnnouncementModel.findById(id)
            .then((data: Announcement) => ({ announcement: data, status: HttpStatus.OK }))
            .catch((e: string) => {
                console.log(e);
                return {
                    message: announcementModel.announcementErrorEnum.somethingWentWrong,
                    status: HttpStatus.INTERNAL_SERVER_ERROR
                }
            })
    }

    async create(createAnnouncementDto: CreateAnnouncementDto): Promise<announcementModel.IAnnouncementCreateServiceResponse> {
        const newAnnouncement = new this.AnnouncementModel(createAnnouncementDto)
        return await newAnnouncement.save()
            .then((data: Announcement) => ({
                announcement: data,
                message: announcementModel.announcementSuccessEnum.created,
                status: HttpStatus.CREATED
            }))
            .catch((e: string) => {
                console.log(e);
                return {
                    message: announcementModel.announcementErrorEnum.somethingWentWrong,
                    status: HttpStatus.INTERNAL_SERVER_ERROR
                }
            })
    }

    async remove(id: string): Promise<announcementModel.IAnnouncementDeleteServiceResponse> {
        return await this.AnnouncementModel.findByIdAndRemove(id)
            .then((announcement: Announcement) => ({
                announcement: announcement,
                message: announcementModel.announcementSuccessEnum.delete,
                status: HttpStatus.OK
            }))
            .catch(e => {
                console.log(e)
                return {
                    message: announcementModel.announcementErrorEnum.notFount(id),
                    status: HttpStatus.NOT_FOUND
                }
            })
    }

    async update(id: string, updateAnnouncementDto: UpdateAnnouncementDto): Promise<Announcement> {
        return await this.AnnouncementModel.findByIdAndUpdate(id, updateAnnouncementDto, { new: true })
    }
}
