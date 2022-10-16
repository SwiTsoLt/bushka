import { HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class RegistrationValidateMiddleware implements NestMiddleware {
    use(req: any, res: Response, next: NextFunction) {
            const form = req.body
            console.log(form);

            if (
                form
            ) {
                // next()
                return res.status(200).json({ message: "OK" })
            }

            return res.status(200).json({ message: "NE OK" })
    }
}
