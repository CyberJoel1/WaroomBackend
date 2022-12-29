import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PublicationService } from './publication.service';
import { Publication } from './entities/publication.entity';
import { CreatePublicationInput } from './dto/create-publication.input';
import { UpdatePublicationInput } from './dto/update-publication.input';

@Resolver(() => Publication)
export class PublicationResolver {
  constructor(private readonly publicationService: PublicationService) {}

  @Mutation(() => Publication)
  createPublication(@Args('createPublicationInput') createPublicationInput: CreatePublicationInput) {
    return this.publicationService.create(createPublicationInput);
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
