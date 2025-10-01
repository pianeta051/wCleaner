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
  AlertColor,
  Snackbar,
  Alert,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";
import { Button, Grid } from "@mui/material";
import { ActionBar, Field, Title, Wrapper } from "./CustomerForm.style";
import { LoadingButton } from "@mui/lab";
import { Form } from "../../Form/Form";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  CustomerAddressForm,
  CustomerAddressFormValues,
} from "../CustomerAddressForm/CustomerAddressForm";
import { useDeleteCustomerAddress } from "../../../hooks/Customers/addresses/useDeleteCustomerAddress";
import { ErrorMessage } from "../../ErrorMessage/ErrorMessage";

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
  enableCopyAddress?: boolean;
  customerId?: string;
  onReload?: () => void;
};

export const CustomerForm: FC<CustomerFormProps> = ({
  onSubmit,
  onCancel,
  initialValues = INITIAL_VALUES,
  loading = false,
  layout = "vertical",
  enableCopyAddress = true,
  customerId,
  onReload,
}) => {
  const formik = useFormik<CustomerFormValues>({
    initialValues,
    onSubmit,
    validationSchema,
  });
  const [copyAddress, setCopyAddress] = useState(enableCopyAddress);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<AlertColor>("success");
  const {
    deleteCustomerAddress,
    loading: deletingAddress,
    error: errorDeletingAddress,
  } = useDeleteCustomerAddress(customerId);
  const gridSize =
    layout === "vertical" ? { xs: 12 } : { xs: 12, sm: 6, md: 4 };

  const requiredFields = ["name", "address", "postcode"];

  useEffect(() => {
    formik.setFieldValue("cleaningAddresses", initialValues.cleaningAddresses);
  }, [initialValues.cleaningAddresses]);

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

  const deleteAddressHandle = async (index: number) => {
    const addressId = formik.values.cleaningAddresses[index]?.id;
    if (addressId) {
      deleteCustomerAddress(addressId)
        .then(() => {
          setSnackbarMessage("Address deleted");
          setSnackbarSeverity("success");
          setSnackbarOpen(true);
        })
        .catch(() => {
          // the hook manages the error state
        })
        .finally(() => {
          onReload?.();
        });
    } else {
      const addresses = [...formik.values.cleaningAddresses];
      addresses.splice(index, 1);
      formik.handleChange({
        target: { name: "cleaningAddresses", value: addresses },
      });
    }
  };

  return (
    <Wrapper container spacing={2} enableScroll={layout === "vertical"}>
      <Form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Customer Info
            </Typography>
          </Grid>

          {scalarFields.map((fieldName) => (
            <Grid item xs={12} sm={6} md={4} key={fieldName}>
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
                  formik.touched[fieldName]
                    ? (formik.errors[fieldName] as string)
                    : ""
                }
              />
            </Grid>
          ))}

          <Grid item xs={12}>
            <Box
              sx={{
                mt: 4,
                p: 2,
                borderRadius: 2,
                bgcolor: "background.paper",
                boxShadow: 1,
              }}
            >
              <Typography variant="h6" gutterBottom>
                Cleaning Addresses
              </Typography>

              {enableCopyAddress && (
                <FormGroup sx={{ mb: 2 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={copyAddress}
                        onChange={copyAddressChangeHandle}
                      />
                    }
                    label="Use billing address as cleaning address"
                  />
                </FormGroup>
              )}

              {formik.values.cleaningAddresses.map((addr, index) => (
                <Accordion
                  key={index}
                  defaultExpanded
                  sx={{
                    mb: 2,
                    borderRadius: 2,
                    "&:before": { display: "none" },
                  }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle1">
                      {addr.address || `Address ${index + 1}`}
                    </Typography>
                    {formik.values.cleaningAddresses.length > 1 && (
                      <IconButton
                        onClick={() => deleteAddressHandle(index)}
                        size="small"
                        sx={{ ml: "auto" }}
                        disabled={copyAddress}
                      >
                        <CloseIcon />
                      </IconButton>
                    )}
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
                      disabled={copyAddress || deletingAddress}
                    />
                  </AccordionDetails>
                </Accordion>
              ))}

              <Button
                onClick={addAddressHandler}
                disabled={copyAddress || deletingAddress}
                sx={{ mt: 1 }}
              >
                + Add Address
              </Button>
            </Box>
          </Grid>

          {/* Action Bar */}
          <ActionBar>
            <LoadingButton
              variant="contained"
              color="primary"
              type="submit"
              loading={loading}
              sx={{ minWidth: 120, textTransform: "none" }}
            >
              Save
            </LoadingButton>

            {onCancel && (
              <Button
                variant="outlined"
                color="primary"
                onClick={onCancel}
                sx={{ minWidth: 120, textTransform: "none" }}
              >
                Cancel
              </Button>
            )}
          </ActionBar>
        </Grid>
      </Form>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Wrapper>
  );
};
