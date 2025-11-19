import styledComponents from "styled-components";
import { styled } from "@mui/material/styles";
import { Avatar } from "@mui/material";

export const CalendarWrapper = styledComponents.div({
  height: "100vh",
  width: "100%",
  marginTop: "50px",
});

type ChecWrapperProps = {
  isMonthlyView: boolean;
};

export const CheckWrapper = styledComponents.span<ChecWrapperProps>(
  ({ isMonthlyView }) => {
    if (isMonthlyView) {
      return {};
    }
    return {
      position: "absolute",
      top: "2px",
      right: "4px",
    };
  }
);

export const CheckCircle = styled(Avatar)(({ theme }) => ({
  backgroundColor: theme.palette.success.main,
  color: theme.palette.success.contrastText,
  height: "14px",
  width: "14px",
}));
