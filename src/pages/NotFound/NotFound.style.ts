import { Grid, Typography } from "@mui/material";
import { Box, styled } from "@mui/system";
import { Link } from "react-router-dom";
import styledComponents from "styled-components";
import { ReactComponent as Image } from "../../assets/illustrations_robots.svg";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";

export const BackHome = styled(Link)({
  color: "black",
});
export const Background = styled(Grid)(() => ({
  justifyContent: "center",
  flexDirection: "row",
  alignItems: "center",
  minHeight: "100vh",
  backgroundColor: "#F0F2F5",
}));
export const Description = styledComponents(Typography)({
  fontSize: "10rem",
});

export const IconSad = styled(SentimentVeryDissatisfiedIcon)({
  display: "fled",
  alignItems: "center",
  width: "21rem",
  fontSize: "5rem",
});
export const NotFoundImage = styledComponents(Image)({
  width: "20rem",
});
export const Row = styled(Grid)({
  flexDirection: "row",
  alignItems: "center",
});
export const Title = styledComponents(Typography)({
  display: "flex",
  alignItems: "center",
  width: "21rem",
  fontSize: "5rem",
  fontFfamily: "ProximaNova",
  fontWeight: "bold",
  fontStyle: "normal",
});

export const Wrapper = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
});
