import 'dotenv/config';

import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

import { MakeModule } from './interface/graphql/resolvers/make.module';

@Module({
  imports: [
    HttpModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      sortSchema: true,
      playground: true,
      introspection: true,
    }),
    MakeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
