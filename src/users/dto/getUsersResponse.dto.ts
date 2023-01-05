import { ObjectType, Field } from '@nestjs/graphql';
import { User} from '../schemas/user.schema';

@ObjectType()
export class GetUsersResponseDto {
  @Field(() => [User])
  users: User[];

  @Field()
  total: number;
}
