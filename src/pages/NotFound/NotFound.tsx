import { Button, Container, Grid } from "@mui/material";
import { FC } from "react";
import {
  BackHome,
  NotFoundImage,
  Row,
  Title,
  Wrapper,
  Description,
  IconSad,
  Background,
} from "./NotFound.style";

export const NotFound: FC = () => (
  <Background>
    <Wrapper>
      <Container maxWidth="md">
        <Row container spacing={2}>
          <Grid xs={6} paddingRight="20px">
            <Title variant="h1">404</Title>
            <Description variant="h4">The page doesn’t exist.</Description>
            <IconSad />

            <BackHome to={"/log-in"}>
              <Button variant="contained">Back Home</Button>
            </BackHome>
          </Grid>
          <Grid xs={6}>
            <NotFoundImage />
          </Grid>
        </Row>
      </Container>
    </Wrapper>
  </Background>
);
