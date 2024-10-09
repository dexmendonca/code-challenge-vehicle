import 'dotenv/config';

import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import * as redisStore from 'cache-manager-ioredis';

import { FIVE_MINUTES } from '../../constants/time.constant';
import { RedisCacheService } from './redis-cache.service';

@Module({
  imports: [
    CacheModule.register({
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT),
      ttl: FIVE_MINUTES,
    }),
  ],
  exports: [RedisCacheService],
  providers: [RedisCacheService],
})
export class RedisCacheModule {}
