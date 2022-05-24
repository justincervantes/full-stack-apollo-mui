import { gql } from 'apollo-server-core';
import { pizzaResolver } from '../../src/application/resolvers/pizza.resolver';
import { pizzaProvider } from '../../src/application/providers';
import { typeDefs } from '../../src/application/schema/index';
import {
  MutationCreatePizzaArgs,
  MutationDeletePizzaArgs,
  MutationUpdatePizzaArgs,
} from '../../src/application/schema/types/schema';
import { createMockPizza, createMockPizzaDocument } from '../helpers/pizza.helper';
import { createMockTopping } from '../helpers/topping.helper';
import { toPizzaObject } from '../../src/entities/pizza';
import { TestClient } from '../helpers/client.helper';

let client: TestClient;

jest.mock('../../src/application/database', () => ({
  setupDb: (): any => ({ collection: (): any => jest.fn() }),
}));

const mockTopping = createMockTopping();
const mockPizza = createMockPizza();
const mockPizzaDocument = { ...createMockPizzaDocument(), toppingIds: [mockTopping.id] };
const mockPizzaObject = toPizzaObject(mockPizzaDocument);

beforeAll(async (): Promise<void> => {
  client = new TestClient(typeDefs, pizzaResolver);
});

beforeEach(async (): Promise<void> => {
  jest.restoreAllMocks();
});

describe('pizzaResolver', (): void => {
  describe('Query', () => {
    describe('pizzas', () => {
      const query = gql`
        query getPizzas {
          pizzas {
            totalCount
            cursor
            hasNextPage
            results {
              description
              id
              name
              imgSrc
              toppingIds
              toppings {
                name
                priceCents
              }
            }
          }
        }
      `;
      test('should get all pizzas', async () => {
        const variables = {
          input: {
            cursor: null,
            limit: null,
          },
        };

        jest.spyOn(pizzaProvider, 'getPizzas').mockResolvedValue({
          totalCount: 1,
          hasNextPage: false,
          cursor: mockPizzaObject.id,
          results: [
            {
              ...mockPizzaObject,
              toppings: [{ id: mockTopping.id, name: mockTopping.name, priceCents: mockTopping.priceCents }],
            },
          ],
        });

        const result = await client.query({ query, variables });

        expect(result.data.pizzas).toEqual({
          __typename: 'Cursor',
          totalCount: 1,
          hasNextPage: false,
          cursor: mockPizzaObject.id,
          results: [mockPizzaObject].map((pizza) => ({
            __typename: 'Pizza',
            ...pizza,
            toppings: [{ __typename: 'Topping', name: mockTopping.name, priceCents: mockTopping.priceCents }],
          })),
        });

        expect(pizzaProvider.getPizzas).toHaveBeenCalledTimes(1);
      });
    });
  });
  describe('Mutation', () => {
    describe('createPizza', () => {
      const mutation = gql`
        mutation ($input: CreatePizzaInput!) {
          createPizza(input: $input) {
            name
            description
            imgSrc
            toppingIds
          }
        }
      `;

      const validTopping = createMockTopping({
        name: 'Mock topping',
        priceCents: 100,
      });

      const validPizza = createMockPizza({
        name: 'Mock pizza',
        description: 'A mocked pizza',
        imgSrc: 'A mocked imgSrc',
        toppingIds: [...validTopping.id],
      });

      beforeEach(() => {
        jest.spyOn(pizzaProvider, 'createPizza').mockResolvedValue(validPizza);
      });

      test('should call create pizza when passed a valid input', async () => {
        const variables: MutationCreatePizzaArgs = {
          input: {
            name: validPizza.name,
            description: validPizza.description,
            imgSrc: validPizza.imgSrc,
            toppingIds: validPizza.toppingIds,
          },
        };

        await client.mutate({ mutation, variables });

        expect(pizzaProvider.createPizza).toHaveBeenCalledWith(variables.input);
      });
      test('should return created pizza when passed a valid input', async () => {
        const variables: MutationCreatePizzaArgs = {
          input: {
            name: validPizza.name,
            description: validPizza.description,
            imgSrc: validPizza.imgSrc,
            toppingIds: validPizza.toppingIds,
          },
        };

        const result = await client.mutate({ mutation, variables });

        expect(result.data).toEqual({
          createPizza: {
            __typename: 'Pizza',
            name: validPizza.name,
            description: validPizza.description,
            imgSrc: validPizza.imgSrc,
            toppingIds: validPizza.toppingIds,
          },
        });
      });
    });

    describe('deletePizza', () => {
      const mutation = gql`
        mutation ($input: DeletePizzaInput!) {
          deletePizza(input: $input)
        }
      `;

      const variables: MutationDeletePizzaArgs = { input: { id: mockPizza.id } };

      beforeEach(() => {
        jest.spyOn(pizzaProvider, 'deletePizza').mockResolvedValue(mockPizza.id);
      });

      test('should call deletePizza with id', async () => {
        await client.mutate({ mutation, variables });

        expect(pizzaProvider.deletePizza).toHaveBeenCalledWith(variables.input);
      });

      test('should return deleted pizza id', async () => {
        const result = await client.mutate({ mutation, variables });

        expect(result.data).toEqual({
          deletePizza: mockPizza.id,
        });
      });
    });

    describe('updatePizza', () => {
      const mutation = gql`
        mutation ($input: UpdatePizzaInput!) {
          updatePizza(input: $input) {
            id
            name
            description
            imgSrc
            toppingIds
          }
        }
      `;

      const updatedTopping = createMockTopping({
        name: 'updated topping',
        priceCents: 100,
      });
      const updatedPizza = createMockPizza({
        name: 'updated pizza',
        description: 'updated pizza description',
        imgSrc: 'updated pizza imgSrc',
        toppingIds: [updatedTopping.id],
      });

      const variables: MutationUpdatePizzaArgs = {
        input: {
          id: mockPizza.id,
          name: mockPizza.name,
          description: mockPizza.description,
          imgSrc: mockPizza.imgSrc,
          toppingIds: mockPizza.toppingIds,
        },
      };

      beforeEach(() => {
        jest.spyOn(pizzaProvider, 'updatePizza').mockResolvedValue(updatedPizza);
      });

      test('should call updatePizza with input', async () => {
        await client.mutate({ mutation, variables });
        expect(pizzaProvider.updatePizza).toHaveBeenCalledWith(variables.input);
      });

      test('should return updated pizza', async () => {
        const result = await client.mutate({ mutation, variables });

        expect(result.data).toEqual({
          updatePizza: {
            ...updatedPizza,
          },
        });
      });
    });
  });
});
