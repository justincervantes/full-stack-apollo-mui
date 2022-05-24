import React from 'react';
import { useFormik } from 'formik';
import Autocomplete from '@material-ui/lab/Autocomplete';
import * as yup from 'yup';
import { TextField, Button, createStyles, makeStyles, Theme } from '@material-ui/core';
import { Topping } from '../../types';
import usePizzaMutations from '../../hooks/pizza/use-pizza-mutations';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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

const validationSchema = yup.object({
  name: yup.string().required('Name is required'),
  description: yup.string().required('Description is required'),
  imgSrc: yup.string().required('Image source is required'),
  toppingIds: yup.array().min(1, 'At least one topping is required'),
});

interface PizzaFormProps {
  selectedPizza?: any;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toppings: Topping[];
}

const PizzaForm: React.FC<PizzaFormProps> = ({ selectedPizza, setOpen, toppings }) => {
  const { onCreatePizza, onDeletePizza, onUpdatePizza } = usePizzaMutations();
  const classes = useStyles();
  const formik = useFormik({
    initialValues: {
      id: selectedPizza?.id,
      name: selectedPizza?.name,
      description: selectedPizza?.description,
      imgSrc: selectedPizza?.imgSrc,
      toppingIds: selectedPizza?.toppingIds,
    },
    validationSchema,
    onSubmit: (values) => {
      selectedPizza?.id ? onUpdatePizza(values) : onCreatePizza(values);
      setOpen(false);
    },
    enableReinitialize: true,
  });

  return (
    <div>
      <h2>{selectedPizza ? 'Edit' : 'Add'} Pizza</h2>
      <form onSubmit={formik.handleSubmit} className={classes.root} noValidate autoComplete="off">
        <TextField
          id="name"
          name="name"
          label="Pizza Name"
          value={formik.values.name}
          onChange={formik.handleChange}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
        />
        <TextField
          id="description"
          name="description"
          label="Pizza Description"
          value={formik.values.description}
          onChange={formik.handleChange}
          error={formik.touched.description && Boolean(formik.errors.description)}
          helperText={formik.touched.description && formik.errors.description}
        />
        <TextField
          id="imgSrc"
          name="imgSrc"
          label="Pizza Image Source"
          value={formik.values.imgSrc}
          onChange={formik.handleChange}
          error={formik.touched.imgSrc && Boolean(formik.errors.imgSrc)}
          helperText={formik.touched.imgSrc && formik.errors.imgSrc}
        />
        <Autocomplete
          multiple
          id="toppingIds"
          options={toppings}
          getOptionLabel={(option): string => option.name}
          value={toppings.filter((topping: Topping) => formik.values.toppingIds?.includes(topping.id))}
          renderInput={(params): JSX.Element => (
            <TextField
              {...params}
              variant="standard"
              label="Pizza Toppings"
              error={formik.touched.toppingIds && Boolean(formik.errors.toppingIds)}
              helperText={formik.touched.toppingIds && formik.errors.toppingIds}
            />
          )}
          onChange={(_e, value): any =>
            formik.setFieldValue(
              'toppingIds',
              value.map((topping) => topping.id)
            )
          }
        />
        {selectedPizza?.id && (
          <Button
            color="secondary"
            onClick={(): void => {
              onDeletePizza(selectedPizza);
              setOpen(false);
            }}
          >
            Delete
          </Button>
        )}
        <Button color="primary" type="submit">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default PizzaForm;
