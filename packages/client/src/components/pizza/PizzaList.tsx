import React from 'react';
import { useQuery } from '@apollo/client';
import { makeStyles } from '@material-ui/styles';
import { createStyles, Grid, CardMedia } from '@material-ui/core';
import { Pizza } from '../../types';
import { GET_PIZZAS } from '../../hooks/graphql/pizza/queries/get-pizzas';
import CardItemSkeleton from '../common/CardItemSkeleton';
import PizzaItem from './PizzaItem';
import CardItem from '../common/CardItem';

const useStyles = makeStyles(() =>
  createStyles({
    error: {
      color: 'red',
      whiteSpace: 'pre-line',
    },
  })
);

export interface PizzaListProps {
  selectPizza: (pizza: Pizza | undefined) => void;
  selectedPizza?: Pizza;
}

const PizzaList: React.FC<PizzaListProps> = ({ selectPizza }) => {
  const classes = useStyles();
  const input: { cursor: string | null; limit: number | null } = { cursor: null, limit: 5 };
  const { loading, data, error, fetchMore } = useQuery(GET_PIZZAS, {
    variables: { getPizzaInput: input },
  });
  if (loading) {
    return (
      <div>
        <CardItemSkeleton data-testid={'pizza-list-loading'} />
      </div>
    );
  }

  if (error) {
    return (
      <span
        className={classes.error}
      >{`Oops... something went wrong!\nError message from server: ${error.message}`}</span>
    );
  }

  const loadMore = (data: any) => {
    if (!data.pizzas.hasNextPage) {
      return;
    }
    const cursor: string = data.pizzas.results[data.pizzas.results.length - 1].id;
    fetchMore({
      variables: { getPizzaInput: { cursor, limit: 3 } },
      updateQuery: (prevResult, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prevResult;
        return {
          pizzas: {
            cursor: fetchMoreResult.pizzas.cursor,
            hasNextPage: fetchMoreResult.pizzas.hasNextPage,
            totalCount: fetchMoreResult.pizzas.totalCount,
            results: [...prevResult.pizzas.results, ...fetchMoreResult.pizzas.results],
          },
        };
      },
    });
  };

  return (
    <Grid container spacing={4} justifyContent="center" alignItems="center" data-testid="pizza-list">
      <Grid
        item
        xs={4}
        onClick={(): void => {
          selectPizza(undefined);
        }}
      >
        <CardItem>
          <CardMedia
            component="img"
            height="80%"
            image="https://i.pinimg.com/originals/7b/3c/c2/7b3cc251e8c8bd3b1c630a9bbd24b6ad.gif"
            alt="Pizza Picture"
          />
          <h2>Add a new pizza!</h2>
          <p>The cats are hungry</p>
        </CardItem>
      </Grid>

      {data.pizzas.results.map((pizza: Pizza) => (
        <Grid
          item
          xs={4}
          key={pizza.id}
          onClick={(): void => {
            selectPizza(pizza);
          }}
        >
          <PizzaItem
            id={pizza.id}
            name={pizza.name}
            description={pizza.description}
            imgSrc={pizza.imgSrc}
            priceCents={pizza.priceCents}
          />
        </Grid>
      ))}

      <Grid item xs={4}>
        <CardItem
          data-testid={`pizza-load-more`}
          onClick={(): void => {
            loadMore(data);
          }}
        >
          {data.pizzas.hasNextPage ? (
            <>
              <CardMedia
                component="img"
                height="80%"
                image="https://i.pinimg.com/564x/6e/66/0a/6e660ac5470b8d8fc38ff2660e2548fe.jpg"
                alt="Pizza Picture"
              />
              <h2>Load more pizzas</h2>
              <p>Unleash the noms</p>
            </>
          ) : (
            <>
              <CardMedia
                component="img"
                height="80%"
                image="https://i.pinimg.com/564x/cd/00/29/cd0029baaac6ef1813e26763584add62.jpg"
                alt="Pizza Picture"
              />
              <h2>No more pizzas to load</h2>
              <p>Sad life</p>
            </>
          )}
        </CardItem>
      </Grid>
    </Grid>
  );
};

export default PizzaList;
