import { Typography } from "@mui/material";
import { Box, styled } from "@mui/system";
import { Link } from "react-router-dom";
import styledComponents from "styled-components";
import { ReactComponent as Image } from "../../assets/illustrations_robots.svg";

export const BackHome = styled(Link)({
  color: "black",
});

export const NotFoundImage = styledComponents(Image)({
  width: "20rem",
});

export const Title = styledComponents(Typography)({
  display: "flex",
  alignItems: "center",
  width: "21rem",
  fontSize: "5rem",
  fontFamily: "ProximaNova",
  fontWeight: "bold",
  fontStyle: "normal",
});

export const Wrapper = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "50vh",
});
