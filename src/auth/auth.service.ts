import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import Redis from 'ioredis';
import { UsersService } from '../users/users.service';
import { UserDocument } from '../users/schemas/user.schema';
import { SignInResponseDto } from './dto/signInResponse.dto';
import { UserCredentialsDto } from '../users/dto/userCredentials.dto';
import JwtPayload from './jwt/jwtPayload.interface';
import * as config from 'config';

@Injectable()
export class AuthService {
  private static redisInstance: Redis.Redis;

  private logger = new Logger('AuthService');

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {
    if (!AuthService.redisInstance) {
      const { host, port } = config.default.redis;

      AuthService.redisInstance = new Redis({
        keyPrefix: 'jwt-refresh_',
        host: host || process.env.REDIS_HOST,
        port: port || process.env.REDIS_PORT,
      });
    }
  }

  /**
   * Creates new user with received credentials
   * @param userCredentialsDto
   */
  async signUp(userCredentialsDto: UserCredentialsDto): Promise<UserDocument> {
    return await this.usersService.createUser(userCredentialsDto);
  }

  /**
   * Checks passed credentials are valid
   * and generates JWT access and refresh tokens
   * @param username
   * @param password
   */
  async signIn(
    { username, password }: UserCredentialsDto,
  ): Promise<SignInResponseDto> {
    const user: UserDocument = await this.usersService.getUser({ username });

    if (!user || !(await user.validatePassword(password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { _id, roles } = user;
    const payload: JwtPayload = { username, _id };
    const accessToken = this.jwtService.sign(payload);
    const refreshTokenExpiration = process.env.REFRESH_TOKEN_EXPIRATION || config.default.jwt.expiresIn.refreshToken;
    const refreshToken = await AuthService.redisInstance.get(_id) || this.jwtService.sign(payload, {
      expiresIn: refreshTokenExpiration,
    });

    // Writing to the Redis to make able to reset refresh token
    await AuthService.redisInstance.set(
      _id,
      refreshToken,
      'ex',
      refreshTokenExpiration,
    );

    this.logger.debug(`Generated JWT Token with payload ${JSON.stringify(payload)}`);

    return { accessToken, refreshToken, username, _id, roles };
  }

  /**
   * Resets refresh token
   * @param userId
   */
  async signOut(userId: string) {
    this.logger.debug(`Reset Refresh Token for user with id: ${userId}`);

    await AuthService.redisInstance.del(userId);
    return 'user logout';
  }

  /**
   * Refreshes access token if passed refresh token is valid
   * @param refreshToken
   */
  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const { _id, username }: JwtPayload = await this.jwtService.verify(refreshToken);

      if (await AuthService.redisInstance.get(_id)) {
        const accessToken = await this.jwtService.sign({ _id, username });

        return { accessToken };
      }
    } catch (error) {
      this.logger.debug(`Cannot refresh token: ${error.toString()}`);
    }

    throw new UnauthorizedException(
      'The refresh token is expired, or it is wrong',
    );
  }
}
