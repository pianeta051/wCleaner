import { FC, useEffect, useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Typography,
  Box,
  FormControlLabel,
  Checkbox,
  FormGroup,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";
import { Button, Grid } from "@mui/material";
import { Field, Title, Wrapper } from "./CustomerForm.style";
import { LoadingButton } from "@mui/lab";
import { Form } from "../../Form/Form";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  CustomerAddressForm,
  CustomerAddressFormValues,
} from "../CustomerAddressForm/CustomerAddressForm";

export type CustomerFormValues = {
  name: string;
  address: string;
  postcode: string;
  mainTelephone: string;
  secondTelephone: string;
  email: string;
  fileUrls?: string[];
  cleaningAddresses: CustomerAddressFormValues[];
};

const INITIAL_VALUES: CustomerFormValues = {
  name: "",
  address: "",
  postcode: "",
  mainTelephone: "",
  secondTelephone: "",
  email: "",
  fileUrls: [],
  cleaningAddresses: [],
};

const ukPostcodeRegex = /^[A-Z]{1,2}[0-9R][0-9A-Z]?\s?[0-9][A-Z]{2}$/i;

const validationSchema = yup.object<CustomerFormValues>({
  email: yup.string().email("Invalid email"),
  name: yup.string().required("Name is required"),
  address: yup.string().required("Address is required"),
  postcode: yup
    .string()
    .required("Postcode is required")
    .test(
      "is-valid-uk-postcode",
      "It must be a valid UK postcode",
      (postcode) => {
        if (!postcode) return false;
        const trimmed = postcode.trim();
        return trimmed.length < 5 || ukPostcodeRegex.test(trimmed);
      }
    ),
  mainTelephone: yup.string(),
  secondTelephone: yup.string(),
  cleaningAddresses: yup.array().of(
    yup.object({
      name: yup.string().required("Name is required"),
      address: yup.string().required("Address is required"),
      postcode: yup
        .string()
        .required("Postcode is required")
        .test(
          "is-valid-uk-postcode",
          "It must be a valid UK postcode",
          (postcode) => {
            if (!postcode) return false;
            const trimmed = postcode.trim();
            return trimmed.length < 5 || ukPostcodeRegex.test(trimmed);
          }
        ),
    })
  ),
});

const labels: { [x in keyof CustomerFormValues]: string } = {
  email: "Email",
  address: "Billing address",
  name: "Full name",
  postcode: "Postcode",
  mainTelephone: "Main Telephone",
  secondTelephone: "Second Telephone",
  cleaningAddresses: "Cleaning Addresses",
};

type CustomerFormProps = {
  onSubmit: (customer: CustomerFormValues) => void;
  onCancel?: () => void;
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
  const [copyAddress, setCopyAddress] = useState(true);
  const gridSize =
    layout === "vertical" ? { xs: 12 } : { xs: 12, sm: 6, md: 4 };

  const requiredFields = ["name", "address", "postcode"];

  const addressChangeHandler = (
    formValues: CustomerAddressFormValues,
    index: number
  ) => {
    const updated = [...formik.values.cleaningAddresses];
    updated[index] = formValues;
    formik.setFieldValue("cleaningAddresses", updated);
  };

  const addAddressHandler = () => {
    const updated = [...formik.values.cleaningAddresses];
    updated.push({ name: "", address: "", postcode: "" });
    formik.setFieldValue("cleaningAddresses", updated);
  };

  const copyAddressChangeHandle = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCopyAddress(event.target.checked);
  };

  useEffect(() => {
    if ((formik.values.address || formik.values.postcode) && copyAddress) {
      formik.setFieldValue("cleaningAddresses", [
        {
          name: "Home",
          address: formik.values.address,
          postcode: formik.values.postcode,
        },
      ]);
    }
  }, [formik.values.address, formik.values.postcode, copyAddress]);

  const scalarFields: (keyof CustomerFormValues)[] = [
    "name",
    "address",
    "postcode",
    "mainTelephone",
    "secondTelephone",
    "email",
  ];

  return (
    <Wrapper
      sx={{ overflowY: "scroll", maxHeight: "700px" }}
      container
      spacing={2}
    >
      <Form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          {scalarFields.map((fieldName) => (
            <Grid item {...gridSize} key={fieldName}>
              <Field
                name={fieldName}
                id={fieldName}
                label={labels[fieldName]}
                type={fieldName === "email" ? "email" : "text"}
                fullWidth
                required={requiredFields.includes(fieldName)}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values[fieldName]}
                error={
                  !!(formik.touched[fieldName] && formik.errors[fieldName])
                }
                helperText={
                  (formik.touched[fieldName] as boolean)
                    ? (formik.errors[fieldName] as string)
                    : ""
                }
              />
            </Grid>
          ))}
          <Grid item xs={12}>
            <Title variant="h5">Cleaning Addresses</Title>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={copyAddress}
                    onChange={copyAddressChangeHandle}
                  />
                }
                label="Copy billing address into cleaning address"
              />
            </FormGroup>
          </Grid>

          {formik.values.cleaningAddresses.map((addr, index) => (
            <Grid item xs={8} key={index} sx={{ pl: 5 }}>
              <Accordion defaultExpanded>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <Box
                    sx={{
                      flexGrow: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      pr: 2,
                    }}
                  >
                    <Typography variant="subtitle1">
                      {addr.address || `Address ${index + 1}`}
                    </Typography>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => {
                        const updated = [...formik.values.cleaningAddresses];
                        updated.splice(index, 1);
                        formik.setFieldValue("cleaningAddresses", updated);
                      }}
                      size="small"
                      disabled={copyAddress}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <CustomerAddressForm
                    value={addr}
                    onChange={(formValues) =>
                      addressChangeHandler(formValues, index)
                    }
                    onBlur={() => formik.setFieldTouched("cleaningAddresses")}
                    errors={
                      formik.errors.cleaningAddresses?.[index] as {
                        name?: string;
                        address?: string;
                        postcode?: string;
                      }
                    }
                    disabled={copyAddress}
                  />
                </AccordionDetails>
              </Accordion>
            </Grid>
          ))}

          <Grid item xs={12} ml={5}>
            <Button onClick={addAddressHandler} disabled={copyAddress}>
              Add Address
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Grid
              container
              spacing={2}
              justifyContent="center"
              alignItems="center"
              mb={10}
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
    </Wrapper>
  );
};
