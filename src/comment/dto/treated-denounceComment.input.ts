import { InputType, Int, Field } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional, MaxDate, MinDate } from 'class-validator';

@InputType()
export class TreatedDenounceCommentInput {

    @Field(() => Date, { description: 'Fecha fin de bloqueo' ,nullable:true})
    @IsNotEmpty()
    @Transform( ({ value }) => new Date(value))
    @IsDate()
    @MinDate(new Date("01/01/1900"),{message:'La fecha es menor que 01/01/1900',})
    dateEndBlock: Date;

    @Field(() => String, { description: 'Example field (placeholder)',nullable:true })
    @IsOptional()
    userName: string;
}
