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

type NotFoundProps = {
  "data-testid"?: string;
};

export const NotFound: FC<NotFoundProps> = ({ "data-testid": testId }) => (
  <Background data-testid={testId}>
    <Wrapper>
      <Container maxWidth="md">
        <Row container spacing={2}>
          <Grid xs={6} paddingRight="20px" item>
            <Title variant="h1">404</Title>
            <Description variant="h4">The page doesn&apos;t exist.</Description>
            <IconSad />

            <BackHome to={"/log-in"}>
              <Button variant="contained">Back Home</Button>
            </BackHome>
          </Grid>
          <Grid xs={6} item>
            <NotFoundImage />
          </Grid>
        </Row>
      </Container>
    </Wrapper>
  </Background>
);
