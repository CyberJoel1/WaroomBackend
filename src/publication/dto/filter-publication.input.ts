import { InputType, Int, Field, Float } from '@nestjs/graphql';
import { IsEnum, IsOptional, MaxLength, maxLength } from 'class-validator';
import { validTypesPublication } from '../enums/category.publication';

@InputType()
export class FilterPublicationInput {
  
  @Field(() => Float, { description: 'Nombre de usuario' ,nullable:true, defaultValue:500})
  @IsOptional()
  rango: number;

  @Field(() => Float, { description: 'Nombre de usuario' ,nullable:true, defaultValue:-79.1642189})
  @IsOptional()
  longitud: number;

  @Field(() => Float, { description: 'Nombre de usuario' ,nullable:true,defaultValue:-0.2411834})
  @IsOptional()
  latitud: number;

  @Field(() => Int, { description: 'Nombre de usuario' ,nullable:true,defaultValue:0})
  @IsOptional()
  banos: number;

  @Field(() => Int, { description: 'Nombre de usuario' ,nullable:true,defaultValue:0})
  @IsOptional()
  habitaciones: number;

  @Field(() => Int, { description: 'Nombre de usuario' ,nullable:true,defaultValue:1})
  @IsOptional()
  minMedida: number;

  @Field(() => Int, { description: 'Nombre de usuario' ,nullable:true,defaultValue:100000000})
  @IsOptional()
  maxMedida: number;

}


