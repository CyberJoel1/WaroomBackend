import { Scalar, CustomScalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';

@Scalar('Date', (type) => Date)
export class DateScalar implements CustomScalar<String, Date> {
  description = 'Date custom scalar type';

  parseValue(value: string): Date {
    return new Date(value); // value from the client
  }

  serialize(value: Date): String {
    console.log(value.toISOString())
    return (value.toLocaleDateString()); // value sent to the client
  }

  parseLiteral(ast: ValueNode): Date {
    if (ast.kind === Kind.INT) {
      return new Date(ast.value);
    }
    return null;
  }
  
}