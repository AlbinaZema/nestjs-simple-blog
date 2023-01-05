import { ObjectType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@ObjectType()
export class RefreshResponseDto {
  @IsNotEmpty()
  @Field(() => String)
  accessToken: string;
}
