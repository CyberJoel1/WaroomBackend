import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { LikeService } from './like.service';
import { Like } from './entities/like.entity';
import { CreateLikeInput } from './dto/create-like.input';
import { UpdateLikeInput } from './dto/update-like.input';
import { CurrentUser } from 'src/auth/decorators/user-current.decorator';
import { User } from 'src/user/entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guards';
import { UseGuards } from '@nestjs/common';

@Resolver(() => Like)
export class LikeResolver {
  constructor(private readonly likeService: LikeService) {}

  @Mutation(() => Boolean, {name: 'createLike', description:'Crear like'})
  @UseGuards(JwtAuthGuard)
  createLike(@Args('createLikeInput') createLikeInput: CreateLikeInput,
  @CurrentUser([]) user: User) {
    return this.likeService.create(user.id,createLikeInput);
  }

  // @Query(() => [Like], { name: 'like' })
  // findAll() {
  //   return this.likeService.findAll();
  // }

  @Query(() => Boolean, { name: 'checkLike', description:'chequea si hay un like' })
  @UseGuards(JwtAuthGuard)
  checkLike(@Args('createLikeInput') createLikeInput: CreateLikeInput,
  @CurrentUser([]) user: User) {
    return this.likeService.checkLike(user.id,createLikeInput);
  }

  @Query(() => Int,{description:'Contar numero de likes'})
  countLike(@Args('countLike') createLikeInput: CreateLikeInput) {
    return this.likeService.countAll(createLikeInput);
  }

  @Mutation(() => Boolean,{description:'Remover un like'})
  @UseGuards(JwtAuthGuard)
  removeLike(@Args('removeLikeInput') createLikeInput: CreateLikeInput,
  @CurrentUser([]) user: User) {
    return this.likeService.remove(user.id,createLikeInput);
  }
}
