import { IsNotEmpty, IsOptional } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';
import { Types } from 'mongoose';

@InputType()
export class GetPostsFilterDto {
  @IsOptional()
  @IsNotEmpty()
  @Field(() => String, { nullable: true })
  text?: string;

  @IsOptional()
  @Field({ nullable: true })
  sorting?: 1|-1;

  @IsOptional()
  @Field({ nullable: true })
  pageNumber?: number;

  @IsOptional()
  @Field({ nullable: true })
  pageSize?: number;

  @IsOptional()
  @Field(() => String, { nullable: true })
  user?: string;

  @IsOptional()
  @Field({ nullable: true })
  personal?: boolean;

  @IsOptional()
  @Field(() => String, { nullable: true })
  category: Types.ObjectId;
}
