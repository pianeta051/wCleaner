import { Button } from "@mui/material";
import {
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import { FC, useMemo } from "react";
import { CirclePicker, ColorResult } from "react-color";
import { Form } from "../Form/Form";
import * as yup from "yup";

export type JobTypeFormValues = {
  color: string;
  name: string;
};

const DEFAULT_COLORS = [
  "#f44336",
  "#e91e63",
  "#9c27b0",
  "#673ab7",
  "#3f51b5",
  "#2196f3",
  "#03a9f4",
  "#00bcd4",
  "#009688",
  "#4caf50",
  "#8bc34a",
  "#cddc39",
  "#ffeb3b",
  "#ffc107",
  "#ff9800",
  "#ff5722",
  "#795548",
];

export const MAX_JOB_TYPES = DEFAULT_COLORS.length;

const EMPTY_FORM: JobTypeFormValues = {
  color: "",
  name: "",
};
const validationSchema = yup.object<JobTypeFormValues>({
  color: yup.string().required(),
  name: yup.string(),
});
type JobTypeFormProps = {
  onSubmit: (values: JobTypeFormValues) => void;
  loading?: boolean;
  initialValues?: JobTypeFormValues;
  omitColors?: string[];
};
export const JobTypeForm: FC<JobTypeFormProps> = ({
  loading = false,
  initialValues = EMPTY_FORM,
  onSubmit,
  omitColors = [],
}) => {
  const colors = useMemo(
    () => DEFAULT_COLORS.filter((color) => !omitColors.includes(color)),
    [omitColors]
  );
  const initialColor = initialValues.color ? initialValues.color : colors[0];
  const formik = useFormik<JobTypeFormValues>({
    initialValues: {
      ...initialValues,
      color: initialColor,
    },
    onSubmit,
    validationSchema,
  });

  const colorChangeHandler = (color: ColorResult) => {
    formik.handleChange({
      target: {
        name: "color",
        value: color.hex,
      },
    });
  };

  return (
    <Form onSubmit={formik.handleSubmit}>
      <TextField
        label="Name"
        name="name"
        variant="outlined"
        margin="normal"
        onChange={formik.handleChange}
        value={formik.values.name}
        onBlur={formik.handleBlur}
      />

      <Card sx={{ mb: 3 }}>
        <CardHeader title="Pick a color" />
        <CardMedia
          sx={{ backgroundColor: formik.values.color, height: 50 }}
          component="div"
        />
        <CardContent>
          <CirclePicker
            color={formik.values.color}
            onChange={colorChangeHandler}
            colors={colors}
          />
        </CardContent>
      </Card>
      <Button loading={loading} variant="outlined" type="submit">
        Save
      </Button>
    </Form>
  );
};
