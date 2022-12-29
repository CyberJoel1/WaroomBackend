import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { 
  ApolloServerPluginLandingPageLocalDefault 
 } from 'apollo-server-core';
import { Neo4jModule } from './neo4j/neo4j.module';
import { ConfigModule } from '@nestjs/config';
import { PersonModule } from './person/person.module';

import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { DateScalar } from './scalars/DateScalar.scalars';
import { UtilsMoment } from './utils/moment.js/utils-momentjs';
import moment from 'moment';
import { JwtService } from '@nestjs/jwt';
import { PublicationModule } from './publication/publication.module';






@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    // GraphQLModule.forRoot<ApolloDriverConfig>({
    //   driver: ApolloDriver,
    //   autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    //   playground: false,
    //   plugins: [
    //   ApolloServerPluginLandingPageLocalDefault
    //   ]

    // })
    GraphQLModule.forRootAsync({
      driver: ApolloDriver,
      
      imports: [ AuthModule ],
      inject: [ JwtService ],
      useFactory: async( jwtService: JwtService ) => ({
        playground: false,
        cors: {
          
          "origin": "*",
          "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
          
      },
        autoSchemaFile: join( process.cwd(), 'src/schema.gql'), 
        plugins: [
          ApolloServerPluginLandingPageLocalDefault
        ],
        context({ req }) {
          // const token = req.headers.authorization?.replace('Bearer ','');
          // if ( !token ) throw Error('Token needed');

          // const payload = jwtService.decode( token );
          // if ( !payload ) throw Error('Token not valid');
          
        }
      })
    }),

    
ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' ,}),
    Neo4jModule.forRootAsync(),
    PersonModule,
    UserModule,
    AuthModule,
    PublicationModule,
  
    
  ],
  controllers:[],
  providers:[DateScalar,UtilsMoment,{
    provide: 'MomentWrapper',
    useValue: moment
  }],
  exports:[DateScalar,UtilsMoment]
})
export class AppModule {}