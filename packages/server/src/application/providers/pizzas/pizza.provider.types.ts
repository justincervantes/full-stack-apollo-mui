import { Topping } from '../toppings/topping.provider.types';

export interface Pizza {
  id: string;
  name: string;
  description: string;
  toppingIds: string[];
  imgSrc: string;
  toppings?: Topping[];
}

export interface GetPizzasResponse {
  totalCount: number;
  hasNextPage: boolean;
  cursor: string;
  results: Pizza[];
}

export interface GetPizzasInput {
  cursor?: string | null;
  limit?: number | null;
}

export interface CreatePizzaInput {
  name: string;
  description: string;
  imgSrc: string;
  toppingIds: string[];
}

export interface UpdatePizzaInput {
  id: string;
  name?: string | null;
  description?: string | null;
  imgSrc?: string | null;
  toppingIds?: string[] | null;
}

export interface DeletePizzaInput {
  id: string;
}
