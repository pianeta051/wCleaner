import { FC, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

import { useUploadFile } from "../../hooks/Files/useUploadFile";
import { ErrorMessage } from "../ErrorMessage/ErrorMessage";
import { FileInput } from "../FileInput/FileInput";

type FileUploaderProps = {
  uploadDirectory: string;
  onSubmit: (fileKeys: string[]) => void;
};

export const FileUploader: FC<FileUploaderProps> = ({
  uploadDirectory,
  onSubmit,
}) => {
  const [files, setFiles] = useState<File[]>([]);

  const { uploadFile, loading, error } = useUploadFile();

  const handleUpload = async () => {
    const newKeys: string[] = [];

    for (const file of files) {
      const key = `uploads/customers/${uploadDirectory}/${Date.now()}-${
        file.name
      }`;
      await uploadFile({ file, path: key });

      newKeys.push(key);
    }
    onSubmit(newKeys);

    setFiles([]);
  };

  const selectFileHandler = (newFiles: File[]) => {
    setFiles([...newFiles]);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Upload Files
      </Typography>

      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12}>
          <FileInput value={files} onChange={selectFileHandler} />
        </Grid>
        <Grid item>
          <LoadingButton
            loading={loading}
            variant="contained"
            onClick={handleUpload}
            disabled={files.length === 0}
          >
            Upload
          </LoadingButton>
        </Grid>

        {error && (
          <Grid item xs={12}>
            <ErrorMessage code={error} />
          </Grid>
        )}
      </Grid>
    </Box>
  );
};
