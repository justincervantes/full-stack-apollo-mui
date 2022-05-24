import React from 'react';
import { Container } from '@material-ui/core';
import PizzaList from './PizzaList';
import PageHeader from '../common/PageHeader';
import { Pizza } from '../../types';
import PizzaModal from './PizzaModal';

const Pizzas: React.FC = () => {
  const [selectedPizza, setSelectedPizza] = React.useState<Pizza | undefined>();
  const [open, setOpen] = React.useState<boolean>(false);

  const selectPizza = (pizza: Pizza | undefined): void => {
    setOpen(true);
    setSelectedPizza(pizza);
  };

  return (
    <Container maxWidth={false}>
      <PageHeader pageHeader={'Pizzas'} />
      <PizzaList selectPizza={selectPizza} selectedPizza={selectedPizza} />
      <PizzaModal selectedPizza={selectedPizza} open={open} setOpen={setOpen} />
    </Container>
  );
};

export default Pizzas;
