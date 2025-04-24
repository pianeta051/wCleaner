import { Autocomplete, TextField, Box } from "@mui/material";
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

const jobTypeToOption = (jobType: JobType): AutoCompleteOption => ({
  label: jobType.name,
  value: jobType.id,
});

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
    <Box sx={{ mt: 1, width: "100%" }}>
      <Autocomplete
        options={autocompleteOptions}
        value={selectedOption}
        onChange={changeHandler}
        disabled={loading}
        fullWidth
        isOptionEqualToValue={(option, value) => option.value === value.value}
        renderInput={(params) => (
          <TextField {...params} name="jobType" label="Job Type" fullWidth />
        )}
      />
    </Box>
  );
};
