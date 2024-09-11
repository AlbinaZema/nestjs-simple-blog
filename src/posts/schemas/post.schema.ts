import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Logger } from '@nestjs/common';
import { UserDocument } from '../../users/schemas/user.schema';
import { Field, ObjectType } from '@nestjs/graphql';
import PopulatedDocument from '../../types/PopulatedDocument';

const logger = new Logger('PostSchema');

@ObjectType()
@Schema({
  toJSON: {
    virtuals: true,
    versionKey: false,
  },
})
export class Post {
  @Field(() => String)
  _id: Types.ObjectId;

  @Prop({ required: true })
  @Field(() => String)
  title: string;

  @Prop({ required: true })
  @Field(() => String)
  body: string;

  @Prop({ required: true, default: Date.now })
  @Field()
  createdAt: Date;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  @Field(() => String)
  user: Types.ObjectId;
}

export type PostDocument = Post & Document;

export type PopulatedPostWithUser = PopulatedDocument<
  PostDocument,
  UserDocument,
  'user'
>;

const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.virtual('resources', {
  ref: 'Resource',
  localField: '_id',
  foreignField: 'post',
  justOne: false,
});

PostSchema.index({ title: 'text', body: 'text' });

// Removing related resources on post delete
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

export default PostSchema;
