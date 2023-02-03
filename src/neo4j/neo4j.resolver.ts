import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class Neo4jResolver {
    @Query(() => String, { name: 'todos' })
    helloWorld() {
      return 'Hello World!';
    }
}
