import { FC } from "react";
import { Outlet } from "react-router-dom";
import { Background, Wrapper } from "./AuthenticationLayout.style";

export const AuthenticationLayout: FC = () => (
  <Background>
    <Wrapper elevation={1}>
      <Outlet />
    </Wrapper>
  </Background>
);
