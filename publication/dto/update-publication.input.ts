import { CreatePublicationInput } from './create-publication.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdatePublicationInput extends PartialType(CreatePublicationInput) {
  @Field(() => Int)
  id: number;
}
