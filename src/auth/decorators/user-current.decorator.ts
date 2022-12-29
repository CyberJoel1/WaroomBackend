import { createParamDecorator, ExecutionContext, ForbiddenException, InternalServerErrorException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { validRoles } from '../enums/valid-roles.enum';
import { User } from '../../user/entities/user.entity';

export const CurrentUser = createParamDecorator( 
    ( roles: validRoles[] = [], context: ExecutionContext ) => {

        const ctx = GqlExecutionContext.create( context )
        const user: User = ctx.getContext().req.user;
        if ( !user ) {
            throw new InternalServerErrorException(`No user inside the request - make sure that we used the AuthGuard`)
        }

        if ( roles.length === 0 ) return user;

        for ( const role of user.roles ) {
            //TODO: Eliminar Valid Roles
            if ( roles.includes( role as validRoles ) ) {
                return user;
            }
        }

        throw new ForbiddenException(
            `User ${ user.userName } need a valid role [${ roles }]`
        )

})