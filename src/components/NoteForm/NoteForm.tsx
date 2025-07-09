import { LoadingButton } from "@mui/lab";
import {
  Button,
  Grid,
  TextField,
  Box,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useFormik } from "formik";
import { FC } from "react";
import * as yup from "yup";
import { Form } from "../Form/Form";
import { useAuth } from "../../context/AuthContext";

export type NoteFormValues = {
  title: string;
  content: string;
  isFavourite: boolean;
};

const validationSchema = yup.object<NoteFormValues>({
  title: yup.string().required("Title is required"),
  content: yup.string().required("Content is required"),
  isFavourite: yup.boolean(),
});

const INITIAL_VALUES: NoteFormValues = {
  title: "",
  content: "",
  isFavourite: false,
};

type NoteFormProps = {
  onSubmit: (note: NoteFormValues) => void;
  onCancel?: () => void;
  defaultValues?: NoteFormValues;
  loading?: boolean;
};

export const NoteForm: FC<NoteFormProps> = ({
  onSubmit,
  onCancel,
  defaultValues,
  loading = false,
}) => {
  const defaultValuesForm = defaultValues ?? INITIAL_VALUES;
  const { isInGroup } = useAuth();
  const isAdmin = isInGroup("Admin");

  const formik = useFormik<NoteFormValues>({
    initialValues: defaultValuesForm,
    onSubmit,
    validationSchema,
  });

  return (
    <Form onSubmit={formik.handleSubmit}>
      <Grid
        container
        spacing={3}
        sx={{ px: { xs: 2, md: 4 } }}
        justifyContent="center"
      >
        <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
          <TextField
            label="Title"
            name="title"
            variant="outlined"
            margin="normal"
            onChange={formik.handleChange}
            value={formik.values.title}
            onBlur={formik.handleBlur}
            sx={{ width: "90%" }}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
          />
        </Grid>

        <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
          <TextField
            label="Content"
            name="content"
            variant="outlined"
            margin="normal"
            onChange={formik.handleChange}
            value={formik.values.content}
            onBlur={formik.handleBlur}
            multiline
            rows={4}
            sx={{ width: "90%" }}
            error={formik.touched.content && Boolean(formik.errors.content)}
            helperText={formik.touched.content && formik.errors.content}
          />
        </Grid>
        {isAdmin && (
          <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
            <FormControlLabel
              control={
                <Checkbox
                  name="isFavourite"
                  onChange={formik.handleChange}
                  checked={formik.values.isFavourite}
                />
              }
              label="Add to favourites"
            />
          </Grid>
        )}

        <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <LoadingButton
              variant="contained"
              color="primary"
              type="submit"
              size="small"
              sx={{ textTransform: "none" }}
              loading={loading}
            >
              Save
            </LoadingButton>

            {onCancel && (
              <Button
                variant="outlined"
                color="primary"
                onClick={onCancel}
                size="small"
                sx={{ textTransform: "none" }}
              >
                Cancel
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>
    </Form>
  );
};
