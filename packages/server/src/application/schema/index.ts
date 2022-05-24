import { gql } from 'apollo-server-core';

import { typeDefs as toppingTypeDefs } from './topping.schema';
import { typeDefs as pizzaTypeDefs } from './pizza.schema';
import { typeDefs as cursorTypeDefs } from './cursor.schema';
const scalarSchema = gql`
  scalar ObjectID
  scalar Long
`;

const typeDefs = gql`
  ${scalarSchema}
  ${cursorTypeDefs}
  ${toppingTypeDefs}
  ${pizzaTypeDefs}
`;

export { typeDefs };
