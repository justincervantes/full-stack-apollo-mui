import { screen, waitFor } from '@testing-library/react';
import { graphql } from 'msw';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../lib/test/renderWithProviders';
import { createTestPizza } from '../../../lib/test/helper/pizza';
import PizzaList, { PizzaListProps } from '../PizzaList';
import { server } from '../../../lib/test/msw-server';
import { Pizza } from '../../../types';
import * as apollo from '@apollo/client';

describe('PizzaList', () => {
  const renderPizzaList = (props: PizzaListProps) => {
    const view = renderWithProviders(<PizzaList {...props} />);
    return {
      ...view,
      $getPizzaList: () => screen.findByTestId(/^pizza-list/),
      $getPizzaItems: () => screen.findAllByTestId(/^pizza-item/),
      $getLoadingSkeleton: () => screen.findByTestId(/^pizza-list-loading/),
      $getLoadMoreButton: () => screen.findByTestId(/^pizza-load-more/),
    };
  };

  const mockPizzasQuery = (data: Partial<Pizza[]>) => {
    server.use(
      graphql.query('Pizzas', (_request, response, context) => {
        return response(
          context.data({
            loading: false,
            pizzas: {
              cursor: '',
              hasNextPage: true,
              totalCount: 2,
              results: [...data],
            },
          })
        );
      })
    );
  };

  beforeEach(() => {
    const pizza1 = createTestPizza();
    const pizza2 = createTestPizza({ id: '' });
    mockPizzasQuery([pizza1, pizza2]);
  });

  const props = {
    selectPizza: jest.fn(),
    selectedPizza: createTestPizza(),
  };

  test('should display all pizza item fields', async () => {
    const { $getPizzaList, $getPizzaItems } = renderPizzaList(props);
    await waitFor(async () => {
      expect(await $getPizzaList()).toBeVisible;
      expect(await $getPizzaItems()).toHaveLength(2);
    });
  });

  test('should display the loading message while the GraphQL call is in the loading state', async () => {
    const { $getLoadingSkeleton } = renderPizzaList(props);
    await waitFor(async () => expect(await $getLoadingSkeleton()).toBeVisible);
  });

  test('should call the selectPizza function when a PizzaItem is clicked', async () => {
    const { $getPizzaItems } = renderPizzaList(props);
    const pizzaItems = await $getPizzaItems();
    const firstPizza = pizzaItems[0];
    userEvent.click(firstPizza);
    expect(props.selectPizza).toHaveBeenCalledTimes(1);
  });

  test('should call useQuery hook 4 times, twice on load and twice on refresh (when the loadMore button is clicked)', async () => {
    const loadMoreSpy = jest.spyOn(apollo, 'useQuery');
    const { $getLoadMoreButton } = renderPizzaList(props);
    expect(loadMoreSpy).toHaveBeenCalledTimes(2);
    const loadMoreCard = await $getLoadMoreButton();
    userEvent.click(loadMoreCard);
    expect(loadMoreSpy).toHaveBeenCalledTimes(4);
  });
});
