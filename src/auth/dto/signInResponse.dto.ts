/* tslint:disable variable-name */
import { ObjectType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { Role } from '../../enums/role.enum';

@ObjectType()
export class SignInResponseDto {
  @IsNotEmpty()
  @Field(() => String)
  accessToken: string;

  @IsNotEmpty()
  @Field(() => String)
  refreshToken: string;

  @IsNotEmpty()
  @Field(() => String)
  username: string;

  @IsNotEmpty()
  @Field(() => [Role])
  roles: Role[];

  @IsNotEmpty()
  @Field(() => String)
  _id: string;
}
