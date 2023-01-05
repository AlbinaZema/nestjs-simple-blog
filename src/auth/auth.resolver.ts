import { Body, ValidationPipe, UseGuards } from '@nestjs/common';
import { UserDocument, User } from '../users/schemas/user.schema';
import { AuthService } from './auth.service';
import { UserCredentialsDto } from '../users/dto/userCredentials.dto';
import { SignInResponseDto } from './dto/signInResponse.dto';
import { RefreshResponseDto } from './dto/refreshResponseDto.dto';
import RequiredUserAuthGuard from '../helpers/guards/RequiredUserAuth.guard';
import { GetUser } from '../users/getUser.decorator';
import { Mutation, Resolver, Args } from '@nestjs/graphql';

@Resolver()
export class AuthResolver {
  constructor(
    private authService: AuthService,
  ) {}

  @Mutation(() => User)
  signUp(
    @Args('userCredentialsDto', ValidationPipe) userCredentialsDto: UserCredentialsDto,
  ): Promise<UserDocument> {
    return this.authService.signUp(userCredentialsDto);
  }

  @Mutation(() => SignInResponseDto)
  signIn(
    @Args('userCredentialsDto', ValidationPipe) userCredentialsDto: UserCredentialsDto,
  ): Promise<SignInResponseDto> {
    return this.authService.signIn(userCredentialsDto);
  }

  @UseGuards(RequiredUserAuthGuard)
  @Mutation(() => String)
  signOut(@GetUser() { _id }: UserDocument): Promise<string> {
    return this.authService.signOut(_id);
  }

  @Mutation(() => RefreshResponseDto)
  refreshToken(
    @Body() { refreshToken }: { refreshToken: string },
  ): Promise<RefreshResponseDto> {
    return this.authService.refreshToken(refreshToken);
  }
}
