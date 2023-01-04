import { InputType, Int, Field, Float } from '@nestjs/graphql';
import { IsOptional, MaxLength, maxLength } from 'class-validator';

@InputType()
export class CreatePublicationInput {
  
  @Field(() => String, { description: 'Nombre de usuario' ,nullable:true})
  @IsOptional()
  @MaxLength(200)
  titulo: String;

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
  @MaxLength(800)
  message: String;

  @Field(() => [String], { description: 'Nombre de usuario' ,nullable:true, defaultValue:[]})
  @IsOptional()
  photos: [String];

  @Field(() => Boolean, { description: 'roles permitidos de usuario' , defaultValue:true})
  @IsOptional()
  activo?: boolean;

  @Field(() => String, { description: 'roles permitidos de usuario' , defaultValue:'venta'})
  @IsOptional()
  tipo?: String;

}


