import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { FC, useState } from "react";
import { Form } from "../Form/Form";

import SearchIcon from "@mui/icons-material/Search";

type SearchBarProps = {
  onSearch: (searchTerm: string) => void;
  initialValue?: string;
};

export const SearchBar: FC<SearchBarProps> = ({
  onSearch,
  initialValue = "",
}) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);

  const changeHandler: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (event) => setSearchTerm(event.target.value);

  const submitHandler = () => {
    onSearch(searchTerm);
  };

  return (
    <Form onSubmit={submitHandler}>
      <FormControl
        variant="outlined"
        margin="normal"
        sx={{
          p: 5,
          minWidth: 70,
        }}
      >
        <OutlinedInput
          id="outlined-adornment-password"
          type="text"
          endAdornment={
            <InputAdornment position="start">
              <InputLabel htmlFor="outlined-adornment-password">
                Search
              </InputLabel>
              <IconButton aria-label="search" type="submit" edge="end">
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          }
          value={searchTerm}
          onChange={changeHandler}
        />
      </FormControl>
    </Form>
  );
};
