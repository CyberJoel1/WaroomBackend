import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CommentService } from './comment.service';
import { Comment } from './entities/comment.entity';
import { CreateCommentInput } from './dto/create-comment.input';
import { UpdateCommentInput } from './dto/update-comment.input';
import { messageComment } from './entities/messageComment.entity';
import { DateTime } from 'neo4j-driver';
import * as moment from 'moment';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guards';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/user-current.decorator';
import { User } from '@supabase/supabase-js';
import { validRoles } from 'src/auth/enums/valid-roles.enum';
import { DenounceComment } from './entities/denounce.entity';
import { DenouncePublication } from 'src/publication/dto/create-denounce.input';
import { CommentOutput } from './entities/commentOutput';
import { TreatedDenounceCommentInput } from './dto/treated-denounceComment.input';
import { UserService } from '../user/user.service';
import { PublicationService } from '../publication/publication.service';

@Resolver(() => messageComment)
export class CommentResolver {
  constructor(
    private readonly commentService: CommentService,
  ) {}

  @Mutation(() => messageComment)
  @UseGuards(JwtAuthGuard)
  createComment(
    @Args('createCommentInput') createCommentInput: CreateCommentInput,
    @CurrentUser([validRoles.user]) user: User,
  ) {
    return {
      confirmMessage: this.commentService.create(
        parseInt(user.id),
        createCommentInput,
      ),
    };
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  createCommentDenounce(
    @Args('denounceComment') denounceComment: DenounceComment,
    @CurrentUser([validRoles.user]) user: User,
  ) {
    return this.commentService.createDenounce(
      parseInt(user.id),
      denounceComment,
    );
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  deleteCommentDenounce(
    @Args('idDenounceComment') idDenounceComment: number,
    @CurrentUser([validRoles.admin]) user: User,
  ) {
    return this.commentService.deleteDenounce(idDenounceComment);
  }



  @Query(() => [CommentOutput])
  @UseGuards(JwtAuthGuard)
  findAllCommentDenounce(
    @CurrentUser([validRoles.admin]) user: User,
    @Args('Skip', { nullable: true }) skip?: number,
  ) {
    return this.commentService.findAllDenounce(skip);
  }

  @Query(() => Number)
  @UseGuards(JwtAuthGuard)
  countDenounce() {
    return this.commentService.countAllDenounce();
  }

  @Query(() => [Comment], { name: 'Allcomentary' })
  findAll(
    @Args('id', { type: () => Int }) id: number,
    @Args('pag', { type: () => Int, defaultValue: 10 }) pag: number,
    @Args('fecha', {
      type: () => String,
      nullable: true,
      defaultValue: moment(new Date())
        .format('YYYY-MM-DDTHH:mm:ss.SSS')
        .toString(),
    })
    date: any,
  ) {
    return this.commentService.findAll(id, pag, date);
  }

  // @Query(() => Comment, { name: 'comment' })
  // findOne(@Args('id', { type: () => Int }) id: number) {
  //   return this.commentService.findOne(id);
  // }

  @Mutation(() => messageComment)
  updateComment(
    @Args('updateCommentInput') updateCommentInput: UpdateCommentInput,
  ) {
    return {
      confirmMessage: this.commentService.update(
        updateCommentInput.id,
        updateCommentInput,
      ),
    };
  }

  @Mutation(() => Boolean)
  removeComment(@Args('id', { type: () => Int }) id: number) {
    return this.commentService.remove(id);
  }
}
