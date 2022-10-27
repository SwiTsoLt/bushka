import { HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import * as authModel from "../../auth/models/auth.model";
import * as announcementModel from "../models/announcement.model";

@Injectable()
export class CrateAnnouncementValidateMiddleware implements NestMiddleware {
    use(req: any, res: Response, next: NextFunction) {
            const form = req.body
    
            if (
                !!form?.ownerId?.trim()
                && !!form?.title?.trim()
                && +form?.price?.trim() > -1
                && +form?.categoryId?.trim() > -1
            ) {
                return next()
                // return res.status(200).json({ message: "OK" })
            }

            if (!form?.ownerId?.trim()) {
                return res.status(HttpStatus.BAD_REQUEST).json({ message: authModel.errorEnums.somethingWentWrong})
            }

            if (!form?.title?.trim()) {
                return res.status(HttpStatus.BAD_REQUEST).json({ message: announcementModel.announcementValidateErrorEnums.title })
            }

            if (+form?.price?.trim() < 0) {
                return res.status(HttpStatus.BAD_REQUEST).json({ message: announcementModel.announcementValidateErrorEnums.price })
            }

            if (+form?.categoryId?.trim() < 0) {
                return res.status(HttpStatus.BAD_REQUEST).json({ message: announcementModel.announcementValidateErrorEnums.category })
            }

            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: authModel.errorEnums.somethingWentWrong })
    }
}
