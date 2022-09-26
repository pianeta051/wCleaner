import { FC, ReactNode } from "react";
import {
  Background,
  FormPaper,
  Subtitle,
  Title,
  Wrapper,
} from "./Layout.style";
import { Grid } from "@mui/material";

type LayoutProps = {
  children?: ReactNode;
  title: string;
  subtitle?: string;
};

export const Layout: FC<LayoutProps> = ({ children, title, subtitle }) => {
  return (
    <Background container>
      <Wrapper container>
        <Grid item xs={12}>
          <Title variant="h4">{title}</Title>
        </Grid>
        <Grid item xs={12}>
          <Subtitle variant="body2">{subtitle}</Subtitle>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FormPaper>{children}</FormPaper>
        </Grid>
      </Wrapper>
    </Background>
  );
};
