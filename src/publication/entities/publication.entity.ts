import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Publication {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
