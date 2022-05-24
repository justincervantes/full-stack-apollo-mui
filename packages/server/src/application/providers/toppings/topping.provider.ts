import { ObjectId, Collection } from 'mongodb';
import { ToppingDocument, toToppingObject } from '../../../entities/topping';
import { CreateToppingInput, Topping, UpdateToppingInput } from './topping.provider.types';
import validateStringInputs from '../../../lib/string-validator';

class ToppingProvider {
  constructor(private collection: Collection<ToppingDocument>) {}

  public async getToppings(): Promise<Topping[]> {
    const toppings = await this.collection.find().sort({ name: 1 }).toArray();
    return toppings.map(toToppingObject);
  }

  /**
   * This method takes all of the inputs, and parses it for unique object id strings using Set.
   * It then checks each unique string for object id format, which is required to prevent the constructor
   * of new ObjectId from providing its bad throw message. It then queries the db
   * If an equal number of unique strings matches the count of documents retrieved, then
   * all inputs were valid toppings.
   * @param stringObjectIds The raw input when creating an object
   */
  public async validateToppings(stringObjectIds: string[]): Promise<void> {
    const uniqueStringObjectIds = [...new Set(stringObjectIds)];

    uniqueStringObjectIds.forEach((toppingId) => {
      if (!ObjectId.isValid(toppingId)) {
        throw new Error('Each topping Id must be valid topping object id.');
      }
    });

    const objectIds = uniqueStringObjectIds.map((stringId) => new ObjectId(stringId));
    const toppings = await this.collection.find({ _id: { $in: objectIds } }).toArray();
    if (toppings.length !== uniqueStringObjectIds.length) {
      throw new Error('One of the passed toppingIds was not found');
    }
  }

  public async getToppingsByIds(stringObjectIds: string[]): Promise<Topping[]> {
    const objectIds = stringObjectIds.map((stringId) => new ObjectId(stringId));
    const toppings = await this.collection
      .find({ _id: { $in: objectIds } })
      .sort({ name: 1 })
      .toArray();
    return toppings.map(toToppingObject);
  }

  public async getPriceCents(stringObjectIds: string[]): Promise<number> {
    const objectIds = stringObjectIds.map((stringId) => new ObjectId(stringId));
    const toppings = await this.collection
      .find({ _id: { $in: objectIds } })
      .sort({ name: 1 })
      .toArray();
    return toppings.reduce((sum, current) => sum + current.priceCents, 0);
  }

  public async createTopping(input: CreateToppingInput): Promise<Topping> {
    const data = await this.collection.findOneAndUpdate(
      { _id: new ObjectId() },
      { $set: { ...input, updatedAt: new Date().toISOString(), createdAt: new Date().toISOString() } },
      { upsert: true, returnDocument: 'after' }
    );

    if (!data.value) {
      throw new Error(`Could not create the ${input.name} topping`);
    }
    const topping = data.value;

    return toToppingObject(topping);
  }

  public async deleteTopping(id: string): Promise<string> {
    const toppingId = new ObjectId(id);

    const toppingData = await this.collection.findOneAndDelete({
      _id: toppingId,
    });

    const topping = toppingData.value;

    if (!topping) {
      throw new Error(`Could not delete the topping`);
    }

    return id;
  }

  public async updateTopping(input: UpdateToppingInput): Promise<Topping> {
    const { id, name, priceCents } = input;

    if (name) {
      validateStringInputs(name);
    }

    const data = await this.collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...(name && { name: name }), ...(priceCents && { priceCents: priceCents }) } },
      { returnDocument: 'after' }
    );

    if (!data.value) {
      throw new Error(`Could not update the topping`);
    }
    const topping = data.value;

    return toToppingObject(topping);
  }
}

export { ToppingProvider };
