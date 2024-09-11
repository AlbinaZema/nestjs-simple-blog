import { IsNotEmpty, IsOptional } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GetUsersFilterDto {
  @IsOptional()
  @IsNotEmpty()
  @Field(() => String, { nullable: true })
  username?: string;

  @IsOptional()
  @Field({ nullable: true })
  sorting?: 1|-1;

  @IsOptional()
  @Field({ nullable: true })
  pageNumber?: number;

  @IsOptional()
  @Field({ nullable: true })
  pageSize?: number;
}
