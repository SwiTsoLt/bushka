import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { AnnouncementCategoryChildren } from "./announcement-category-children.schema";

export type AnnouncementCategoryDocument = AnnouncementCategory & Document

@Schema()
export class AnnouncementCategory {
    @Prop()
    id: number

    @Prop()
    title: string

    @Prop()
    children: AnnouncementCategoryChildren[]
}

export const AnnouncementCategorySchema = SchemaFactory.createForClass(AnnouncementCategory)