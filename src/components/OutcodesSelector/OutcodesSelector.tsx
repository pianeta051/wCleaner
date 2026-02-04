import { Box, TextField } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import React, { FC, useMemo } from "react";
import { AutocompleteWrap } from "./OutcodesSelector.style";

type OutcodesSelectorProps = {
  outcodes: string[];
  selected: string[];
  onChange: (value: string[]) => void;
};

export const OutcodesSelector: FC<OutcodesSelectorProps> = ({
  outcodes,
  selected,
  onChange,
}) => {
  const sortedOutcodes = useMemo(() => {
    return [...outcodes].sort((a, b) => a.localeCompare(b));
  }, [outcodes]);

  const autocompleteChangeHandler = (
    _event: React.SyntheticEvent,
    newValue: string[]
  ) => {
    onChange(newValue);
  };

  return (
    <AutocompleteWrap>
      <Autocomplete
        multiple
        options={sortedOutcodes}
        value={selected}
        onChange={autocompleteChangeHandler}
        renderInput={(params) => (
          <Box display="flex" flexDirection="column" gap={1}>
            <TextField
              {...params}
              label="Search UK Postcode"
              variant="outlined"
            />
          </Box>
        )}
      />
    </AutocompleteWrap>
  );
};
