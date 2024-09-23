import { UseGuards, Logger } from '@nestjs/common';
import { Types } from 'mongoose';
import { Query, Mutation, Args, Resolver, ID } from '@nestjs/graphql';
import sanitizeHtml from 'sanitize-html';
import sanitizeHtmlConfig from './sanitizeHtmlConfig';
import { PostDocument, Post } from './schemas/post.schema';
import { UserDocument } from '../users/schemas/user.schema';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/createPost.dto';
import { GetPostsFilterDto } from './dto/getPostsFilter.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import { GetUser } from '../users/getUser.decorator';
import { Roles } from '../roles/roles.decorator';
import { ObjectIdValidationPipe } from '../helpers/pipes/objectIdValidation.pipe';
import RequiredUserAuthGuard from '../helpers/guards/RequiredUserAuth.guard';
import RolesGuard from '../roles/roles.guard';
import { Role } from '../enums/role.enum';
import { GetPostsResponseDtoDto } from './dto/getPostsResponseDto.dto';

@Resolver(() => Post)
export class PostsResolver {
  private logger = new Logger('PostsResolver');

  constructor(private postsService: PostsService) { }

  @Roles(Role.User, Role.Admin)
  @UseGuards(RequiredUserAuthGuard, RolesGuard)
  @Mutation(() => Post)
  createPost(
    @Args('createPostDto') {
      title,
      body,
      resources,
      categories,
    }: CreatePostDto,
    @GetUser() user: UserDocument,
  ): Promise<PostDocument> {
    this.logger.verbose(
      `User "${user.username}" creating a new post. Data: ${JSON.stringify({ title, body })}`,
    );

    return this.postsService.createPost(
      {
        title,
        resources,
        categories,
        body: sanitizeHtml(body, sanitizeHtmlConfig),
      },
      user,
    );
  }

  @UseGuards(RequiredUserAuthGuard)
  @Query(() => GetPostsResponseDtoDto)
  getPosts(
    @Args('filterDto') filterDto: GetPostsFilterDto,
    @GetUser() user: UserDocument,
  ): Promise<GetPostsResponseDtoDto> {
    this.logger.verbose(
      `Retrieving the posts. Filters: ${JSON.stringify(filterDto)}`,
    );

    return this.postsService.getPostsWithAggregations(filterDto, user);
  }

  @Roles(Role.User, Role.Admin)
  @UseGuards(RequiredUserAuthGuard, RolesGuard)
  @Mutation(() => Post)
  updatePost(
    @Args('id', { type: () => ID }, new ObjectIdValidationPipe()) id: Types.ObjectId,
    @Args('updatePostDto') {
      title,
      body,
      resources,
      categories,
    }: UpdatePostDto,
    @GetUser() user: UserDocument,
  ): Promise<PostDocument> {
    return this.postsService.updatePost(
      id,
      {
        title,
        resources,
        categories,
        body: sanitizeHtml(body, sanitizeHtmlConfig),
      },
      user,
    );
  }

  @Roles(Role.User, Role.Admin)
  @UseGuards(RequiredUserAuthGuard, RolesGuard)
  @Mutation(() => String)
  deletePost(
    @Args('id', { type: () => ID }, new ObjectIdValidationPipe()) id: Types.ObjectId,
    @GetUser() user: UserDocument,
  ): Promise<string> {
    return this.postsService.deletePost(id, user);
  }
}
