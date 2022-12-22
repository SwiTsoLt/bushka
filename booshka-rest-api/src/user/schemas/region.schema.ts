import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type RegionDocument = Region & Document

@Schema()
export class Region {
    @Prop({ required: true })
    title: string
    
    @Prop({ required: true })
    index: number
}

export const RegionSchema = SchemaFactory.createForClass(Region)