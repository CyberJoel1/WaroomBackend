import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class messageComment{

    @Field(() => Boolean, { description: 'Devuelve el mensaje de actualización' ,nullable: true})
    confirmMessage: boolean;


}