import { CreateFriendlyInput } from './create-friendly.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateFriendlyInput extends PartialType(CreateFriendlyInput) {
  @Field(() => Int)
  id: number;
}
