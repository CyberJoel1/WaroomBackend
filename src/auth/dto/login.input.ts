import { InputType, Int, Field } from '@nestjs/graphql';
import { IsEmail, IsOptional, MinLength } from 'class-validator';

@InputType()
export class LoginInput {

    @Field(()=>String, {nullable:true})
    @IsEmail({message:'El campo debe ser un email'})
    @IsOptional()
    addressEmail: string;

    @Field(()=>String, {nullable:true})
    @IsOptional()
    userName: string;


    @Field(()=>String)
    @MinLength(6,{message:'El password debe tener al menos 6 caracteres'})
    password: string;
}
