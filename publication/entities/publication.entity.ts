import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@ObjectType()
export class Publication {
  @Field(() => Float, { description: 'Nombre de usuario' ,nullable:true})
  @IsOptional()
  longitud: Number;

  @Field(() => Float, { description: 'Nombre de usuario' ,nullable:true})
  @IsOptional()
  latitud: Number;

  @Field(() => Int, { description: 'Nombre de usuario' ,nullable:true})
  @IsOptional()
  banos: Number;

  @Field(() => Int, { description: 'Nombre de usuario' ,nullable:true})
  @IsOptional()
  habitaciones: Number;

  @Field(() => Float, { description: 'Nombre de usuario' ,nullable:true})
  @IsOptional()
  medida: Number;

  @Field(() => String, { description: 'Nombre de usuario' ,nullable:true})
  @IsOptional()
  titulo: String;


  @Field(() => String, { description: 'Nombre de usuario' ,nullable:true})
  @IsOptional()
  message: String;

  @Field(() => [String], { description: 'Nombre de usuario' ,nullable:true})
  @IsOptional()
  photos: [String];
}
