import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
const { ApolloServer } = require("apollo-server");
const neo4j = require("neo4j-driver");
const { Neo4jGraphQL } = require("@neo4j/graphql");
import { ConfigService } from '@nestjs/config';

declare const module: any;

async function bootstrap() {
  const driver = neo4j.driver(
    "bolt://localhost:7687",
    neo4j.auth.basic("neo4j", "letmein")
    );

    
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes( 
    new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    })
   );
   app.enableCors();
   app.use(cookieParser('dev'));
   const configService = app.get(ConfigService);
   const port = configService.get<number>('PORT');
  await app.listen(port);
  

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
