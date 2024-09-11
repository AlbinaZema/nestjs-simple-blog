import { Post } from '../schemas/post.schema';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GetPostsResponseDtoDto {
  @Field(() => [Post])
  posts: Post[];

  @Field()
  total: number;
}
