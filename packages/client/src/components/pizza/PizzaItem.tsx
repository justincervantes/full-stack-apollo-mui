import React from 'react';
import { CardMedia } from '@material-ui/core';

import CardItem from '../common/CardItem';
import toDollars from '../../lib/format-dollars';

export interface PizzaItemProps {
  id: string;
  name: string;
  description: string;
  imgSrc: string;
  priceCents: number;
}

const PizzaItem: React.FC<PizzaItemProps> = ({ id, name, description, imgSrc, priceCents }) => {
  return (
    <CardItem data-testid={`pizza-item-${id}`}>
      <CardMedia data-testid={`pizza-imgSrc-${id}`} component="img" height="80%" image={imgSrc} alt="Pizza Picture" />
      <h2 data-testid={`pizza-name-${id}`}>{name}</h2>
      <p data-testid={`pizza-description-${id}`}>{description}</p>
      <span data-testid={`pizza-priceCents-${id}`}>
        {priceCents !== undefined && priceCents !== null ? toDollars(priceCents) : 'No price data available'}
      </span>
    </CardItem>
  );
};

export default PizzaItem;
