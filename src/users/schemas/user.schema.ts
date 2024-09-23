import * as bcrypt from 'bcryptjs';
import { Document } from 'mongoose';
import { Logger } from '@nestjs/common';
import { Role } from '../../enums/role.enum';
import { Field, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

const logger = new Logger('UserSchema');

@Schema()
@ObjectType()
export class User {
  @Field(() => String)
  _id: Types.ObjectId;

  @IsString()
  @Prop({ required: true, unique: true })
  @Field({ nullable: false })
  username: string;

  @IsString()
  @Prop({ required: true })
  @Field({ nullable: false })
  password: string;

  @IsString()
  @Prop({ required: true, hidden: true })
  @Field()
  salt: string;

  @Prop({ required: true, default: Date.now })
  @Field({ nullable: false })
  createdAt: Date;

  @Prop({ required: true, default: [Role.User] })
  @Field(() => [Role], { nullable: false })
  roles: Role[];

  public async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);

    return hash === this.password;
  }
}

export type UserDocument = User & Document;

const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('posts', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'user',
  justOne: false,
});

UserSchema.index({ username: 'text' });
UserSchema.index({ email: 1 }, { unique: true });

// Removing user's posts on user delete
UserSchema.pre('findOneAndDelete', async function(next) {
  const user: UserDocument = await this.findOne(this);

  try {
    await user.model('Post').deleteMany(
      { user: user._id },
      null,
    );
  } catch (error) {
    return next(error);
  }

  logger.verbose(
    `Removed Posts related to User with id: ${user._id}`,
  );
});

UserSchema.loadClass(User);

export default UserSchema;
