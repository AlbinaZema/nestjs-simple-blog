import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { resolve } from 'path';
import { AuthModule } from '../auth/auth.module';
import { ResourcesService } from './resources.service';
import { ResourcesResolver } from './resources.resolver';
import ResourcesSchema, { Resource } from './schemas/resource.schema';
import * as config from 'config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Resource.name, schema: ResourcesSchema }]),
    MulterModule.register({ dest: resolve(config.get('uploads.path')) }),
    AuthModule,
  ],
  providers: [ResourcesService, ResourcesResolver],
  exports: [ResourcesService],
})
export class ResourcesModule {}
