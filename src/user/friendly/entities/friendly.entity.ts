import { ObjectType, Field, Int } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { User } from 'src/user/entities/user.entity';

@ObjectType()
export class Friendly {
  @Field(() => Int, { description: 'Example field (placeholder)' , nullable:true})
  @IsOptional()
  idRelation: number;

  @Field(() => User, { description: 'Example field (placeholder)' , nullable:true})
  @IsOptional()
  user: User;

}
