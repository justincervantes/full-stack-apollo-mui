import { gql } from 'apollo-server';

const typeDefs = gql`
  type Pizza {
    id: ObjectID!
    name: String!
    description: String!
    toppingIds: [String!]!
    toppings: [Topping!]!
    imgSrc: String!
    priceCents: Float!
  }

  type Query {
    pizzas(input: GetPizzaInput): Cursor!
  }

  type Mutation {
    createPizza(input: CreatePizzaInput!): Pizza!
    deletePizza(input: DeletePizzaInput!): ObjectID!
    updatePizza(input: UpdatePizzaInput!): Pizza!
  }

  input GetPizzaInput {
    cursor: ObjectID
    limit: Int
  }

  input CreatePizzaInput {
    name: String!
    description: String!
    imgSrc: String!
    toppingIds: [String!]!
  }

  input DeletePizzaInput {
    id: ObjectID!
  }

  input UpdatePizzaInput {
    id: ObjectID!
    name: String
    description: String
    imgSrc: String
    toppingIds: [ObjectID]
  }
`;

export { typeDefs };
