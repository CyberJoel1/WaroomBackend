import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Person } from './entity/person.entity';

import { PersonService } from './person.service';
import { PersonInput } from './dto/inputs/person.input';

@Resolver()
export class PersonResolver {
  constructor(private readonly personService: PersonService) {}

   @Mutation(()=>Person,{name:'crear'})
   async createPerson(
     @Args('personInput') personInput: PersonInput,
   ): Promise<Person> {
     return await this.personService.createPerson(personInput);
   }

  @Query(()=>Person ,{name:'conseguir'})
  async getPerson(@Args('id') id: number): Promise<Person> {
    return await this.personService.getPerson(id);
  }

  @Mutation(()=>Boolean,{name:'borrar'})
  async deletePerson(@Args('id') id: number): Promise<Boolean> {
    return await this.personService.deletePerson(id);
  }

  @Mutation(()=>Person,{name:'actualizar'})
  async updatePerson(
    @Args('id') id: number,
    @Args('personInput') personInput: PersonInput,
  ): Promise<Person> {
    return await this.personService.updatePerson(id, personInput);
  }
}