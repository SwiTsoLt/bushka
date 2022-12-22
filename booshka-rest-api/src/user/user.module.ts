import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AnnouncementsService } from "src/announcements/announcements.service";
import { AnnouncementCategoryChildren, AnnouncementCategoryChildrenSchema } from "src/announcements/schemas/announcement-category-children.schema";
import { AnnouncementCategory, AnnouncementCategorySchema } from "src/announcements/schemas/announcement-category.schema";
import { Announcement, AnnouncementSchema } from "src/announcements/schemas/announcement.schema";
import { City, CitySchema } from "./schemas/city.schema";
import { Region, RegionSchema } from "./schemas/region.schema";
import { User, UserSchema } from "./schemas/user.schema";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";


@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: Announcement.name, schema: AnnouncementSchema },
            { name: City.name, schema: CitySchema },
            { name: Region.name, schema: RegionSchema },
            { name: Announcement.name, schema: AnnouncementSchema },
            { name: AnnouncementCategory.name, schema: AnnouncementCategorySchema },
            { name: AnnouncementCategoryChildren.name, schema: AnnouncementCategoryChildrenSchema },
        ]),
    ],
    providers: [
        UserService,
        AnnouncementsService
    ],
    controllers: [UserController],
    exports: [UserService]
})

export class UserModule { }