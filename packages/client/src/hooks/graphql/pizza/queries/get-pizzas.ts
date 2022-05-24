import { gql } from '@apollo/client';

export const GET_PIZZAS = gql`
  query Pizzas($getPizzaInput: GetPizzaInput!) {
    pizzas(input: $getPizzaInput) {
      totalCount
      cursor
      hasNextPage
      results {
        id
        name
        description
        imgSrc
        priceCents
        toppingIds
        toppings {
          id
          name
        }
      }
    }
  }
`;
