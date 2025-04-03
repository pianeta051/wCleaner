import {
  FormControl,
  InputAdornment,
  OutlinedInput,
  IconButton,
  InputLabel,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { FC, useState } from "react";
import { Form } from "../Form/Form";
import { SearchBox } from "./SearchBar.style";

type SearchBarProps = {
  onSearch: (searchTerm: string) => void;
  initialValue?: string;
};

export const SearchBar: FC<SearchBarProps> = ({
  onSearch,
  initialValue = "",
}) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) =>
    setSearchTerm(event.target.value);

  const handleSubmit = () => {
    onSearch(searchTerm);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <SearchBox>
        <FormControl
          variant="outlined"
          size="small"
          sx={{ width: "100%", maxWidth: 400 }}
        >
          <InputLabel htmlFor="search-customer">Search customer</InputLabel>
          <OutlinedInput
            id="search-customer"
            type="text"
            value={searchTerm}
            onChange={handleChange}
            label="Search customer"
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  edge="end"
                  type="submit"
                  aria-label="search"
                  size="small"
                >
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
      </SearchBox>
    </Form>
  );
};
