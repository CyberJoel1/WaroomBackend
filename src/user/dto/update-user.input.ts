import { CreateUserInput } from './create-user.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsDate, IsDateString, IsNotEmpty, IsOptional, Length, MaxDate, MaxLength, MinDate } from 'class-validator';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field(() => Int,{ description: 'Nombre completo del usuario',nullable:true })
  @IsOptional()
  id: number;
}
