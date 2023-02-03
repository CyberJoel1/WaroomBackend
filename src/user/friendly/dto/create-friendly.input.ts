import { InputType, Int, Field } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@InputType()
export class CreateFriendlyInput {
  @Field(() => Int, { description: 'Example field (placeholder)' , nullable:true})
  @IsOptional()
  userSend: number;

  @Field(() => String, { description: 'Example field (placeholder)'  , nullable:true})
  @IsOptional()
  userReceived: string;
}
