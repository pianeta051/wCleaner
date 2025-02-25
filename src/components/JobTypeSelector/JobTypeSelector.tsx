import { Autocomplete, TextField } from "@mui/material";
import { FC, useMemo } from "react";
import { JobType } from "../../types/types";
import { useJobTypes } from "../../hooks/Jobs/useJobTypes";

type JobTypeSelectorProps = {
  value?: string | null;
  onChange?: (value: string | null) => void;
};

type AutoCompleteOption = {
  label: string;
  value: string;
};

const jobTypeToOption = (jobType: JobType): AutoCompleteOption => {
  return {
    label: jobType.name,
    value: jobType.id,
  };
};

export const JobTypeSelector: FC<JobTypeSelectorProps> = ({
  value,
  onChange,
}) => {
  const { jobTypes, loading } = useJobTypes();

  const selectedOption: AutoCompleteOption | null = useMemo(() => {
    const selectedJobType = jobTypes?.find((jobType) => jobType.id === value);
    return selectedJobType ? jobTypeToOption(selectedJobType) : null;
  }, [jobTypes, value]);

  const autocompleteOptions = useMemo(
    () => jobTypes?.map(jobTypeToOption) ?? [],
    [jobTypes]
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
          label="Job Type"
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
