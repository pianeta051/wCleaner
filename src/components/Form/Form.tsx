import { FC, ReactNode } from "react";
import { StyledForm } from "./Form.style";

type FormProps = {
  children?: ReactNode;
  onSubmit?: () => void;
};

export const Form: FC<FormProps> = ({ children, onSubmit }) => {
  const submitHandler: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    if (onSubmit) {
      onSubmit();
    }
  };

  return <StyledForm onSubmit={submitHandler}>{children}</StyledForm>;
};
