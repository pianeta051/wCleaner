import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  TextField,
} from "@mui/material";
import Autocomplete from "@mui/lab/Autocomplete";
import { FC, useMemo } from "react";
import {
  AutocompleteWrap,
  CheckBoxWrap,
  OutcodeBox,
} from "./OutcodesSelector.style";

type OutcodesSelectorProps = {
  outcodes: string[];
  selected: string[];
  onChange: (value: string[]) => void;
  onFilter?: (outcodes: string[]) => void;
};

export const OutcodesSelector: FC<OutcodesSelectorProps> = ({
  outcodes,
  selected,
  onChange,
  onFilter,
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

  const checkboxChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>,
    outcode: string
  ) => {
    const updated = event.target.checked
      ? [...selected, outcode]
      : selected.filter((item) => item !== outcode);
    onChange(updated);
  };
  const goButtonhandler = () => {
    onFilter?.(selected);
  };

  return (
    <>
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
              <Button
                variant="contained"
                size="small"
                onClick={goButtonhandler}
                sx={{ alignSelf: "flex-start" }}
              >
                Go
              </Button>
            </Box>
          )}
        />
      </AutocompleteWrap>

      <FormGroup>
        <CheckBoxWrap>
          {sortedOutcodes.map((outcode) => {
            const isChecked = selected.includes(outcode);
            return (
              <OutcodeBox key={outcode}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isChecked}
                      onChange={(event) =>
                        checkboxChangeHandler(event, outcode)
                      }
                    />
                  }
                  label={outcode}
                />
              </OutcodeBox>
            );
          })}
        </CheckBoxWrap>
      </FormGroup>
    </>
  );
};
