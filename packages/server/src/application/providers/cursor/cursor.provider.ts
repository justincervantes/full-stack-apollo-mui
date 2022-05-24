import { Collection } from 'mongodb';
import { toPizzaObject } from '../../../entities/pizza';
import { GetPizzasResponse } from '../pizzas/pizza.provider.types';
import { GetCursorIndexInput, GetCursorIndexResponse, GetCursorResultInput } from './cursor.provider.types';

class CursorProvider {
  constructor(private collection: Collection<any>) {}
  DEFAULT_PAGE_LIMIT = 6;

  private async getCursorIndex(input: GetCursorIndexInput): Promise<GetCursorIndexResponse> {
    const data = await this.collection.find().sort({ name: 1 }).toArray();
    const mappedData = data.map((document) => document._id.toHexString());
    const index = input.cursor ? mappedData.indexOf(input.cursor) + 1 : 0;
    return {
      cursorIndex: index,
      totalDataLength: mappedData.length,
    };
  }

  public async getCursorResult(input: GetCursorResultInput): Promise<GetPizzasResponse> {
    let { cursor, limit } = input;
    limit = limit || this.DEFAULT_PAGE_LIMIT;
    let skipValue = 0;
    let totalRecords = 0;

    const { cursorIndex, totalDataLength } = await this.getCursorIndex({ cursor });
    skipValue = cursorIndex;
    totalRecords = totalDataLength;
    const data = await this.collection.find().sort({ name: 1 }).skip(skipValue).limit(limit).toArray();

    return {
      totalCount: data.length,
      hasNextPage: totalRecords - skipValue > data.length,
      cursor: data[data.length - 1]._id,
      results: data.map((pizza) => toPizzaObject(pizza)),
    };
  }
}

export { CursorProvider };
