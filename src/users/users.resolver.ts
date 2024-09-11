import {
  UseGuards,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Query, Mutation, Args, Resolver, ID } from '@nestjs/graphql';
import { Types } from 'mongoose';
import { UsersService } from './users.service';
import { User, UserDocument } from './schemas/user.schema';
import { GetUsersFilterDto } from './dto/getUsersFilter.dto';
import { GetUsersResponseDto } from './dto/getUsersResponse.dto';
import { ObjectIdValidationPipe } from '../helpers/pipes/objectIdValidation.pipe';
import RequiredUserAuthGuard from '../helpers/guards/RequiredUserAuth.guard';
import RolesGuard from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { GetUser } from './getUser.decorator';
import { Role } from '../enums/role.enum';

@Roles(Role.Admin)
@UseGuards(RequiredUserAuthGuard, RolesGuard)
@Resolver(() => User)
export class UsersResolver {
  private logger = new Logger('UsersResolver');

  constructor(private usersService: UsersService) { }

  @Query(() => GetUsersResponseDto)
  getUsers(
    @Args('usersFilterDto') usersFilterDto: GetUsersFilterDto,
  ): Promise<GetUsersResponseDto> {
    this.logger.verbose(
      `Retrieving users. Filters: ${JSON.stringify(usersFilterDto)}`,
    );

    return this.usersService.getUsers(usersFilterDto);
  }

  @Mutation(() => String)
  deleteUser(
    @Args('id', { type: () => ID }, new ObjectIdValidationPipe()) id: Types.ObjectId,
    @GetUser() { _id }: UserDocument,
  ) {
    if (id.equals(_id)) {
      throw new ForbiddenException('User cannot delete himself!');
    }

    return this.usersService.deleteUser(id);
  }
}
