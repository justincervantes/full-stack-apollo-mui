import { ObjectId, Collection } from 'mongodb';
import validateStringInputs from '../../../lib/string-validator';
import { PizzaDocument, toPizzaObject } from '../../../entities/pizza';
import {
  CreatePizzaInput,
  UpdatePizzaInput,
  DeletePizzaInput,
  Pizza,
  GetPizzasInput,
  GetPizzasResponse,
} from './pizza.provider.types';
import { ToppingProvider } from '../toppings/topping.provider';
import { CursorProvider } from '../cursor/cursor.provider';

class PizzaProvider {
  cursorProvider;
  constructor(private collection: Collection<PizzaDocument>, private toppingProvider: ToppingProvider) {
    this.cursorProvider = new CursorProvider(collection);
  }

  public async getPizzas(input: GetPizzasInput): Promise<GetPizzasResponse> {
    const cursorData = await this.cursorProvider.getCursorResult(input);
    return cursorData;
  }

  public async createPizza(input: CreatePizzaInput): Promise<Pizza> {
    const { name, description, imgSrc, toppingIds } = input;
    validateStringInputs([name, description, imgSrc, ...toppingIds]);
    await this.toppingProvider.validateToppings(toppingIds);

    const data = await this.collection.findOneAndUpdate(
      { _id: new ObjectId() },
      { $set: { ...input, updatedAt: new Date().toISOString(), createdAt: new Date().toISOString() } },
      { upsert: true, returnDocument: 'after' }
    );

    const pizza = data.value;

    if (!pizza) {
      throw new Error(`Could not create the ${input.name} pizza`);
    }

    return toPizzaObject(pizza);
  }

  public async updatePizza(input: UpdatePizzaInput): Promise<Pizza> {
    const { id, name, description, imgSrc, toppingIds } = input;
    if (name) {
      validateStringInputs(name);
    }
    if (description) {
      validateStringInputs(description);
    }
    if (imgSrc) {
      validateStringInputs(imgSrc);
    }
    if (toppingIds) {
      await this.toppingProvider.validateToppings(toppingIds);
    }

    const data = await this.collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...(name && { name: name }),
          ...(description && { description: description }),
          ...(imgSrc && { imgSrc: imgSrc }),
          ...(toppingIds && { toppingIds: toppingIds }),
          updatedAt: new Date().toDateString(),
        },
      },
      { returnDocument: 'after' }
    );

    const pizza = data.value;

    if (!pizza) {
      throw new Error(`Could not update the pizza`);
    }

    return toPizzaObject(pizza);
  }

  public async deletePizza(input: DeletePizzaInput): Promise<string> {
    const { id } = input;
    if (!ObjectId.isValid(id)) {
      throw new Error('Invalid object id supplied for deletion call');
    }
    const data = await this.collection.deleteOne({ _id: new ObjectId(id) });
    if (data.deletedCount !== 1) {
      throw new Error('Could not delete the pizza');
    }
    return id;
  }
}

export { PizzaProvider };
