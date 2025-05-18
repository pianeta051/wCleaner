import { FC } from "react";
import { Button, Grid, Container, Box } from "@mui/material";
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
  email: yup.string().email("Invalid email").required("Email is required"),
  name: yup.string().required("Name is required"),
  address: yup.string().required("Address is required"),
  postcode: yup
    .string()
    .required("Postcode is required")
    .test(
      "is-valid-uk-postcode",
      "It must be a valid UK postcode",
      (postcode) => {
        const postcodeParts = postcode?.trim().split(/\s+/) || [];
        return postcodeParts.length === 2;
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

  const gridSize =
    layout === "vertical" ? { xs: 12 } : { xs: 12, sm: 6, md: 4 };

  const requiredFields = ["name", "address", "postcode", "email"];

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
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
            <Grid item {...gridSize} key={fieldName}>
              <Field
                name={fieldName}
                id={fieldName}
                label={fieldName.replace(/([A-Z])/g, " $1").toLowerCase()}
                type={fieldName === "email" ? "email" : "text"}
                fullWidth
                required={requiredFields.includes(fieldName)}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
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
                    : ""
                }
              />
            </Grid>
          ))}

          <Grid item xs={12}>
            <Grid
              container
              spacing={2}
              justifyContent="center"
              alignItems="center"
            >
              <Grid item>
                <LoadingButton
                  variant="contained"
                  color="primary"
                  type="submit"
                  loading={loading}
                  sx={{ minWidth: 120, textTransform: "none" }}
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
                    sx={{ minWidth: 120, textTransform: "none" }}
                  >
                    Cancel
                  </Button>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Form>
    </Container>
  );
};
