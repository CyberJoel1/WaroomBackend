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
import { supabase } from './fileAuth.helper';

export const fileNamer = ( req: Express.Request, file: Express.Multer.File, callback: Function ) => {

    // console.log({ file })
    if ( !file ) return callback( new Error('File is empty'), false );

    const fileExtension = file.mimetype.split('/')[1];

    const fileName = `${ uuid() }.${ fileExtension }`;


    callback(null, fileName );

}

export const fileDestination = async ( req: Express.Request, file: Express.Multer.File, callback: Function )=>{
  if ( !file ) return callback( new Error('File is empty'), false );

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
      contentType:avatarFile.mimetype
    })
    console.log(data.path)


}

