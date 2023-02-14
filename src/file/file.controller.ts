import { v4 as uuid } from 'uuid'
import {
  AuthChangeEvent,
  AuthSession,
  createClient,
  Session,
  SupabaseClient,
  User,
} from '@supabase/supabase-js'
import {Blob} from 'buffer';
import { request, response } from 'express';

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
  Res,
  StreamableFile,
  UploadedFile,
} from '@nestjs/common';
import { FileService } from './file.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from './helpers/fileFilter.helper';
import { diskStorage } from 'multer';
import { fileNamer, fileDestination } from './helpers/fileNamer.helper';
import { ConfigService } from '@nestjs/config';
import { createReadStream } from 'fs';
import path, { join } from 'path';
import { readFileSync } from 'fs';
import { supabase } from './helpers/fileAuth.helper';
import { Response } from 'express';
@Controller('file')
export class FileController {
  constructor(
    private readonly fileService: FileService,
    private readonly configService: ConfigService,
  ) {}

  @Get('product/:imageName')
  findProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string
  ) {

    const path = this.fileService.getStaticProductImage( imageName );
    
    return path;
  }


  @Post('product')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
      // limits: { fileSize: 1000 }

    }),
  )
  async uploadProductImage(@UploadedFile() file: Express.Multer.File) {
    console.log("Hola ahora si "+ file)
   // files.forEach((file) => {
      if (!file) {
        throw new BadRequestException('Make sure that the file is an image');
      }


      const fileExtension = file.mimetype.split('/')[1];

      const fileName = `${ uuid() }.${ fileExtension }`;
        const avatarFile = file
        
    
    // Create a single supabase client for interacting with your database
    
        const { data, error } = await supabase
        .storage
        .from('filewaroom')
        .upload(`static/waroom/${fileName}`, avatarFile.buffer as unknown as File, {
          cacheControl: '3600',
          upsert: false,
          contentType:'image/*'
        })
        const secureUrl =('https://jbtpjkjcxadmeecjohpq.supabase.co/storage/v1/object/public/filewaroom/'+data.path)
        return { secureUrl };
      
    //});
  }
}
