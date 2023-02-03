import { ObjectType, Field, Int } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { User } from 'src/user/entities/user.entity';

@ObjectType()
export class Chat {
  @Field(() => String, { description: 'Escucha mediante este id' , nullable:true})
  @IsOptional()
  idListened: string;

  @Field(() => Int, { description: 'Envia mensajes a este id' , nullable:true})
  @IsOptional()
  IsSend: number;

}
