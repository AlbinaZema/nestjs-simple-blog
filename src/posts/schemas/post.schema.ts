import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Logger } from '@nestjs/common';
import { Field, ObjectType } from '@nestjs/graphql';

const logger = new Logger('PostSchema');

@Schema({
  toJSON: { virtuals: true, versionKey: false },
})
@ObjectType()
export class Post {
  @Field(() => String)
  _id: Types.ObjectId;

  @Prop({ required: true })
  @Field(() => String)
  title: string;

  @Prop({ required: true })
  @Field(() => String)
  body: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  @Field(() => String)
  user: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Resource' }] })
  @Field(() => [String])
  resources: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Category' }] })
  @Field(() => [String])
  categories: Types.ObjectId[];

  @Prop({ default: Date.now })
  @Field(() => Date)
  createdAt: Date;
}

export type PostDocument = Post & Document;
export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.index({ user: 1, createdAt: -1 });
PostSchema.index({ categories: 1 });
PostSchema.index({ title: 'text', body: 'text' });

['findOneAndDelete', 'deleteMany'].forEach(
  (queryName: string) => PostSchema.pre(queryName, async function(next) {
    const posts: PostDocument[] = await this.find(this);

    try {
      await Promise.all(posts.map(async (post: PostDocument) => {
        await post.model('Resource').deleteMany(
          { post: post._id },
          null,
        );

        logger.verbose(
          `Removed Resources related to Post with id: ${post._id}`,
        );
      }));
    } catch (error) {
      return next(error);
    }
  }),
);
