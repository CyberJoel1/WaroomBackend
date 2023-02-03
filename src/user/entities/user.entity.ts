import { ObjectType, Field, Int, GraphQLISODateTime } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@ObjectType()
export class User {
  @Field(() => Int, { description: 'ID en la base de datos' ,nullable: true})
  id: number;

  @Field(() => String, { description: 'Nombre completo del usuario',nullable:true })
  @IsOptional()
  fullName: string;
  
  @Field(() => String, { description: 'Nombre de usuario' ,nullable: true})
  userName: string;

  @Field(() => String, { description: 'Contraseña de usuario' ,nullable: true})
  password: string;

  @Field(() => String, { description: 'Documento de identificación' ,nullable: true})
  identification: string;

  @Field(() => [String], { description: 'Roles de usuario' ,nullable: true})
  roles: [string];
  
  @Field(() => String, { description: 'Email del usuario' ,nullable: true})
  addressEmail: string;


  @Field(() => String, { description: 'foto de perfil' ,nullable:true})
  @IsOptional()
  foto: String;
}
