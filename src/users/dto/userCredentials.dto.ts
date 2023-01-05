import { IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UserCredentialsDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Field(() => String)
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(
    /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
    { message: 'password too weak' },
  )
  @Field(() => String)
  password: string;
}
