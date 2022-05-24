import { ObjectId } from 'bson';
import { Pizza } from '../../../types/schema';

export const createTestPizza = (data: Partial<Pizza> = {}): Pizza & { __typename: string } => ({
  __typename: 'Pizza',
  id: new ObjectId().toHexString(),
  name: 'A test pizza name',
  description: 'A test pizza description',
  imgSrc: 'A test pizza imgSrc',
  priceCents: 500,
  toppingIds: ['564f0184537878b57efcb703'],
  toppings: [{ id: '564f0184537878b57efcb703', name: 'Tomato Sauce', priceCents: 500 }],
  ...data,
});
