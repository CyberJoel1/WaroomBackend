import { registerEnumType } from "@nestjs/graphql";

export enum validTypesPublication {
    arriendo     = 'arriendo', 
    venta        = 'venta',
}

registerEnumType( validTypesPublication, { name: 'validTypesPublication', description: 'Tipos de publicaciones' } )