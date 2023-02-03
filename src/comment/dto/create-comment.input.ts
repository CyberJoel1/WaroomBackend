import { InputType, Int, Field } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@InputType()
export class CreateCommentInput {

  @Field(() => Int, { description: 'Example field (placeholder)',nullable:true })
  @IsOptional()
  idPublication: number;

  @Field(() => String, { description: 'Example field (placeholder)',nullable:true })
  @IsOptional()
  comment: string;

  @Field(() => Boolean, { description: 'Example field (placeholder)',nullable:true })
  @IsOptional()
  autor: boolean;

}
