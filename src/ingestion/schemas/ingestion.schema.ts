import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class IngestedDocument extends Document {
    @Prop({ index: true, required: true })
    source: string;

    @Prop({ type: Object, required: true })
    data: Record<string, any>;

    @Prop({ index: true, required: true })
    'data.name': string;

    @Prop({ index: true, required: true })
    'data.address.country': string;

    @Prop({ index: true, required: true })
    'data.address.city': string;
}

export const IngestedSchema = SchemaFactory.createForClass(IngestedDocument);
