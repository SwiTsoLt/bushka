import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/schemas/user.schema';
import { AnnouncementsController } from './announcements.controller';
import { AnnouncementsService } from './announcements.service';
import { AnnouncementCategoryChildren, AnnouncementCategoryChildrenSchema } from './schemas/announcement-category-children.schema';
import { AnnouncementCategory, AnnouncementCategorySchema } from './schemas/announcement-category.schema';
import { Announcement, AnnouncementSchema } from './schemas/announcement.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Announcement.name, schema: AnnouncementSchema },
    { name: AnnouncementCategory.name, schema: AnnouncementCategorySchema },
    { name: AnnouncementCategoryChildren.name, schema: AnnouncementCategoryChildrenSchema },
    { name: User.name, schema: UserSchema },
  ])],
  exports: [AnnouncementsService],
  controllers: [AnnouncementsController],
  providers: [AnnouncementsService],
})
export class AnnouncementsModule {}
