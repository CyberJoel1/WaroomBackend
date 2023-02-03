import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional } from 'class-validator';
import { User } from 'src/user/entities/user.entity';
import { validTypesPublication } from '../enums/category.publication';

@ObjectType()
export class Publication {
  @Field(() => Int, { description: 'Id del publicación' ,nullable:true})
  @IsOptional()
  identity: Number;
  
  
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
  
  @Field(() => validTypesPublication, { description: 'tipos de inmueble' , defaultValue:'venta'})
  @IsOptional()
  tipo?: String;


  @Field(() => String, { description: 'Fecha de creación' ,nullable:true})
  @Transform( ({ value }) => new Date(value))
  date_created: Date;

  @Field(() => User, { description: 'Fecha de creación' ,nullable:true})
  @IsOptional()
  user: User;



}
