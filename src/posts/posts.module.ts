import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './schemas/post.schema';
import { PostsResolver } from './posts.resolver';
import { PostsService } from './posts.service';
import { AuthModule } from '../auth/auth.module';
import { Category, CategorySchema } from './schemas/category.schema';
import { Resource, ResourceSchema } from './schemas/resource.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Resource.name, schema: ResourceSchema },
    ]),
    AuthModule,
  ],
  providers: [PostsService, PostsResolver],
})
export class PostsModule {}
