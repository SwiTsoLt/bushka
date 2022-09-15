import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type AnnouncementCategoryChildrenDocument = AnnouncementCategoryChildren & Document

@Schema()
export class AnnouncementCategoryChildren {
    @Prop()
    id: number

    @Prop()
    title: string
}

export const AnnouncementCategoryChildrenSchema = SchemaFactory.createForClass(AnnouncementCategoryChildren)