import { ChangeEventHandler, FC, useState } from "react";
import { useFileUrl } from "../../hooks/Invoices/useFileUrl";
import { Alert, Box, Button, CircularProgress } from "@mui/material";
import { uploadFile } from "../../services/files";

type LogoImageInputProps = {
  label?: string;
  error?: boolean;
  helperText?: string;
  name?: string;
  value?: string;
  // target.value debe tener la key, que es lo que guardamos
  onChange?: (event: { target: { value: string; name?: string } }) => void;
};

export const LogoImageInput: FC<LogoImageInputProps> = ({
  label,
  error,
  helperText,
  name,
  value,
  onChange,
}) => {
  const [uploading, setUploading] = useState(false);

  const changeHandler: ChangeEventHandler<HTMLInputElement> = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;
    setUploading(true);

    const path = `uploads/settings/invoice/logo-${Date.now()}-${file.name}`;
    uploadFile(file, path)
      .then((uploadedPath: string) => {
        onChange?.({ target: { value: uploadedPath, name } });
      })
      .finally(() => setUploading(false));
  };

  return (
    <>
      <Button
        variant="outlined"
        component="label"
        disabled={uploading}
        loading={uploading}
      >
        {uploading ? "Uploading..." : "Select logo"}
        <input
          hidden
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={changeHandler}
        />
      </Button>
      <LogoImagePreview s3Key={value} />
    </>
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
    return <CircularProgress />;
  }

  if (errorPreview) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Could not load image preview.
      </Alert>
    );
  }

  return (
    <Box
      component="img"
      src={previewUrl}
      alt="Invoice logo preview"
      sx={{
        display: "block",
        mt: 2,
        maxWidth: 180,
        maxHeight: 90,
        objectFit: "contain",
        border: "1px solid #ddd",
        borderRadius: 1,
        p: 1,
      }}
    />
  );
};
