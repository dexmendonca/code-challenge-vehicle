import { Module } from '@nestjs/common';
import { MakeService } from '../../../application/services/make.service';

import { HttpModule } from '@nestjs/axios';
import { RedisCacheModule } from '../../../infrastructure/cache/redis-cache.module';
import { DatabaseModule } from '../../../infrastructure/database/database.module';
import { MakeResolver } from './make.resolver';

@Module({
  imports: [DatabaseModule, HttpModule, RedisCacheModule],
  providers: [MakeService, MakeResolver],
})
export class MakeModule {}
