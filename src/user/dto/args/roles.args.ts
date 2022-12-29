import { ArgsType, Field } from "@nestjs/graphql";
import { IsArray } from "class-validator";
import { validRoles } from "src/auth/enums/valid-roles.enum";

@ArgsType()
export class ValidRolesArgs{

    @Field( () => [validRoles], { defaultValue:[validRoles.user]})
    @IsArray()
    roles: validRoles[];
}