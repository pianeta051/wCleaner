import { LoadingButton } from "@mui/lab";
import { TextField, Typography } from "@mui/material";
import { FC, useState } from "react";
import { Form } from "../Form/Form";

type ProfileNameProps = {
  name?: string;
  onChange?: (name: string) => void;
  loading?: boolean;
};

export const ProfileName: FC<ProfileNameProps> = ({
  name = "",
  onChange,
  loading = false,
}) => {
  const [newName, setNewName] = useState(name);

  const submitHandler = () => {
    if (onChange) {
      onChange(newName);
    }
  };

  const changeHandler: React.ChangeEventHandler<
    HTMLTextAreaElement | HTMLInputElement
  > = (event) => {
    setNewName(event.target.value);
  };

  return (
    <>
      <Typography variant="h4">Name</Typography>
      <Form onSubmit={submitHandler}>
        <TextField
          label="Name"
          name="name"
          variant="outlined"
          value={newName}
          margin="normal"
          onChange={changeHandler}
        />
        <LoadingButton loading={loading} variant="outlined" type="submit">
          Save
        </LoadingButton>
      </Form>
    </>
  );
};
