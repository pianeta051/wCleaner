import { FC, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Grid,
  Paper,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { InvoiceSettings } from "../../../../types/types";
import { useInvoiceSettings } from "../../../../hooks/Invoices/useInvoiceSettings";
import { useFormik } from "formik";
import * as yup from "yup";
import { useUpdateInvoiceSettings } from "../../../../hooks/Invoices/useUpdateInvoiceSettings";

import { LogoImageInput } from "../../../../components/LogoImageInput/LogoImageInput";

type InvoiceSettingsFormValues = Omit<
  InvoiceSettings,
  "companyAddressLines"
> & {
  companyAddressLines: string;
};

const INITIAL_VALUES: InvoiceSettingsFormValues = {
  companyName: "",
  logoUrl: "",
  companyAddressLines: "",
  companyPhone: "",
  companyEmail: "",
  companyWebsite: "",
  bankDetails: "",
  paymentInfo: "",
  footerNotes: "",
};

const validationSchema = yup.object<InvoiceSettingsFormValues>({
  companyName: yup.string(),
  logoUrl: yup.string(),
  companyAddressLines: yup.string(),
  companyPhone: yup.string(),
  companyEmail: yup.string().email("Invalid email"),
  companyWebsite: yup.string(),
  bankDetails: yup.string(),
  paymentInfo: yup.string(),
  footerNotes: yup.string(),
});

const settingsToFormValues = (
  settings: InvoiceSettings
): InvoiceSettingsFormValues => ({
  ...settings,
  companyAddressLines: settings.companyAddressLines.join("\n"),
});

const formValuesToSettings = (
  formValues: InvoiceSettingsFormValues
): InvoiceSettings => ({
  ...formValues,
  companyAddressLines: formValues.companyAddressLines
    .split("\n")
    .map((address) => address.trim())
    .filter(Boolean),
});

export const InvoiceSettingsPage: FC = () => {
  const [saved, setSaved] = useState(false);

  const { settings, loading, error: loadError } = useInvoiceSettings();
  const {
    updateInvoiceSettings,
    loading: saving,
    error: saveError,
  } = useUpdateInvoiceSettings();

  const saveHandler = async (formValues: InvoiceSettingsFormValues) => {
    try {
      setSaved(false);
      const settings = formValuesToSettings(formValues);
      await updateInvoiceSettings(settings);
      setSaved(true);
    } catch (e) {
      //The hook takes care of the error handling
    }
  };

  const formik = useFormik<InvoiceSettingsFormValues>({
    initialValues: settings ? settingsToFormValues(settings) : INITIAL_VALUES,
    validationSchema,
    enableReinitialize: true,
    onSubmit: saveHandler,
  });

  if (loading) {
    return (
      <>
        <Toolbar />
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      </>
    );
  }

  const error = loadError ?? saveError;
  return (
    <>
      <Toolbar />

      <Box
        sx={{ maxWidth: 900, mx: "auto", p: 3 }}
        component="form"
        onSubmit={formik.handleSubmit}
      >
        <Typography variant="h4" fontWeight={800} gutterBottom>
          Invoice Settings
        </Typography>

        <Typography color="text.secondary" mb={3}>
          Configure company details, logo and invoice footer information.
        </Typography>

        {saved && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Invoice settings saved.
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Could not save invoice settings.
          </Alert>
        )}

        <Paper sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Company name"
                value={formik.values.companyName}
                onChange={formik.handleChange}
                name="companyName"
                fullWidth
                error={
                  !!(formik.touched.companyName && formik.errors.companyName)
                }
                helperText={
                  formik.touched.companyName
                    ? (formik.errors.companyName as string)
                    : ""
                }
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <LogoImageInput
                label="Logo"
                name="logoUrl"
                value={formik.values.logoUrl}
                onChange={formik.handleChange}
                error={!!(formik.touched.logoUrl && formik.errors.logoUrl)}
                helperText={
                  formik.touched.logoUrl
                    ? (formik.errors.logoUrl as string)
                    : ""
                }
              />
            </Grid>

            <Grid size={12}>
              <TextField
                label="Company address"
                helperText="One line per address line"
                value={formik.values.companyAddressLines}
                onChange={formik.handleChange}
                name="companyAddressLines"
                fullWidth
                multiline
                minRows={3}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Company phone"
                value={formik.values.companyPhone}
                onChange={formik.handleChange}
                name="companyPhone"
                fullWidth
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Company email"
                value={formik.values.companyEmail}
                onChange={formik.handleChange}
                name="companyEmail"
                fullWidth
                error={
                  !!(formik.touched.companyEmail && formik.errors.companyEmail)
                }
                helperText={
                  formik.touched.companyEmail
                    ? (formik.errors.companyEmail as string)
                    : ""
                }
              />
            </Grid>

            <Grid size={12}>
              <TextField
                label="Website"
                value={formik.values.companyWebsite}
                onChange={formik.handleChange}
                name="companyWebsite"
                fullWidth
              />
            </Grid>

            <Grid size={12}>
              <TextField
                label="Bank details footer"
                value={formik.values.bankDetails}
                onChange={formik.handleChange}
                name="bankDetails"
                fullWidth
                multiline
                minRows={2}
              />
            </Grid>

            <Grid size={12}>
              <TextField
                label="Payment information footer"
                value={formik.values.paymentInfo}
                onChange={formik.handleChange}
                name="paymentInfo"
                fullWidth
                multiline
                minRows={2}
              />
            </Grid>

            <Grid size={12}>
              <TextField
                label="Additional footer notes"
                value={formik.values.footerNotes}
                onChange={formik.handleChange}
                name="footerNotes"
                fullWidth
                multiline
                minRows={2}
              />
            </Grid>

            <Grid size={12}>
              <Box display="flex" justifyContent="flex-end">
                <Button variant="contained" disabled={saving} type="submit">
                  {saving ? "Saving..." : "Save settings"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </>
  );
};
