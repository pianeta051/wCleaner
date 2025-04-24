import { Box } from "@mui/material";
import { styled } from "@mui/system";
import ClearIcon from "@mui/icons-material/Clear";
export const ImageWrapper = styled(Box)({
  position: "relative",
  width: "100%",
  height: 120,
  borderRadius: 8,
  overflow: "hidden",
  border: "1px solid #ccc",
  "&:hover img": {
    opacity: 0.7,
  },
  "&:hover button": {
    display: "flex",
  },
});

export const UploadedImage = styled("img")({
  width: "100%",
  height: "100%",
  objectFit: "cover",
  transition: "opacity 0.3s ease",
});

export const FileDisplay = styled(Box)<{ file?: string }>(({ file }) => ({
  position: "relative",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "80%",
  height: "200px",
  backgroundImage: file ? `url(${file})` : "none",
  backgroundSize: "contain",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  "&:hover": {
    // Add black transparent overlay on hover
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: 1,
    },
    "& > *": {
      display: "flex",
    },
  },
  "& > *": {
    zIndex: 2,
    display: "none",
  },
}));
export const DeleteButton = styled(ClearIcon)({
  position: "absolute",
  top: "10px",
  right: "10px",
  cursor: "pointer",
  backgroundColor: "rgba(255, 255, 255, 0.7)",
  "&:hover": {
    backgroundColor: "rgba(255, 0, 0, 0.8)",
    color: "white",
  },
});
