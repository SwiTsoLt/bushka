import { Module } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { MongooseModule } from "@nestjs/mongoose";
import { Announcement, AnnouncementSchema } from "src/announcements/schemas/announcement.schema";
import { User, UserSchema } from "./schemas/user.schema";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";


@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        MongooseModule.forFeature([{ name: Announcement.name, schema: AnnouncementSchema }])
    ],
    providers: [
        UserService
    ],
    controllers: [UserController],
    exports: [UserService]
})

export class UserModule { }