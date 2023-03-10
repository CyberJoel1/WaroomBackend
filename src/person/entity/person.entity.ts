import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Person {

    @Field( () => Int )
    id: number;

    @Field( () => String )
    name: string;

    @Field( () => Int , { nullable: true , description: 'Valor de nacimiento'})
    born: number;

}