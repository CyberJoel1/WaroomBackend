import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Connection } from 'cypher-query-builder';
import { Neo4jConfig } from './neo4j-config.interface';
import { NEO4J_CONFIG, NEO4J_CONNECTION } from './neo4j.constanst';
import { ConnectionError, ConnectionWithDriver, createDatabaseConfig } from './neo4j.utils';
import { QueryRepository } from './query.repository';
import { Neo4jResolver } from './neo4j.resolver';



@Module({
    providers: [QueryRepository, Neo4jResolver],
})
export class Neo4jModule {
    static forRootAsync(customConfig?: Neo4jConfig): DynamicModule {
        return {
          module: Neo4jModule,
          imports: [ConfigModule],
          global: true,
          providers: [
            {
              provide: NEO4J_CONFIG,
              inject: [ConfigService],
              useFactory: (configService: ConfigService) =>
                createDatabaseConfig(customConfig),
            },
            {
              provide: NEO4J_CONNECTION,
              inject: [NEO4J_CONFIG],
              useFactory: async (config: Neo4jConfig) => {
                try {
                  const { host, scheme, port, username, password } = config;
                  const connection = new Connection(`${scheme}://${host}`, {
                    username,
                    password,
                  }) as ConnectionWithDriver;
                  return connection;
                } catch (error) {
                  throw new ConnectionError(error);
                }
              },
            },
          ],
          exports: [QueryRepository],
        };
      }
}
