import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PublicationService } from './publication.service';
import { Publication } from './entities/publication.entity';
import { CreatePublicationInput } from './dto/create-publication.input';
import { UpdatePublicationInput } from './dto/update-publication.input';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guards';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/user-current.decorator';
import { validRoles } from 'src/auth/enums/valid-roles.enum';
import { User } from 'src/user/entities/user.entity';

@Resolver(() => Publication)
export class PublicationResolver {
  constructor(private readonly publicationService: PublicationService) {}

  @Mutation(() => Publication)
  @UseGuards(JwtAuthGuard)
  createPublication(@Args('createPublicationInput') createPublicationInput: CreatePublicationInput,
  @CurrentUser([validRoles.user]) user: User) {
    return this.publicationService.create(createPublicationInput, user);
  }

  @Query(() => [Publication], { name: 'publication' })
  findAll() {
    return this.publicationService.findAll();
  }

  @Query(() => Publication, { name: 'publication' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.publicationService.findOne(id);
  }

  @Mutation(() => Publication)
  updatePublication(@Args('updatePublicationInput') updatePublicationInput: UpdatePublicationInput) {
    return this.publicationService.update(updatePublicationInput.id, updatePublicationInput);
  }

  @Mutation(() => Publication)
  removePublication(@Args('id', { type: () => Int }) id: number) {
    return this.publicationService.remove(id);
  }
}
