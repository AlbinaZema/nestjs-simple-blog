import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Field, ObjectType } from '@nestjs/graphql';

@Schema({ toJSON: { virtuals: true, versionKey: false } })
@ObjectType()
export class Resource {
  @Field(() => String)
  _id: Types.ObjectId;

  @Prop({ required: true })
  @Field(() => String)
  url: string;

  @Prop({ required: true })
  @Field(() => String)
  type: string;

  @Prop({ type: Types.ObjectId, ref: 'Post' })
  @Field(() => String)
  post: Types.ObjectId;
}

export type ResourceDocument = Resource & Document;
export const ResourceSchema = SchemaFactory.createForClass(Resource);
ResourceSchema.index({ post: 1 });
