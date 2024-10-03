import { Container } from "@mui/material";
import { FC } from "react";
import { Outlet } from "react-router-dom";
import { TopBar } from "../TopBar/TopBar";
import { Wrapper } from "./DashboardLayout.style";

export const DashboardLayout: FC = () => (
  <Container>
    <TopBar />
    <Wrapper>
      <Outlet />
    </Wrapper>
  </Container>
);
