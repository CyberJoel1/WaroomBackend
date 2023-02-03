import { ObjectType, Field, Int } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { User } from 'src/user/entities/user.entity';

@ObjectType()
export class Comment {

  @Field(() => Int, { description: 'Example field (placeholder)' ,nullable:true})
  @IsOptional()
  id: number;

  @Field(() => String, { description: 'Example field (placeholder)' ,nullable:true})
  @IsOptional()
  comment: string;

  @Field(() => Boolean, { description: 'Example field (placeholder)',nullable:true })
  @IsOptional()
  autor: boolean;

  @Field(() => User, { description: 'Fecha de creación' ,nullable:true})
  @IsOptional()
  user: User;

  @Field(() => String, { description: 'Fecha de creación' ,nullable:true})
  @IsOptional()
  date_created: string;
}
