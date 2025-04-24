import { Button } from "@mui/material";
import { FC } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { VisuallyHiddenInput } from "./UploadFileButton.style";

type UploadFileButtonProps = {
  onChange: (file: File) => void;
  label?: string;
};

export const UploadFileButton: FC<UploadFileButtonProps> = ({
  onChange,
  label,
}) => {
  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
    }
  };

  return (
    <Button
      component="label"
      role={undefined}
      variant="contained"
      tabIndex={-1}
      startIcon={<CloudUploadIcon />}
    >
      {label ?? "Upload files"}
      <VisuallyHiddenInput type="file" onChange={changeHandler} />
    </Button>
  );
};
