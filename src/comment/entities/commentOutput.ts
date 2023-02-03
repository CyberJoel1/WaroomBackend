import { ObjectType, Field, Int } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { User } from 'src/user/entities/user.entity';

@ObjectType()
export class CommentOutput {

  @Field(() => Int, { description: 'Example field (placeholder)' ,nullable:true})
  @IsOptional()
  idCommentary: number;

  @Field(() => User, { description: 'Example field (placeholder)' ,nullable:true})
  @IsOptional()
  user1: User;

  @Field(() => User, { description: 'Example field (placeholder)' ,nullable:true})
  @IsOptional()
  user2: User;

  @Field(() => String, { description: 'Example field (placeholder)' ,nullable:true})
  @IsOptional()
  foto: string;

}
