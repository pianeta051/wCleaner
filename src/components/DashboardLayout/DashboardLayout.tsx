import { Container } from "@mui/material";
import { FC } from "react";
import { Outlet } from "react-router-dom";
import { TopBar } from "../TopBar/TopBar";
import { CustomContainer, Wrapper } from "./DashboardLayout.style";

export const DashboardLayout: FC = () => (
  <CustomContainer>
    <TopBar />
    <Wrapper>
      <Outlet />
    </Wrapper>
  </CustomContainer>
);
