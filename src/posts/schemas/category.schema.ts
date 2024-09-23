import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Field, ObjectType } from '@nestjs/graphql';

@Schema({ toJSON: { virtuals: true, versionKey: false } })
@ObjectType()
export class Category {
  @Field(() => String)
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  @Field(() => String)
  name: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Post' }] })
  @Field(() => [String])
  posts: Types.ObjectId[];
}

export type CategoryDocument = Category & Document;
export const CategorySchema = SchemaFactory.createForClass(Category);
CategorySchema.index({ name: 1 });
