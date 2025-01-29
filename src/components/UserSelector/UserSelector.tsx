import { Autocomplete, TextField } from "@mui/material";
import { FC, useMemo } from "react";
import { User } from "../../services/authentication";
import { useUsers } from "../../hooks/Users/useUsers";

type UserSelectorProps = {
  value?: string | null;
  onChange?: (value: string | null) => void;
};

type AutoCompleteOption = {
  label: string;
  value: string;
};

const userToOption = (user: User): AutoCompleteOption => {
  return {
    label: user.name ? user.name : user.email,
    value: user.id,
  };
};

export const UserSelector: FC<UserSelectorProps> = ({ value, onChange }) => {
  const { users, loading } = useUsers();

  const selectedOption: AutoCompleteOption | null = useMemo(() => {
    const selectedUser = users?.find((user) => user.id === value);
    return selectedUser ? userToOption(selectedUser) : null;
  }, [users, value]);

  const autocompleteOptions = useMemo(
    () => users?.map(userToOption) ?? [],
    [users]
  );

  const changeHandler = (
    _event: React.SyntheticEvent,
    option: AutoCompleteOption | null
  ) => {
    onChange?.(option?.value ?? null);
  };

  return (
    <Autocomplete
      options={autocompleteOptions}
      sx={{ width: "86%" }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Assign to"
          sx={{ p: 2, mt: 2, ml: 6 }}
          fullWidth
        />
      )}
      value={selectedOption}
      onChange={changeHandler}
      isOptionEqualToValue={(option, value) => option.value === value.value}
      disabled={loading}
    />
  );
};
