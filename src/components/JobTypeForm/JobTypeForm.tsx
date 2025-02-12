import { LoadingButton } from "@mui/lab";
import {
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import { FC } from "react";
import { CirclePicker, ColorResult } from "react-color";
import { Form } from "../Form/Form";
import * as yup from "yup";

export type JobTypeFormValues = {
  color: string;
  name: string;
};

const EMPTY_FORM: JobTypeFormValues = {
  color: "#f44336",
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
};
export const JobTypeForm: FC<JobTypeFormProps> = ({
  loading = false,
  initialValues = EMPTY_FORM,
  onSubmit,
}) => {
  const formik = useFormik<JobTypeFormValues>({
    initialValues,
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
          />
        </CardContent>
      </Card>
      <LoadingButton loading={loading} variant="outlined" type="submit">
        Save
      </LoadingButton>
    </Form>
  );
};
