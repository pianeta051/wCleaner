import { FC } from "react";
import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";

import { Form } from "../Form/Form";
import { useAuth } from "../../context/AuthContext";
import { Field } from "./NoteForm.style";

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
  const { isInGroup } = useAuth();
  const isAdmin = isInGroup("Admin");

  const formik = useFormik<NoteFormValues>({
    initialValues: defaultValues ?? INITIAL_VALUES,
    onSubmit,
    validationSchema,
    enableReinitialize: true,
  });

  return (
    <Form onSubmit={formik.handleSubmit}>
      <Grid container spacing={2} sx={{ px: { xs: 2, md: 4 } }}>
        <Grid size={12}>
          <Field
            label="Title"
            name="title"
            onChange={formik.handleChange}
            value={formik.values.title}
            onBlur={formik.handleBlur}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
            size="small"
          />
        </Grid>

        <Grid size={12}>
          <TextField
            label="Content"
            name="content"
            variant="outlined"
            onChange={formik.handleChange}
            value={formik.values.content}
            onBlur={formik.handleBlur}
            multiline
            minRows={5}
            fullWidth
            error={formik.touched.content && Boolean(formik.errors.content)}
            helperText={formik.touched.content && formik.errors.content}
            sx={{
              "& .MuiInputBase-root": {
                borderRadius: 2,
              },
            }}
          />
        </Grid>

        {isAdmin && (
          <Grid size={12}>
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

        <Grid
          textAlign={{ xs: "center", md: "right" }}
          size={{
            xs: 12,
            md: 6,
          }}
        >
          <Button
            variant="contained"
            type="submit"
            loading={loading}
            disabled={loading}
            sx={{ width: { xs: "100%", md: "60%" }, textTransform: "none" }}
          >
            Save
          </Button>
        </Grid>

        <Grid
          textAlign={{ xs: "center", md: "left" }}
          size={{
            xs: 12,
            md: 6,
          }}
        >
          {onCancel && (
            <Button
              variant="outlined"
              onClick={onCancel}
              disabled={loading}
              sx={{ width: { xs: "100%", md: "60%" }, textTransform: "none" }}
            >
              Cancel
            </Button>
          )}
        </Grid>
      </Grid>
    </Form>
  );
};
