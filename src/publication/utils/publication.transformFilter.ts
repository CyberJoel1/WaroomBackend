import { FilterPublicationInput } from '../dto/filter-publication.input';



export class TransformFilter{
    
    
    private static calculateRange(latitud:number, rango:number,input:string) {
        let minus:number= (((-1)*rango)+latitud);
        let max:number = (((1)*rango)+latitud);
        let validate =  `${input} >= ${minus} AND ${input} <= ${max}`;
        return validate;
    }

    private static calculateDomain(longitud:number, rango:number,input:string) {
        let minus:number= (((-1)*rango)+longitud);
        let max:number = (((1)*rango)+longitud);
        let validate =  `${input} >= ${minus} AND ${input} <= ${max}`;
        return validate;
    }

    private static calculateZone(longitud:number,latitud:number, rango:number, inputEntity:string){
        let valor1 = this.calculateRange(latitud,rango,`${inputEntity}.longitud`);
        let valor2 = this.calculateDomain(longitud,rango,`${inputEntity}.latitud`);
        console.log(`AND ${valor1} AND ${valor2}`);
        return `AND ${valor1} AND ${valor2}`;
    }

    private static calculateMinMaxSize(minSize:number, maxSize:number, inputEntity:string){
        return `AND ${inputEntity}.medida >= ${minSize} AND ${inputEntity}.medida <= ${maxSize}`;
    }

    private static calculateBanos(inputEntity:string, banos:number){
        if(banos<4){
            return `AND ${inputEntity}.banos = ${banos}`;
        }else if(banos===0){
            return ``;
        }else{
            return `AND ${inputEntity}.banos >= 4`;
        }

    }

    private static calculateRooms(inputEntity:string, habitaciones:number){
        if(habitaciones<4){
            return `AND ${inputEntity}.habitaciones = ${habitaciones}`;
        }else if(habitaciones===0){
            return ``;
        }else{
            return `AND ${inputEntity}.habitaciones >= 4`;
        }

    }

    static filterAll(filter:FilterPublicationInput,inputEntity:string){
        const {minMedida,maxMedida,banos,habitaciones,latitud,longitud,rango} = filter;
        (Object.keys(filter) as (keyof typeof filter)[]).forEach((key, index) => {
            console.log(key+' - '+filter[key]);
              
            });
        let filterZone = this.calculateZone(longitud,latitud,rango,inputEntity);
        let filterSize = this.calculateMinMaxSize(minMedida,maxMedida,inputEntity);
        let filterBanos = this.calculateBanos(inputEntity,banos);
        let filterRooms = this.calculateRooms(inputEntity,habitaciones);
        return (filterZone+' '+filterSize+' '+filterBanos+''+filterRooms);
    }
}