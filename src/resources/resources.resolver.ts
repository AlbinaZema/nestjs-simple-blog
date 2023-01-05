import {
  Controller,
  Post,
  Body,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  Logger,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResourcesService } from './resources.service';
import { Resource, ResourceDocument } from './schemas/resource.schema';
import RequiredUserAuthGuard from '../helpers/guards/RequiredUserAuth.guard';
import RolesGuard from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { Role } from '../enums/role.enum';
import { Mutation, Args, Resolver, ID } from '@nestjs/graphql';

@Resolver(() => Resource)
@Roles(Role.User, Role.Admin)
@UseGuards(RequiredUserAuthGuard, RolesGuard)
export class ResourcesResolver {
  private logger = new Logger('ResourcesResolver');

  constructor(private resourcesService: ResourcesService) {}

  @Mutation(() => Resource)
  @UseInterceptors(FileInterceptor('file'))
  uploadResource(
    @UploadedFile() { filename },
    @Args(
      'postId',
      { type: () => ID },
    ) post?: Types.ObjectId,
  ): Promise<ResourceDocument> {
    this.logger.verbose('Uploading a new resource');

    return this.resourcesService.createResource({ filename, post });
  }
}
