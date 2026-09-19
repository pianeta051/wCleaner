import SearchIcon from "@mui/icons-material/Search";

import { FC, useState } from "react";

import { Form } from "../Form/Form";

import {
  SearchBox,
  SearchControl,
  SearchInput,
  SearchAdornment,
  SearchButton,
} from "./SearchBar.style";

type SearchBarProps = {
  onSearch: (searchTerm: string) => void;
  initialValue?: string;
};

export const SearchBar: FC<SearchBarProps> = ({
  onSearch,
  initialValue = "",
}) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = () => {
    onSearch(searchTerm.trim());
  };

  return (
    <Form onSubmit={handleSubmit}>
      <SearchBox>
        <SearchControl variant="outlined">
          <SearchInput
            id="search-customer"
            type="text"
            value={searchTerm}
            onChange={handleChange}
            onBlur={handleSubmit}
            placeholder="Search customer"
            startAdornment={
              <SearchAdornment position="start">
                <SearchButton
                  type="submit"
                  aria-label="Search customer"
                  size="small"
                  disableRipple
                >
                  <SearchIcon />
                </SearchButton>
              </SearchAdornment>
            }
          />
        </SearchControl>
      </SearchBox>
    </Form>
  );
};
