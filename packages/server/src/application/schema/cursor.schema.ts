import { gql } from 'apollo-server';

const typeDefs = gql`
  type Cursor {
    totalCount: Int!
    hasNextPage: Boolean!
    cursor: ObjectID
    results: [Pizza]!
  }
`;

export { typeDefs };
