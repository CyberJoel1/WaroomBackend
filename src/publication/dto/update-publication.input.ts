import { CreatePublicationInput } from './create-publication.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@InputType()
export class UpdatePublicationInput extends PartialType(CreatePublicationInput) {
  @Field(() => Int, { description: 'id de publicación' ,nullable:true})
  @IsOptional()
  id: Number;
}
