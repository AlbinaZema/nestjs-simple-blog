import { IsOptional } from 'class-validator';
import { Types } from 'mongoose';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdatePostDto {
  @IsOptional()
  @Field(() => String, { nullable: true })
  title: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  body: string;

  @Field(() => [String], { nullable: true })
  resources?: Types.ObjectId[];

  @Field(() => [String], { nullable: true })
  categories?: Types.ObjectId[];
}
