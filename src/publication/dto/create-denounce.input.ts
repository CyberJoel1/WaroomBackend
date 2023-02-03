import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { User } from 'src/user/entities/user.entity';

@InputType()
export class DenouncePublication {

  @Field(() => Int, { description: 'Example field (placeholder)' ,nullable:true})
  @IsOptional()
  idPublication: number;

  @Field(() => String, { description: 'Example field (placeholder)' ,nullable:true})
  @IsOptional()
  foto: string;

  @Field(() => String, { description: 'Example field (placeholder)' ,nullable:true})
  @IsOptional()
  comment: string;

  @Field(() => String, { description: 'Example field (placeholder)' ,nullable:true})
  @IsOptional()
  userName: string;

}
