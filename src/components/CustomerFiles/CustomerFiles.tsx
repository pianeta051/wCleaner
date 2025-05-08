import { Box, Grid, Typography } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { FileUploader } from "../FileUploader/FileUploader";
import { Customer } from "../../types/types";
import { getFileUrl } from "../../services/files";
import { DeleteButton, FileDisplay } from "../FileUploader/FileUploader.style";
import MuiLink from "@mui/material/Link";
import { BoxField, StyledImage } from "./CustomerFiles.style";
import DeleteIcon from "@mui/icons-material/Delete";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

type CustomerFilesProps = {
  customer: Customer;
  onEditUrls: (urls: string[]) => void;
  onDeleteFile: (index: number) => void;
};

const isImageFile = (url: string): boolean => {
  const match = url.match(/\/[^\/]*\.(jpg|jpeg|png|gif|bmp|webp|svg)(?=\?|$)/i);
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

export const CustomerFiles: FC<CustomerFilesProps> = ({
  customer,
  onEditUrls,
  onDeleteFile,
}) => {
  const [signedFileUrls, setSignedFileUrls] = useState<string[]>([]);
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

  return (
    <Grid item xs={12} md={4}>
      <FileUploader
        customerId={customer.id}
        onSubmit={(fileKeys) => {
          onEditUrls([...(customer.fileUrls ?? []), ...fileKeys]);
        }}
      />
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
              <FileDisplay sx={{ position: "relative", p: 1, borderRadius: 2 }}>
                {isImageFile(url) ? (
                  <StyledImage src={url} alt={`Uploaded file ${index + 1}`} />
                ) : (
                  <BoxField aria-label="File">
                    <InsertDriveFileIcon fontSize="large" />
                  </BoxField>
                )}

                <DeleteButton
                  aria-label="Delete"
                  onClick={(e) => {
                    e.preventDefault();
                    onDeleteFile(index);
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
    </Grid>
  );
};
