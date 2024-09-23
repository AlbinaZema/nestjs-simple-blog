import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Post, PostDocument } from './schemas/post.schema';
import { UserDocument } from '../users/schemas/user.schema';
import { GetPostsFilterDto } from './dto/getPostsFilter.dto';
import { CreatePostDto } from './dto/createPost.dto';
import { Category, CategoryDocument } from './schemas/category.schema';
import { Resource, ResourceDocument } from './schemas/resource.schema';
import { UpdatePostDto } from './dto/updatePost.dto';

const throwPostNotFoundError = (postId: string|Types.ObjectId): never => {
  throw new NotFoundException(`Post with ID "${postId}" not found`);
};

const userDefaultPopulationConfig = { path: 'user', select: '_id' };

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
    @InjectModel(Category.name) private readonly categoryModel: Model<CategoryDocument>,
    @InjectModel(Resource.name) private readonly resourceModel: Model<ResourceDocument>,
  ) {}

  /**
   * Creates a new post
   * @param createPostDto
   * @param user
   */
  async createPost(
    createPostDto: CreatePostDto,
    user: UserDocument,
  ): Promise<PostDocument> {
    const createdPost = await this.postModel.create({
      ...createPostDto,
      user: user._id,
    });

    return createdPost.populate(userDefaultPopulationConfig);
  }

  /**
   * Get a single post by id
   * @param filterDto
   * @param user
   */
  async getPostsWithAggregations(
    filterDto: GetPostsFilterDto,
    user: UserDocument,
  ): Promise<{ posts: PostDocument[], total: number }> {
    const { text, sorting, pageNumber, pageSize, personal, category } = filterDto;
    const pipeline = [];

    if (personal) {
      pipeline.push({ $match: { user: user._id } });
    }

    if (category) {
      pipeline.push({
        $lookup: {
          from: 'categories',
          localField: 'categories',
          foreignField: '_id',
          as: 'category_info',
        },
      });
      pipeline.push({ $match: { 'category_info._id': category } });
    }

    if (text) {
      pipeline.push({
        $match: { $text: { $search: text } },
      });
    }

    pipeline.push({
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'user_info',
      },
    });

    pipeline.push({
      $lookup: {
        from: 'resources',
        localField: 'resources',
        foreignField: '_id',
        as: 'resources_info',
      },
    });

    if (sorting) {
      pipeline.push({ $sort: { createdAt: sorting } });
    }

    const postsQuery = this.postModel.aggregate(pipeline);

    if (pageNumber && pageSize) {
      postsQuery.skip((pageNumber - 1) * pageSize).limit(pageSize);
    }

    const posts = await postsQuery.exec();
    const total = await this.postModel.countDocuments().exec();

    return { posts, total };
  }

  /**
   * Updates post details
   * @param postId
   * @param createPostDto
   * @param user
   */
  async updatePost(
    postId: Types.ObjectId,
    createPostDto: UpdatePostDto,
    user: UserDocument,
  ): Promise<PostDocument> {
    const updatedPost = await this.postModel.findOneAndUpdate(
      { _id: postId, user: user._id },
      createPostDto,
      { new: true },
    );

    if (!updatedPost) {
      throw new NotFoundException(`Post with ID "${postId}" not found`);
    }

    return updatedPost.populate('user categories resources');
  }

  /**
   * Deletes a post found by id and owner
   * @param postId
   * @param user
   */
  async deletePost(
    postId: Types.ObjectId,
    user: UserDocument,
  ): Promise<string> {
    const deletedPost = await this.postModel.findOneAndDelete(
      { _id: postId, user: user._id },
    );

    if (!deletedPost) {
      throw new NotFoundException(`Post with ID "${postId}" not found`);
    }

    await this.resourceModel.deleteMany({ post: deletedPost._id });

    return `Post with ID "${deletedPost._id}" has been deleted`;
  }
}
