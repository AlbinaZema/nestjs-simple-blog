import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import * as dotenv from 'dotenv';

dotenv.config({
  path: '.env',
});

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_DB_URL),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault],
      // for schema first approach
      // typePaths: ['./**/*.graphql'],
      autoSchemaFile: join('/tmp', 'src/schema.gql'),
    }),
    AuthModule,
    UsersModule,
    PostsModule,
  ],
})
export class AppModule {}
