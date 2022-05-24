import { ObjectId } from 'bson';
import { Pizza as PizzaSchema } from '../../src/application/schema/types/schema';
import { Pizza as CreatePizzaInput } from '../../src/application/providers/pizzas/pizza.provider.types';
import { PizzaDocument } from '../../src/entities/pizza';

type Pizza = Omit<PizzaSchema, 'toppings' | 'priceCents'>;

const createMockPizza = (data?: Partial<CreatePizzaInput>): Pizza => {
  return {
    __typename: 'Pizza',
    id: new ObjectId().toHexString(),
    name: 'Cheese Pizza',
    description: 'A cheese pizza is a family favourite',
    imgSrc: 'www.pizza.com/cheese.png',
    toppingIds: [],
    ...data,
  };
};

const createMockPizzaDocument = (data?: Partial<PizzaDocument>): PizzaDocument => {
  return {
    _id: new ObjectId(),
    name: 'Cheese Pizza',
    description: 'A cheese pizza is a family favourite',
    imgSrc: 'www.pizza.com/cheese.png',
    toppingIds: [],
    ...data,
  };
};

export { createMockPizza, createMockPizzaDocument };
