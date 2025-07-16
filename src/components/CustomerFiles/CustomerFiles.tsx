import { Box, Grid, Skeleton, Snackbar, Typography } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { FileUploader } from "../FileUploader/FileUploader";
import { Customer } from "../../types/types";
import { getFileUrl } from "../../services/files";
import { DeleteButton, FileDisplay } from "../FileUploader/FileUploader.style";
import MuiLink from "@mui/material/Link";
import { BoxField, StyledImage } from "./CustomerFiles.style";
import DeleteIcon from "@mui/icons-material/Delete";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { useReplaceCustomerFiles } from "../../hooks/Customers/files/useReplaceCustomerFiles";
import MuiAlert from "@mui/material/Alert";
import { useDeleteFile } from "../../hooks/Files/useDeleteFile";

type CustomerFilesProps = {
  customer: Customer;
  jobId?: string;
};

const isImageFile = (url: string): boolean => {
  const match = url.match(/\/[^/]*\.(jpg|jpeg|png|gif|bmp|webp|svg)(?=\?|$)/i);
  return !!match;
};

const imageLabel = (url: string): { dateLabel: string; fileLabel: string } => {
  const urlParts = url.split("/");
  const fileName = urlParts[urlParts.length - 1];
  const [dateFile, ...labelFileParts] = fileName.split("-");
  const labelFile = labelFileParts.join("-");
  const dateLabel = new Date(+dateFile).toISOString();

  return {
    dateLabel: dateLabel,
    fileLabel: labelFile,
  };
};

export const CustomerFiles: FC<CustomerFilesProps> = ({ customer, jobId }) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [signedFileUrls, setSignedFileUrls] = useState<string[]>([]);

  const {
    replaceFiles,
    loading: replacing,
    error: errorReplacing,
  } = useReplaceCustomerFiles(customer.id, customer.slug, jobId);
  const {
    deleteFile: deleteFile,
    loading: deleting,
    error: errorDeleting,
  } = useDeleteFile();

  const addFileHandler = async (fileKeys: string[]) => {
    try {
      await replaceFiles([...(customer.fileUrls ?? []), ...fileKeys]);
    } catch (error) {
      // the hook manages the error
    }
  };

  const deleteFileHandler = async (index: number) => {
    if (!customer.fileUrls) return;
    const fileKeyToDelete = customer.fileUrls[index];
    try {
      await deleteFile(fileKeyToDelete);
      const newFiles = customer.fileUrls.filter((_url, i) => index !== i);
      await replaceFiles(newFiles);
    } catch (error) {
      // error handled by hook
    }
  };

  const error = !!errorReplacing || !!errorDeleting;

  useEffect(() => {
    if (error) {
      setSnackbarOpen(true);
    }
  }, [error]);

  useEffect(() => {
    const fetchSignedUrls = async () => {
      if (customer?.fileUrls?.length) {
        try {
          const urls = await Promise.all(
            customer.fileUrls.map((key) => getFileUrl(key))
          );
          setSignedFileUrls(urls);
        } catch (e) {
          setSignedFileUrls([]);
        }
      } else {
        setSignedFileUrls([]);
      }
    };

    if (customer) {
      fetchSignedUrls();
    }
  }, [customer?.fileUrls]);

  const uploadDirectory = `customers/${customer.id}`;

  return (
    <Grid container>
      <Grid item xs={12}>
        <FileUploader
          uploadDirectory={uploadDirectory}
          onSubmit={addFileHandler}
        />
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {replacing || deleting ? (
            <>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Skeleton variant="rectangular" width={50} height={200} />
                </Grid>
                <Grid item xs={4}>
                  <Skeleton variant="rectangular" width={50} height={200} />
                </Grid>
                <Grid item xs={4}>
                  <Skeleton variant="rectangular" width={50} height={200} />
                </Grid>
              </Grid>
            </>
          ) : (
            <Grid container spacing={2} sx={{ mt: 2 }}>
              {signedFileUrls.map((url, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <MuiLink
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    underline="none"
                    sx={{ display: "block" }}
                  >
                    <FileDisplay
                      sx={{ position: "relative", p: 1, borderRadius: 2 }}
                    >
                      {isImageFile(url) ? (
                        <StyledImage
                          src={url}
                          alt={`Uploaded file ${index + 1}`}
                        />
                      ) : (
                        <BoxField aria-label="File">
                          <InsertDriveFileIcon fontSize="large" />
                        </BoxField>
                      )}

                      <DeleteButton
                        aria-label="Delete"
                        onClick={(e) => {
                          e.preventDefault();
                          deleteFileHandler(index);
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </DeleteButton>
                    </FileDisplay>
                    {customer.fileUrls?.[index] && (
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          {imageLabel(customer.fileUrls[index]).fileLabel}
                        </Typography>
                        <Typography variant="caption" color="text.disabled">
                          Uploaded:{" "}
                          {new Date(
                            imageLabel(customer.fileUrls[index]).dateLabel
                          ).toLocaleDateString("en-GB")}
                        </Typography>
                      </Box>
                    )}
                  </MuiLink>
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>
      </Grid>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <MuiAlert
          onClose={() => setSnackbarOpen(false)}
          severity={"error"}
          sx={{ width: "100%" }}
        >
          {errorReplacing ? "File upload failed" : "File deletion failed"}
        </MuiAlert>
      </Snackbar>
    </Grid>
  );
};
