import { Connection } from "cypher-query-builder";
import { Driver } from "neo4j-driver";
import { Neo4jConfig } from "./neo4j-config.interface";

export class ConnectionError extends Error{
    constructor(oldError:Error){
        super();
        this.message = 'Connection not stablished';
        this.name= 'Connection neo4j error';
        this.stack = oldError.stack;
    }

  }

  export const createDatabaseConfig = (
    //configService:ConfigService,
    customConfig?: Neo4jConfig,
  ): Neo4jConfig =>
    null || {
      host: '5773f270.databases.neo4j.io',
      password: 'ZXzVeCP18HbnLGMms9_v5dUilBfWgS0VnOaEk8dYIQY',
      port: '7687',
      scheme: 'neo4j+s',
      username: 'neo4j',
    };

    export type ConnectionWithDriver = Connection & {
        driver: Driver;
      };