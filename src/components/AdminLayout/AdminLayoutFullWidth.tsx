import { Container } from "@mui/material";
import { FC } from "react";
import { Outlet } from "react-router-dom";
import { TopBar } from "../TopBar/TopBar";
import { Wrapper } from "./AdminLayout.style";

export const AdminLayoutFullWidth: FC = () => (
  <>
    <Container>
      <TopBar />
    </Container>
    <Wrapper>
      <Outlet />
    </Wrapper>
  </>
);
