import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { FriendlyService } from './friendly.service';
import { Friendly } from './entities/friendly.entity';
import { CreateFriendlyInput } from './dto/create-friendly.input';
import { UpdateFriendlyInput } from './dto/update-friendly.input';
import { CurrentUser } from 'src/auth/decorators/user-current.decorator';
import { User } from '../entities/user.entity';
import { Chat } from 'src/chat/entities/chat.entities';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guards';
import { UseGuards } from '@nestjs/common';

@Resolver(() => Friendly)
export class FriendlyResolver {
  constructor(private readonly friendlyService: FriendlyService) {}

  @Mutation(() => Boolean, {
    name: 'createFriendly',
    description: 'Crea una relación de amistad entre dos usuarios',
  })
  @UseGuards(JwtAuthGuard)
  createFriendly(
    @Args('createFriendlyInput') createFriendlyInput: CreateFriendlyInput,
    @CurrentUser([]) user: User,
  ) {
    return this.friendlyService.create(user.id, createFriendlyInput);
  }

  @Query(() => [Friendly], {
    name: 'findAllRequestForUserName',
    description: 'Devuelve todas las solicitudes de amistad',
  })
  @UseGuards(JwtAuthGuard)
  findAllRequestForUserName(
    @CurrentUser([]) user: User,
    @Args('user2') user2: string,
  ) {
    return this.friendlyService.findAll(user2);
  }

  @Query(() => [User], {
    name: 'findAllFriendsForUserName',
    description: 'Devuelve todos los amigos',
  })
  @UseGuards(JwtAuthGuard)
  findAllFriendsForUserName(
    @CurrentUser([]) user: User,
    @Args('userName') userName: string,
  ) {
    return this.friendlyService.findAllFriends(userName);
  }

  @Mutation(() => Friendly, {
    name: 'confirmRequestOne',
    description: 'Confirma una solicitud de amistad',
  })
  confirmRequestOne(@Args('id', { type: () => Int }) id: number) {
    return this.friendlyService.confirmRequestOne(id);
  }

  @Query(() => String, {
    name: 'findConfirmFriend',
    description: 'Permite observar el estado de una relación de amistad',
  })
  @UseGuards(JwtAuthGuard)
  findConfirmFriend(@CurrentUser([]) user: User, @Args('user2') user2: string) {
    return this.friendlyService.confirmFriendly(user.id, user2);
  }

  @Query(() => [Int], {
    name: 'findConfirmChat',
    description: 'Devuelve los id para chat',
  })
  @UseGuards(JwtAuthGuard)
  findConfirmChat(@CurrentUser([]) user: User, @Args('user2') user2: string) {
    const chat: Chat = { IsSend: user.id, idListened: user2 };
    return this.friendlyService.confirmChat(chat);
  }

  @Query(() => Boolean, {
    name: 'findConfirmChatListen',
    description: 'Confirma si es tu gateway a escuchar',
  })
  @UseGuards(JwtAuthGuard)
  findConfirmChatListen(@CurrentUser([]) user: User, @Args('idRelation') idRelation: number) {
    return this.friendlyService.confirmChatListen(user.id,idRelation);
  }

  @Mutation(() => Friendly)
  updateFriendly(
    @Args('updateFriendlyInput') updateFriendlyInput: UpdateFriendlyInput,
  ) {
    return this.friendlyService.update(
      updateFriendlyInput.id,
      updateFriendlyInput,
    );
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  removeFriendly(
    @CurrentUser([]) user: User,
    @Args('userReceived', { type: () => String }) userReceived: string,
  ) {
    return this.friendlyService.remove(user.id, userReceived);
  }
}
