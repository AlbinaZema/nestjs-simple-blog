import { IsOptional } from 'class-validator';
import { Types } from 'mongoose';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GetUserFilterDto {
  @IsOptional()
  @Field(() => String)
  id?: Types.ObjectId;

  @IsOptional()
  @Field(() => String)
  username?: string;
}
