import { ChangeEventHandler, FC, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormHelperText,
  Stack,
  Typography,
} from "@mui/material";

import { useFileUrl } from "../../hooks/Invoices/useFileUrl";
import { uploadFile } from "../../services/files";

type LogoImageInputProps = {
  label?: string;
  error?: boolean;
  helperText?: string;
  name?: string;
  value?: string;
  onChange?: (event: {
    target: {
      value: string;
      name?: string;
    };
  }) => void;
};

export const LogoImageInput: FC<LogoImageInputProps> = ({
  label = "Logo",
  error = false,
  helperText,
  name,
  value,
  onChange,
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(false);

  const changeHandler: ChangeEventHandler<HTMLInputElement> = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setUploading(true);
      setUploadError(false);

      const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
      const path = `uploads/settings/invoice/logo-${Date.now()}-${safeFileName}`;

      const uploadedPath = await uploadFile(file, path);

      onChange?.({
        target: {
          name,
          value: uploadedPath,
        },
      });
    } catch {
      setUploadError(true);
    } finally {
      setUploading(false);

      // Permite volver a seleccionar el mismo archivo.
      event.target.value = "";
    }
  };

  return (
    <Stack spacing={1} alignItems="flex-start">
      <Typography
        component="label"
        variant="body2"
        color={error ? "error" : "text.secondary"}
      >
        {label}
      </Typography>

      <Button variant="outlined" component="label" disabled={uploading}>
        {uploading ? "Uploading..." : "Select logo"}

        <input
          hidden
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={changeHandler}
        />
      </Button>

      {helperText && (
        <FormHelperText error={error}>{helperText}</FormHelperText>
      )}

      {uploadError && (
        <Alert severity="error">Could not upload the logo.</Alert>
      )}

      <LogoImagePreview s3Key={value} />
    </Stack>
  );
};

type LogoImagePreviewProps = {
  s3Key?: string;
};

const LogoImagePreview: FC<LogoImagePreviewProps> = ({ s3Key }) => {
  const {
    fileUrl: previewUrl,
    loading: loadingPreview,
    error: errorPreview,
  } = useFileUrl(s3Key);

  if (!s3Key) {
    return null;
  }

  if (loadingPreview) {
    return <CircularProgress size={24} />;
  }

  if (errorPreview || !previewUrl) {
    return <Alert severity="error">Could not load image preview.</Alert>;
  }

  return (
    <Box
      component="img"
      src={previewUrl}
      alt="Invoice logo preview"
      sx={{
        display: "block",
        mt: 1,
        width: "100%",
        maxWidth: 180,
        height: 90,
        objectFit: "contain",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1,
        p: 1,
      }}
    />
  );
};
