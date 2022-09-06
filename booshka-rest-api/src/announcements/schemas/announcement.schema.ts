import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type AnnouncementDocument = Announcement & Document

@Schema()
export class Announcement {
    @Prop()
    title: string

    @Prop()
    description: string

    @Prop()
    imageLinkList: string[]

    @Prop()
    category: number

    @Prop()
    price: number

    @Prop()
    ownerId: string
}

export const AnnouncementSchema = SchemaFactory.createForClass(Announcement)