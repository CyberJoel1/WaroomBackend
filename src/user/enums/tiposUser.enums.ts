import { registerEnumType } from '@nestjs/graphql';

export enum TypesUser {
  masculino = 'Masculino',
  femenino = 'Femenino',
  empresa = 'Empresa',
  noDefined = 'No definido',
}

registerEnumType(TypesUser, {
  name: 'TypesUser',
  description: 'Determine el sexo o tipo de persona que es',
});
