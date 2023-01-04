import {  Field, InputType } from "@nestjs/graphql";
import { IsBoolean, IsInt, IsOptional } from "class-validator";

@InputType()
export class PersonInput {

    @Field( () => String, { nullable: true })
    @IsOptional()
    name?: String;

    @Field( () => Number, { nullable: true })
    @IsInt()
    age?: number;

}