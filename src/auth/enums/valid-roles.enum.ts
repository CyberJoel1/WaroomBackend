import { registerEnumType } from "@nestjs/graphql";

export enum validRoles {
    admin     = 'admin', 
    user      = 'client',  
    superUser = 'superUser'
}

registerEnumType( validRoles, { name: 'ValidRoles', description: 'Ullamco labore ut ut adipisicing commodo sit elit ullamco eiusmod ut mollit sint.' } )

