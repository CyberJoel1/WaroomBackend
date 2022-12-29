import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreatePublicationInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
