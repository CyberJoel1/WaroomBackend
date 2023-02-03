import { Injectable } from '@nestjs/common';
import { FilterPublicationInput } from 'src/publication/dto/filter-publication.input';

@Injectable()
export class FilterPublicationsService {
    private calculateRange(latitud:number, rango:number,input:string) {
        let minus:number= (((-1)*rango)+latitud);
        let max:number = (((1)*rango)+latitud);
        let validate =  `${input} >= ${minus} AND ${input} <= ${max}`;
        return validate;
    }

    private calculateDomain(longitud:number, rango:number,input:string) {
        let minus:number= (((-1)*rango)+longitud);
        let max:number = (((1)*rango)+longitud);
        let validate =  `${input} >= ${minus} AND ${input} <= ${max}`;
        return validate;
    }

    private calculateZone(longitud:number,latitud:number, rango:number, inputEntity:string){
        let valor1 = this.calculateRange(latitud,rango,`${inputEntity}.longitud`);
        let valor2 = this.calculateDomain(longitud,rango,`${inputEntity}.latitud`);
        console.log(`AND ${valor1} AND ${valor2}`);
        return `AND ${valor1} AND ${valor2}`;
    }

    private calculateMinMaxSize(minSize:number, maxSize:number, inputEntity:string){
        return `AND ${inputEntity}.medida >= ${minSize} AND ${inputEntity}.medida <= ${maxSize}`;
    }

    private calculateBanos(inputEntity:string, banos:number){
        if(banos<4){
            if(banos==0){
                return ``;
            }
            return `AND ${inputEntity}.banos = ${banos}`;
        }else{
            return `AND ${inputEntity}.banos >= 4`;
        }

    }

    private calculateRooms(inputEntity:string, habitaciones:number){
        if(habitaciones<4){
            if(habitaciones==0){
                return ``;
            }
            return `AND ${inputEntity}.habitaciones = ${habitaciones}`;
        }else{
            return `AND ${inputEntity}.habitaciones >= 4`;
        }

    }

     filterAll(filter:FilterPublicationInput,inputEntity:string){
        const {minMedida,maxMedida,banos,habitaciones,latitud,longitud,rango} = filter;
        (Object.keys(filter) as (keyof typeof filter)[]).forEach((key, index) => {
            console.log(key+' - '+filter[key]);
              
            });
        let filterZone = this.calculateZone(longitud,latitud,rango,inputEntity);
        let filterSize = this.calculateMinMaxSize(minMedida,maxMedida,inputEntity);
        let filterBanos = this.calculateBanos(inputEntity,banos);
        let filterRooms = this.calculateRooms(inputEntity,habitaciones);
        return (filterZone+' '+filterSize+' '+filterBanos+' '+filterRooms);
    }
}
