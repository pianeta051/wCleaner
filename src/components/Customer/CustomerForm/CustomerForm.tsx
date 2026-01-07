import { FC, useEffect, useMemo, useState } from "react";
import {
  AlertColor,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControlLabel,
  FormGroup,
  Grid,
  Snackbar,
  Typography,
  Alert,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";

import {
  ActionBar,
  Field,
  Wrapper,
  AddressAccordion,
  AddressAccordionSummary,
  AddressAccordionDetails,
  AddressSummaryRow,
  AddressSummaryTitle,
  AddressDeleteButton,
} from "./CustomerForm.style";

import { LoadingButton } from "@mui/lab";
import { useFormik } from "formik";
import * as yup from "yup";

import {
  CustomerAddressForm,
  CustomerAddressFormValues,
} from "../CustomerAddressForm/CustomerAddressForm";

import { useDeleteCustomerAddress } from "../../../hooks/Customers/addresses/useDeleteCustomerAddress";
import { AddressModal } from "../../AddressModal/AddressModal";

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

type CustomerFormProps = {
  onSubmit: (customer: CustomerFormValues) => void;
  onCancel?: () => void;
  initialValues?: CustomerFormValues;
  loading?: boolean;
  layout?: "vertical" | "horizontal";
  enableCopyAddress?: boolean;
  customerId?: string;
  onReload?: () => void;

  showActions?: boolean;
  formId?: string;
};

type CustomerAddressWithId = CustomerAddressFormValues & {
  id?: string;
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

const labels: { [x in keyof CustomerFormValues]: string } = {
  email: "Email",
  address: "Billing address",
  name: "Full name",
  postcode: "Postcode",
  mainTelephone: "Main Telephone",
  secondTelephone: "Second Telephone",
  cleaningAddresses: "Cleaning Addresses",
};

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

export const CustomerForm: FC<CustomerFormProps> = ({
  onSubmit,
  onCancel,
  initialValues = INITIAL_VALUES,
  loading = false,
  layout = "vertical",
  enableCopyAddress = true,
  customerId,
  onReload,
  showActions = true,
  formId = "customer-form",
}) => {
  const formik = useFormik<CustomerFormValues>({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit,
  });

  const [copyAddress, setCopyAddress] = useState(enableCopyAddress);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<AlertColor>("success");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [addressSelectorOpen, setAddressSelectorOpen] = useState(false);
  const [addressIdDeleting, setAddressIdDeleting] = useState<string | null>(
    null
  );

  const {
    deleteCustomerAddress,
    loading: deletingAddress,
    error: errorDeletingAddress,
  } = useDeleteCustomerAddress(customerId);

  const requiredFields = useMemo(() => ["name", "address", "postcode"], []);
  const actionBarVariant = layout === "vertical" ? "sticky" : "inline";

  useEffect(() => {
    if (errorDeletingAddress) {
      setSnackbarMessage("Error deleting address");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  }, [errorDeletingAddress]);

  useEffect(() => {
    if (!copyAddress) return;

    const address = (formik.values.address ?? "").trim();
    const postcode = (formik.values.postcode ?? "").trim();

    if (!address && !postcode) {
      formik.setFieldValue("cleaningAddresses", []);
      return;
    }

    formik.setFieldValue("cleaningAddresses", [
      { name: "Home", address, postcode },
    ]);
  }, [formik.values.address, formik.values.postcode, copyAddress]);

  const scalarFields: (keyof CustomerFormValues)[] = [
    "name",
    "address",
    "postcode",
    "mainTelephone",
    "secondTelephone",
    "email",
  ];

  const addAddressHandler = () => {
    formik.setFieldValue("cleaningAddresses", [
      ...formik.values.cleaningAddresses,
      { name: "", address: "", postcode: "" },
    ]);
  };

  const deleteAddressHandle = async (index: number) => {
    const addressId = (
      formik.values.cleaningAddresses[index] as CustomerAddressWithId
    )?.id;

    if (!addressId) {
      const copy = [...formik.values.cleaningAddresses];
      copy.splice(index, 1);
      formik.setFieldValue("cleaningAddresses", copy);
      return;
    }

    try {
      await deleteCustomerAddress(addressId);
      setSnackbarMessage("Address deleted");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      onReload?.();
    } catch (e) {
      setAddressIdDeleting(addressId);
      setDialogOpen(true);
    }
  };

  return (
    <Wrapper container spacing={2} enableScroll={layout === "vertical"}>
      <Box
        component="form"
        id={formId}
        onSubmit={formik.handleSubmit}
        noValidate
      >
        <Grid container spacing={3} sx={{ overflowX: "hidden" }}>
          <Grid item xs={12}>
            <Typography variant="h6" fontWeight={800}>
              Customer Info
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Update the customer details.
            </Typography>
          </Grid>

          {scalarFields.map((field) => (
            <Grid item xs={12} md={6} key={field}>
              <Field
                name={field}
                label={labels[field]}
                value={formik.values[field]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required={requiredFields.includes(field)}
                error={!!(formik.touched[field] && formik.errors[field])}
                helperText={
                  formik.touched[field] ? (formik.errors[field] as string) : ""
                }
              />
            </Grid>
          ))}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" fontWeight={800} mb={1}>
              Cleaning Addresses
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage cleaning addresses.
            </Typography>

            {enableCopyAddress && (
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={copyAddress}
                      onChange={(e) => setCopyAddress(e.target.checked)}
                    />
                  }
                  label="Use billing address as cleaning address"
                />
              </FormGroup>
            )}

            {formik.values.cleaningAddresses.map((addr, index) => (
              <AddressAccordion key={index}>
                <AddressAccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <AddressSummaryRow>
                    <AddressSummaryTitle>
                      {addr.address || `Address ${index + 1}`}
                    </AddressSummaryTitle>

                    {formik.values.cleaningAddresses.length > 1 && (
                      <AddressDeleteButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteAddressHandle(index);
                        }}
                      >
                        <CloseIcon />
                      </AddressDeleteButton>
                    )}
                  </AddressSummaryRow>
                </AddressAccordionSummary>

                <AddressAccordionDetails>
                  <CustomerAddressForm
                    value={addr}
                    onChange={(v) => {
                      const copy = [...formik.values.cleaningAddresses];
                      copy[index] = v;
                      formik.setFieldValue("cleaningAddresses", copy);
                    }}
                  />
                </AddressAccordionDetails>
              </AddressAccordion>
            ))}

            <Button
              onClick={addAddressHandler}
              disabled={copyAddress || deletingAddress}
            >
              + Add Address
            </Button>
          </Grid>

          {showActions && (
            <Grid item xs={12}>
              <ActionBar variant={actionBarVariant}>
                {onCancel && (
                  <Button variant="outlined" onClick={onCancel}>
                    Cancel
                  </Button>
                )}
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={loading}
                >
                  Save
                </LoadingButton>
              </ActionBar>
            </Grid>
          )}
        </Grid>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert severity={snackbarSeverity}>{snackbarMessage}</Alert>
      </Snackbar>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Cannot delete address</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This address has pending jobs and cannot be deleted.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {customerId && addressIdDeleting && (
        <AddressModal
          open={addressSelectorOpen}
          onClose={() => setAddressSelectorOpen(false)}
          customerId={customerId}
          oldAddressId={addressIdDeleting}
          onUpdated={() => {
            onReload?.();
            setAddressSelectorOpen(false);
          }}
        />
      )}
    </Wrapper>
  );
};
