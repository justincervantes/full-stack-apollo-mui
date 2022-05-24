import React from 'react';
import { Backdrop, createStyles, Fade, makeStyles, Modal, Paper, Theme, CircularProgress } from '@material-ui/core';
import { useQuery } from '@apollo/client';
import { GET_TOPPINGS } from '../../hooks/graphql/topping/queries/get-toppings';
import PizzaForm from './PizzaForm';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
    root: {
      '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: '100ch',
      },
      display: 'flex',
      flexDirection: 'column',
    },
  })
);

interface PizzaModalProps {
  selectedPizza?: any;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const PizzaModal = ({ selectedPizza, open, setOpen }: PizzaModalProps): JSX.Element => {
  const classes = useStyles();
  const { loading, data, error } = useQuery(GET_TOPPINGS);
  if (error) console.error(error);

  if (loading) return <CircularProgress />;
  const { toppings } = data;

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={open}
      onClose={(): void => setOpen(false)}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <Paper className={classes.paper}>
          <PizzaForm selectedPizza={selectedPizza} setOpen={setOpen} toppings={toppings} />
        </Paper>
      </Fade>
    </Modal>
  );
};

export default PizzaModal;
