import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateCommentInput } from './dto/create-comment.input';
import { UpdateCommentInput } from './dto/update-comment.input';
import { CommentRepository } from './comment.repository';
import { DenounceComment } from './entities/denounce.entity';
import { CommentOutput } from './entities/commentOutput';

@Injectable()
export class CommentService {


  constructor(private readonly commentRepository: CommentRepository) {}
  async deleteDenounce(idDenounceComment: number) {
    try {
      return await this.commentRepository.deleteDenounceComment(idDenounceComment);
    } catch (error) {
      this.handleDBerrors(error);
    }
  }
  async createDenounce(id: number, denounceComment: DenounceComment) {
    try {
      return await this.commentRepository.denounceComment(id,
        denounceComment,
      );
    } catch (error) {
      this.handleDBerrors(error);
    }
  }


  
  async findAllDenounce(skip?:number): Promise<CommentOutput[]> {
    try {
      const publication = await this.commentRepository.findAllCommentDenounce(skip);
      return publication;
    } catch (error) {
      this.handleDBerrors(error);
    }
  }

  async countAllDenounce(): Promise<number> {
    try {
      const publication = await this.commentRepository.countCommentDenounce();
      return publication;
    } catch (error) {
      this.handleDBerrors(error);
    }
  }


  async create(id:number,createCommentInput: CreateCommentInput): Promise<Boolean> {
    try {
      return await this.commentRepository.insertCommentPublication(id,
        createCommentInput,
      );
    } catch (error) {
      this.handleDBerrors(error);
    }
  }


  async findAll(pag:number, id:number, date: any) {
    try {
      return await this.commentRepository.findAllCommentByPublication(pag,id,date);
    } catch (error) {
      this.handleDBerrors(error);
    }
  }


  //TODO realizar borrado
  async deleteDenounceByUserName(userName:string) {
    try {
      return await this.commentRepository.deleteDenouncesByUsername(userName);
    } catch (error) {
      this.handleDBerrors(error);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  async update(id: number, updateCommentInput: UpdateCommentInput): Promise<Boolean> {
    try {
      return await this.commentRepository.updateCommentPublication(updateCommentInput);
    } catch (error) {
      this.handleDBerrors(error);
    }
  }

  async remove(id: number): Promise<Boolean> {
    try {
      return await this.commentRepository.deleteCommentPublication(id);
    } catch (error) {
      this.handleDBerrors(error);
    }
  }

  private handleDBerrors(error: any): never {
    //this.logger.error(error);
    console.log(error);
    throw new InternalServerErrorException('Por favor chequea los logs');
  }
}
