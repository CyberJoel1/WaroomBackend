import { CreateUserInput } from './create-user.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsDate, IsDateString, IsEnum, IsNotEmpty, IsOptional, Length, MaxDate, MaxLength, MinDate } from 'class-validator';
import { TypesUser } from '../enums/tiposUser.enums';
import { UtilsMoment } from 'src/utils/moment.js/utils-momentjs';
import { Transform } from 'class-transformer';

@InputType()
export class UpdateUserInput{


  @Field(() => String, { description: 'Nombre completo del usuario',nullable:true })
  @IsOptional()
  fullName: string;

  @Field(() => [String], { description: 'roles permitidos de usuario' , defaultValue:['client']})
  @IsOptional()
  roles?: string[];

  @Field(() => Boolean, { description: 'usuario activo o no', defaultValue: true})
  @IsOptional()
  isActive?: boolean;

  @Field(() => Date, { description: 'Fecha de nacimiento del usuario' ,nullable:true})
  @IsNotEmpty()
  @Transform( ({ value }) => new Date(value))
  @IsDate()
  @MinDate(new Date("01/01/1900"),{message:'La fecha es menor que 01/01/1900',})
  @MaxDate(UtilsMoment.calculateAgeAdult(),{message: 'Lo lamentamos, la plataforma es solo para mayores de 18'})
  dateBirth: Date;

  @Field(() => String, { description: 'password user' ,nullable:true})
  @IsOptional()
  password: String;

  @Field(() => String, { description: 'Nombre de usuario' ,nullable:true})
  @IsOptional()
  userName: String;

  @Field(() => String, { description: 'Email del usuario' ,nullable:true})
  @IsOptional()
  addressEmail: String;

  @Length(10)
  @Field(() => String, { description: 'Documento de identificación de un usuario' ,nullable:true})
  @IsOptional()
  identification: String;

  @IsEnum(TypesUser)
  @Field(() => String, { description: 'Tipo de usuario' ,nullable:true, defaultValue:'No definido'})
  @IsOptional()
  tipos: String;

  
  @Field(() => String, { description: 'foto de perfil' ,nullable:true})
  @IsOptional()
  foto: string;
}
