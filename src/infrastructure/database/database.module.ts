import 'dotenv/config';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Make } from '../../domain/entities/make.entity';
import { VehicleType } from '../../domain/entities/vehicle-type.entity';
import { MakeRepositoryAdapter } from '../persistence/make.repository.adapter';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      synchronize: true,
      entities: [Make, VehicleType],
    }),
    TypeOrmModule.forFeature([Make, VehicleType]),
  ],
  providers: [MakeRepositoryAdapter],
  exports: [MakeRepositoryAdapter],
})
export class DatabaseModule {}
