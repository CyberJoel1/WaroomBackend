import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';

@Injectable()
export class FileService {
  getStaticProductImage( imageName: string ) {

    const path = join( __dirname, '../../backend-waroom/static/products', imageName );
    const path2 =join( '/static/products', imageName );
    console.log(path2)
    if ( !existsSync(path) ) 
        throw new BadRequestException(`No product found with image ${ imageName }`);

    return path;
}
}
