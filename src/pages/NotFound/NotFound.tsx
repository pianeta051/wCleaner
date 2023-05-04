import { Button, Container } from "@mui/material";
import { FC } from "react";
import { BackHome, NotFoundImage, Title, Wrapper } from "./NotFound.style";

export const NotFound: FC = () => (
  <Wrapper>
    <Container fixed>
      <Title variant="h1">404 Page Not Found</Title>
      <NotFoundImage />
      <BackHome to={"/log-in"}>
        <Button variant="contained">Back Home</Button>
      </BackHome>
    </Container>
  </Wrapper>
);
