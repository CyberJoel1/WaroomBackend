import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class messageUpdate{
    

    @Field(() => String, { description: 'Devuelve el mensaje de actualización' ,nullable: true})
    message: string;


}