import { IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreatePostDto {
  @IsNotEmpty()
  @Field(() => String)
  title: string;

  @IsNotEmpty()
  @Field(() => String)
  body: string;

  @Field(() => [String], { nullable: true })
  resources: Types.ObjectId[];

  @Field(() => [String], { nullable: true })
  categories: Types.ObjectId[];
}
