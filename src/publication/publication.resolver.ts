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
import { messageUpdate } from 'src/user/entities/messageUpdate.entity';
import { FilterPublicationInput } from './dto/filter-publication.input';
import { DenouncePublication } from './dto/create-denounce.input';
import { PublicationOutput } from './entities/PublicationOutput';

@Resolver(() => Publication)
export class PublicationResolver {
  constructor(private readonly publicationService: PublicationService) {}

  @Mutation(() => Publication)
  @UseGuards(JwtAuthGuard)
  createPublication(@Args('createPublicationInput') createPublicationInput: CreatePublicationInput,
  @CurrentUser([validRoles.user]) user: User) {
    return this.publicationService.create(createPublicationInput, user);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  createPublicationDenounce(@Args('denouncePublication') denouncePublication: DenouncePublication,
  @CurrentUser([validRoles.user]) user: User) {
    return this.publicationService.createDenounce(user.id,denouncePublication);
  }

  @Query(() => [PublicationOutput])
  @UseGuards(JwtAuthGuard)
  findAllPublicationDenounce(@CurrentUser([validRoles.admin]) user: User, @Args('Skip',{nullable:true}) skip?: number) {
    return this.publicationService.findAllDenounce(skip);

  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  deletePublicationDenounce(
    @Args('idDenouncePublication') idDenouncePublication: number,
    @CurrentUser([validRoles.admin]) user: User,
  ) {
    return this.publicationService.deleteDenounce(idDenouncePublication);
  }

  @Query(() => Number, { name: 'CountDenounces' })
  @UseGuards(JwtAuthGuard)
  async countDenounce() {
    return this.publicationService.countDenounce();
  }

  @Query(() => [Publication], { name: 'publicationAll' })
  @UseGuards(JwtAuthGuard)
  async findAlls(@Args('nameUser', { type: () => String }) nameUser: string) {
    return this.publicationService.findAllForUserName(nameUser);
  }

  @Query(() => [Publication], { name: 'publicationAllLikes' })
  @UseGuards(JwtAuthGuard)
  async findAllsLikes(@Args('nameUser', { type: () => String }) nameUser: string) {
    return this.publicationService.findAllForUserNameLike(nameUser);
  }



  @Query(() => [Publication], { name: 'publicationAllByType' })
  @UseGuards(JwtAuthGuard)
  async findAllByProperty(@Args('typeProperty', { type: () => String }) typeProperty: string,
  @Args('filter', { type: () => FilterPublicationInput ,defaultValue:null}) filter?:FilterPublicationInput ) {
    return (!filter)?this.publicationService.findAllForTypeProperty(typeProperty):
    this.publicationService.findAllForTypeProperty(typeProperty,filter);
  }


  @Query(() => [Publication], { name: 'publicationRecomendation' })
  @UseGuards(JwtAuthGuard)
  async findAllsforRecomendation(@CurrentUser([validRoles.user]) user: User) {
    return this.publicationService.findAllForUserNameRecomendation(user.userName);
  }
  
  @Query(() => Publication, { name: 'publicationOne' })
  findOnePublication(@Args('id', { type: () => Int }) id: number) {
    return this.publicationService.findOne(id);
  }

  @Mutation(() => Publication)
  updatePublication(@Args('updatePublicationInput') updatePublicationInput: UpdatePublicationInput) {
    return this.publicationService.update(updatePublicationInput);
  }

  @Mutation(() => messageUpdate)
  removePublication(@Args('id', { type: () => Int }) id: number): Promise<messageUpdate> {
    return this.publicationService.removeOne(id);
  }
}
