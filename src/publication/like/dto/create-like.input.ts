import { InputType, Int, Field } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@InputType()
export class CreateLikeInput {

  @Field(() => Int, { description: 'Example field (placeholder)',nullable:true })
  @IsOptional()
  idPublication: number;
}
