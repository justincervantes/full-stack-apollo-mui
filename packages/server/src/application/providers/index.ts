import { setupDb } from '../database';

import { ToppingProvider } from './toppings/topping.provider';
import { PizzaProvider } from './pizzas/pizza.provider';

const db = setupDb();

const toppingProvider = new ToppingProvider(db.collection('toppings'));
const pizzaProvider = new PizzaProvider(db.collection('pizzas'), toppingProvider);

export { toppingProvider, pizzaProvider };
