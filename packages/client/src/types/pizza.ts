import { Topping } from './topping';

export interface Pizza {
  toppings: Topping[];
  id: string;
  name: string;
  imgSrc: string;
  description: string;
  priceCents: number;
}
