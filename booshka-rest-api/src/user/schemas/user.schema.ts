import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type UserDocument = User & Document

@Schema()
export class User {
    @Prop({ required: true })
    gmail: string

    @Prop({ required: true })
    password: string

    @Prop({ required: true })
    firstName: string

    @Prop({ required: true })
    lastName: string

    @Prop()
    roles: string[]

    @Prop({ required: true })
    city: string

    @Prop({ required: true })
    region: string

    @Prop({ required: true })
    phone: string

    @Prop()
    favorites: string[]

    @Prop()
    registrationDate: Date
}

export const UserSchema = SchemaFactory.createForClass(User)