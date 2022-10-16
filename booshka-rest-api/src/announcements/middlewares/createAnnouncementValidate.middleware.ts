import { HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class CrateAnnouncementValidateMiddleware implements NestMiddleware {
    use(req: any, res: Response, next: NextFunction) {
            const form = req.body
            console.log(form);

            if (
                !!form.ownerId.trim()
                && !!form.title.trim()
                && typeof(+form.price.trim()) === "number"
                && typeof(+form.categoryId.trim()) === "number"
            ) {
                // next()
                return res.status(200).json({ message: "OK" })
            }

            return res.status(200).json({ message: "NE OK" })
    }
}
