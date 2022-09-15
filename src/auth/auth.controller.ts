import { Controller, Post, Body, ValidationPipe, UseGuards } from '@nestjs/common';
import { UserDocument } from '../users/schemas/user.schema';
import { AuthService } from './auth.service';
import { UserCredentialsDto } from '../users/dto/userCredentials.dto';
import { SignInResponseDto } from './dto/signInResponse.dto';
import RequiredUserAuthGuard from '../helpers/guards/RequiredUserAuth.guard';
import { GetUser } from '../users/getUser.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
  ) {}

  @Post('/sign-up')
  signUp(
    @Body(ValidationPipe) userCredentialsDto: UserCredentialsDto,
  ): Promise<void> {
    return this.authService.signUp(userCredentialsDto);
  }

  @Post('/sign-in')
  signIn(
    @Body(ValidationPipe) userCredentialsDto: UserCredentialsDto,
  ): Promise<SignInResponseDto> {
    return this.authService.signIn(userCredentialsDto);
  }

  @Post('/logout')
  @UseGuards(RequiredUserAuthGuard)
  signOut(@GetUser() { _id }: UserDocument): Promise<void> {
    return this.authService.signOut(_id);
  }

  @Post('/refreshToken')
  refreshToken(
    @Body() { refreshToken }: { refreshToken: string },
  ): Promise<{ accessToken: string }> {
    return this.authService.refreshToken(refreshToken);
  }
}
