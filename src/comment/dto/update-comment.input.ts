import { CreateCommentInput } from './create-comment.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@InputType()
export class UpdateCommentInput{

  @Field(() => Int, { description: 'Example field (placeholder)',nullable:true })
  @IsOptional()
  id: number;

  @Field(() => String, { description: 'Example field (placeholder)',nullable:true })
  @IsOptional()
  comment: string;
  
}
