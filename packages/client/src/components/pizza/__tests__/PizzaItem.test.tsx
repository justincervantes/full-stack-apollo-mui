import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../../lib/test/renderWithProviders';
import { createTestPizza } from '../../../lib/test/helper/pizza';
import PizzaItem, { PizzaItemProps } from '../PizzaItem';

describe('PizzaItem', () => {
  const renderPizzaItem = (props: PizzaItemProps) => {
    const view = renderWithProviders(<PizzaItem {...props} />);

    return {
      ...view,
      $getImgSrc: () => screen.getByTestId(/^pizza-imgSrc/),
      $getName: () => screen.getByTestId(/^pizza-name/),
      $getDescription: () => screen.getByTestId(/^pizza-description/),
      $getPrice: () => screen.getByTestId(/^pizza-price/),
    };
  };

  const mockPizza = createTestPizza();

  const props = {
    id: mockPizza.id,
    name: mockPizza.name,
    description: mockPizza.description,
    imgSrc: mockPizza.imgSrc,
    priceCents: mockPizza.priceCents,
  };

  test('should display all components of the pizza item', async () => {
    const { $getPrice, $getName, $getImgSrc, $getDescription } = renderPizzaItem(props);
    expect($getImgSrc().getAttribute('src')).toContain('A test pizza imgSrc');
    expect($getName().innerHTML).toContain('A test pizza name');
    expect($getDescription().innerHTML).toContain('A test pizza description');
    expect($getPrice().innerHTML).toContain('CA$5.00');
  });
});
