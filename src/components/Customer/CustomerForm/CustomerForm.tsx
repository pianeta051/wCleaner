import { FC } from "react";
import { Button, Grid } from "@mui/material";
import { Field } from "./CustomerForm.style";
import { LoadingButton } from "@mui/lab";
import { Form } from "../../Form/Form";
import { useFormik } from "formik";
import * as yup from "yup";

export type CustomerFormValues = {
  name: string;
  address: string;
  postcode: string;
  mainTelephone: string;
  secondTelephone: string;
  email: string;
  fileUrls?: string[];
};

const INITIAL_VALUES: CustomerFormValues = {
  name: "",
  address: "",
  postcode: "",
  mainTelephone: "",
  secondTelephone: "",
  email: "",
  fileUrls: [],
};

const validationSchema = yup.object<CustomerFormValues>({
  email: yup.string().email().required(),
  name: yup.string().required(),
  address: yup.string().required(),
  postcode: yup
    .string()
    .required()
    .test(
      "is-valid-uk-postcode",
      "It must be a valid UK postcode",
      (postcode) => {
        const postcodeParts = postcode.split(/\s/g);
        const filteredPostcodeParts = postcodeParts.filter((part) => !!part);
        return filteredPostcodeParts.length === 2;
      }
    ),
  mainTelephone: yup.string(),
  secondTelephone: yup.string(),
});

type CustomerFormProps = {
  onSubmit: (customer: CustomerFormValues) => void;
  onCancel?: () => void;
  onDelete?: () => void;
  initialValues?: CustomerFormValues;
  loading?: boolean;
  layout?: "vertical" | "horizontal";
};

export const CustomerForm: FC<CustomerFormProps> = ({
  onSubmit,
  onCancel,
  initialValues = INITIAL_VALUES,
  loading = false,
  layout = "vertical",
}) => {
  const formik = useFormik<CustomerFormValues>({
    initialValues,
    onSubmit,
    validationSchema,
  });

  const columns = layout === "vertical" ? 12 : { xs: 12, sm: 6, md: 4 };

  return (
    <Form onSubmit={formik.handleSubmit}>
      <Grid container spacing={3}>
        {[
          "name",
          "address",
          "postcode",
          "mainTelephone",
          "secondTelephone",
          "email",
        ].map((fieldName) => (
          <Grid
            item
            key={fieldName}
            {...(typeof columns === "number" ? { xs: columns } : columns)}
          >
            <Field
              name={fieldName}
              id={fieldName}
              label={fieldName.replace(/([A-Z])/g, " $1").toLowerCase()}
              type={fieldName === "email" ? "email" : "text"}
              fullWidth
              required={["name", "address", "postcode", "email"].includes(
                fieldName
              )}
              onChange={formik.handleChange}
              value={formik.values[fieldName as keyof CustomerFormValues]}
              error={
                !!(
                  formik.touched[fieldName as keyof CustomerFormValues] &&
                  formik.errors[fieldName as keyof CustomerFormValues]
                )
              }
              helperText={
                formik.touched[fieldName as keyof CustomerFormValues]
                  ? formik.errors[fieldName as keyof CustomerFormValues]
                  : undefined
              }
            />
          </Grid>
        ))}

        <Grid item xs={12} mt={3}>
          <Grid
            container
            direction="column"
            alignItems="center"
            justifyContent="center"
            spacing={2}
          >
            <Grid item>
              <LoadingButton
                variant="contained"
                color="primary"
                type="submit"
                loading={loading}
                sx={{
                  width: { xs: "100%", sm: "200px" },
                  textTransform: "none",
                }}
              >
                Save
              </LoadingButton>
            </Grid>

            {onCancel && (
              <Grid item>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={onCancel}
                  sx={{
                    width: { xs: "100%", sm: "200px" },
                    textTransform: "none",
                    mb: 2,
                  }}
                >
                  Cancel
                </Button>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Form>
  );
};
