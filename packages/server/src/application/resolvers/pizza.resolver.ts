import { pizzaProvider } from '../providers';
import {
  Pizza as SchemaPizza,
  CreatePizzaInput,
  UpdatePizzaInput,
  DeletePizzaInput,
  GetPizzaInput,
} from '../schema/types/schema';
import { Root } from '../schema/types/types';

type Pizza = Omit<SchemaPizza, 'toppings' | 'priceCents'>;
type Cursor = {
  totalCount: number;
  hasNextPage: boolean;
  cursor: string;
  results: Pizza[];
};

const pizzaResolver = {
  Query: {
    pizzas: async (_: Root, args: { input: GetPizzaInput }): Promise<Cursor> => {
      return pizzaProvider.getPizzas(args.input);
    },
  },
  Mutation: {
    createPizza: async (_: Root, args: { input: CreatePizzaInput }): Promise<Pizza> => {
      return pizzaProvider.createPizza(args.input);
    },
    updatePizza: async (_: Root, args: { input: UpdatePizzaInput }): Promise<Pizza> => {
      return pizzaProvider.updatePizza(args.input);
    },
    deletePizza: async (_: Root, args: { input: DeletePizzaInput }): Promise<string> => {
      return pizzaProvider.deletePizza(args.input);
    },
  },
};

export { pizzaResolver };
