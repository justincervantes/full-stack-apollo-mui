import { Collection } from 'mongodb';

import { reveal, stub } from 'jest-auto-stub';
import { PizzaProvider } from '../../src/application/providers/pizzas/pizza.provider';
import { ToppingProvider } from '../../src/application/providers/toppings/topping.provider';
import { mockCursorQuery } from '../helpers/mongo.helper';
import { createMockPizzaDocument } from '../helpers/pizza.helper';
import { createMockTopping } from '../helpers/topping.helper';
import { PizzaDocument, toPizzaObject } from '../../src/entities/pizza';
import { ToppingDocument } from '../../src/entities/topping';

const stubToppingCollection = stub<Collection<ToppingDocument>>();
const stubPizzaCollection = stub<Collection<PizzaDocument>>();
const toppingProvider = new ToppingProvider(stubToppingCollection);
const pizzaProvider = new PizzaProvider(stubPizzaCollection, toppingProvider);

beforeEach(jest.clearAllMocks);

describe('pizzaProvider', (): void => {
  const mockPizzaDocument = createMockPizzaDocument();
  const mockPizza = toPizzaObject(mockPizzaDocument);

  describe('getPizzas', (): void => {
    beforeEach(() => {
      reveal(stubPizzaCollection).find.mockImplementation(mockCursorQuery([mockPizzaDocument]));
    });
    test('should call find once', async () => {
      await pizzaProvider.getPizzas({ cursor: null, limit: null });
      expect(stubPizzaCollection.find).toHaveBeenCalledTimes(2);
    });
    test('should get all pizzas', async () => {
      const { results } = await pizzaProvider.getPizzas({ cursor: null, limit: null });
      expect(results).toEqual([mockPizza]);
    });
  });

  describe('createPizza', (): void => {
    const validTopping = createMockTopping({ name: 'test topping', priceCents: 12345 });
    const validPizza = createMockPizzaDocument({
      name: 'test pizza',
      description: 'test pizza description',
      imgSrc: 'test pizza imgSrc',
      toppingIds: [validTopping.id],
    });
    beforeEach(() => {
      reveal(stubPizzaCollection).findOneAndUpdate.mockImplementation(() => ({ value: validPizza }));
      toppingProvider.validateToppings = jest.fn(() => Promise.resolve());
    });
    test('should call findOneAndUpdate once', async () => {
      await pizzaProvider.createPizza({
        name: validPizza.name,
        description: validPizza.description,
        imgSrc: validPizza.imgSrc,
        toppingIds: validPizza.toppingIds,
      });
      expect(stubPizzaCollection.findOneAndUpdate).toHaveBeenCalledTimes(1);
    });

    test('should return a pizza when passed valid input', async () => {
      const result = await pizzaProvider.createPizza({
        name: validPizza.name,
        description: validPizza.description,
        imgSrc: validPizza.imgSrc,
        toppingIds: validPizza.toppingIds,
      });
      expect(result).toEqual(toPizzaObject(validPizza));
    });
  });

  describe('deletePizza', (): void => {
    beforeEach(() => {
      reveal(stubPizzaCollection).deleteOne.mockImplementation(() => Promise.resolve({ deletedCount: 1 }));
    });

    test('should call deleteOne once', async () => {
      await pizzaProvider.deletePizza({ id: mockPizza.id });
      expect(stubPizzaCollection.deleteOne).toHaveBeenCalledTimes(1);
    });

    test('should throw an error if findOneAndDelete returns null for value', async () => {
      reveal(stubPizzaCollection).deleteOne.mockImplementation(() => Promise.resolve({ deletedCount: 0 }));
      await expect(pizzaProvider.deletePizza({ id: mockPizza.id })).rejects.toThrow(
        new Error(`Could not delete the pizza`)
      );
    });

    test('should return an id', async () => {
      const result = await pizzaProvider.deletePizza({ id: mockPizza.id });
      expect(result).toEqual(mockPizza.id);
    });
  });

  describe('updatePizza', (): void => {
    const validTopping = createMockTopping({ name: 'test topping', priceCents: 12345 });
    const validPizza = createMockPizzaDocument({
      name: 'test pizza',
      description: 'test pizza description',
      imgSrc: 'test pizza imgSrc',
      toppingIds: [validTopping.id],
    });
    beforeEach(() => {
      reveal(stubPizzaCollection).findOneAndUpdate.mockImplementation(() => ({ value: validPizza }));
    });

    test('should call findOneAndUpdate once', async () => {
      await pizzaProvider.updatePizza({
        id: validPizza.id,
      });

      expect(stubPizzaCollection.findOneAndUpdate).toHaveBeenCalledTimes(1);
    });

    test('should return a pizza', async () => {
      const result = await pizzaProvider.updatePizza({
        id: validPizza.id,
        name: validPizza.name,
        description: validPizza.description,
        imgSrc: validPizza.imgSrc,
        toppingIds: validPizza.toppingIds,
      });
      expect(result).toEqual(toPizzaObject(validPizza));
    });
  });
});
