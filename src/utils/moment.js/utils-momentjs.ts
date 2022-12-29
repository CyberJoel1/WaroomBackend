import { Injectable } from '@nestjs/common';
import * as moment from 'moment'


@Injectable()
export class UtilsMoment {
  

  


  static verifyAdult(date: Date): number {
    moment().format('L');
    var fecha1= moment(date);
    var fecha2= moment(new Date());
    return this.calculateAge(fecha1,fecha2);
  }


   static calculateAgeAdult(){
        let fecha2: moment.Moment = moment(new Date());
        return fecha2.subtract(18,'years').toDate();
  }


  private static calculateAge(fecha1: moment.Moment, fecha2: moment.Moment): number {
    var a = moment(fecha1);
	var b = moment(fecha2);

	var years = a.diff(b, 'year');
	b.add(years, 'years');

	var months = a.diff(b, 'months');
	b.add(months, 'months');

	var days = a.diff(b, 'days');

	if(years==0){
		if(months<=1){
			if(days<=1){
				console.log(months + ' mes ' + days + ' dia');
		    }else{
				console.log( months + ' mes ' + days + ' dias');
		    }
	   }else{
			if(days<=1){
			   console.log( months + ' meses ' + days + ' dia');
			}else{
			   console.log( months + ' meses ' + days + ' dias');
			}  
	   }

	}else{
		if(years==1){
			console.log( years + ' año');
	    }else{
			console.log( years + ' años');
	    }	
	}
    let returnYears:number= Number(years);
    return (returnYears);
}



}





