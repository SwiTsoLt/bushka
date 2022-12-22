import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { Region } from "./region.schema";

export type CityDocument = City & Document

@Schema()
export class City {
    @Prop({ required: true })
    title: string

    @Prop({ required: true })
    index: number

    @Prop({ required: true })
    regions: Region[]
}

export const CitySchema = SchemaFactory.createForClass(City)