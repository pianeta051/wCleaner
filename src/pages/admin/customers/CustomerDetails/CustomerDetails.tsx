import { FC, useEffect, useMemo, useState } from "react";
import {
  Alert,
  CircularProgress,
  Divider,
  Grid,
  Snackbar,
  Typography,
  Toolbar,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";

import { useParams } from "react-router-dom";

import {
  Wrapper,
  SubHeaderBar,
  SubHeaderInner,
  ContentPaper,
  BreadcrumbContainer,
  StyledBreadcrumbs,
  BreadcrumbLink,
  CurrentPage,
  SectionNav,
  SectionNavButton,
  MobileSectionSelect,
} from "./CustomerDetails.style";

import { NotFound } from "../../../NotFound/NotFound";
import { ErrorMessage } from "../../../../components/ErrorMessage/ErrorMessage";

import {
  CustomerForm,
  CustomerFormValues,
} from "../../../../components/Customer/CustomerForm/CustomerForm";
import { CustomerJobs } from "../../../../components/CustomerJobs/CustomerJobs";
import { CustomerFiles } from "../../../../components/CustomerFiles/CustomerFiles";
import { CustomerNotes } from "../../../../components/CustomerNotes/CustomerNotes";

import { customerToFormValues } from "../../../../helpers/customer";
import { useCustomer } from "../../../../hooks/Customers/useCustomer";
import { useEditCustomer } from "../../../../hooks/Customers/useEditCustomer";

import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";

const sections = [
  { id: "details", label: "Details" },
  { id: "notes", label: "Notes" },
  { id: "jobs", label: "Jobs" },
  { id: "files", label: "Files" },
] as const;

type SectionId = typeof sections[number]["id"];
type CustomerParams = { slug: string };

export const CustomerDetails: FC = () => {
  const { slug } = useParams<CustomerParams>();

  const [snackbarStatus, setSnackbarStatus] = useState<
    "closed" | "success" | "error"
  >("closed");
  const [currentSection, setCurrentSection] = useState<SectionId>("details");

  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  const {
    customer,
    loading: initialLoading,
    error: initialError,
    reload,
  } = useCustomer(slug);

  const {
    editCustomer,
    loading: editing,
    error: editError,
  } = useEditCustomer(customer?.id, customer?.slug);
  const TOP_GAP = 20;

  const stickyTop = useMemo(() => {
    const mh = theme.mixins.toolbar.minHeight;
    const appBarHeight = typeof mh === "number" ? mh : isMdUp ? 64 : 56;
    return appBarHeight + TOP_GAP;
  }, [theme, isMdUp]);

  const SUB_HEADER_HEIGHT = 56;
  const scrollOffset = stickyTop + SUB_HEADER_HEIGHT + 12;

  useEffect(() => {
    const els = sections
      .map(({ id }) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (!els.length) return;

    let raf = 0;

    const update = () => {
      raf = 0;
      const y = scrollOffset + 1;

      let active: SectionId = sections[0].id;
      for (const el of els) {
        if (el.getBoundingClientRect().top <= y) active = el.id as SectionId;
      }
      setCurrentSection(active);
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [scrollOffset]);

  const scrollToSection = (id: SectionId) => {
    const el = document.getElementById(id);
    if (!el) return;

    el.scrollIntoView({ behavior: "smooth", block: "start" });
    setCurrentSection(id);
  };

  const handleSubmit = async (values: CustomerFormValues) => {
    if (!customer) return;

    try {
      const editedCustomer = await editCustomer(values);
      reload(editedCustomer);
      setSnackbarStatus("success");
    } catch {
      setSnackbarStatus("error");
    }
  };

  if (!slug) return <NotFound />;

  if (initialLoading) {
    return (
      <Grid container justifyContent="center" mt={4}>
        <CircularProgress />
      </Grid>
    );
  }

  if (initialError) return <ErrorMessage code={initialError} />;
  if (!customer) return <NotFound />;
  return (
    <Wrapper>
      <Toolbar />

      <SubHeaderBar $top={stickyTop}>
        <SubHeaderInner>
          <BreadcrumbContainer>
            <StyledBreadcrumbs aria-label="breadcrumb" separator="›">
              <BreadcrumbLink to="/admin/customers">
                <PeopleIcon fontSize="small" /> Customers
              </BreadcrumbLink>

              <CurrentPage>
                <PersonIcon fontSize="small" /> {customer.name}
              </CurrentPage>
            </StyledBreadcrumbs>
          </BreadcrumbContainer>
          {!isMdUp ? (
            <MobileSectionSelect size="small" variant="outlined">
              <InputLabel id="section-label">Section</InputLabel>
              <Select
                labelId="section-label"
                label="Section"
                value={currentSection}
                onChange={(e) => scrollToSection(e.target.value as SectionId)}
              >
                {sections.map((s) => (
                  <MenuItem key={s.id} value={s.id}>
                    {s.label}
                  </MenuItem>
                ))}
              </Select>
            </MobileSectionSelect>
          ) : (
            <SectionNav>
              {sections.map((s) => {
                const active = currentSection === s.id;

                return (
                  <SectionNavButton
                    key={s.id}
                    $active={active}
                    onClick={() => scrollToSection(s.id)}
                    size="small"
                  >
                    {s.label}
                  </SectionNavButton>
                );
              })}
            </SectionNav>
          )}
        </SubHeaderInner>
      </SubHeaderBar>

      <Grid container spacing={4}>
        <Grid item xs={12}>
          <ContentPaper elevation={3}>
            {editError && <ErrorMessage code={editError} />}

            <section id="details" style={{ scrollMarginTop: scrollOffset }}>
              <Typography variant="h4" gutterBottom mb={5}>
                Customer Details
              </Typography>
              <CustomerForm
                onSubmit={handleSubmit}
                initialValues={customerToFormValues(customer)}
                loading={editing}
                layout="horizontal"
                enableCopyAddress={false}
                customerId={customer.id}
                onReload={reload}
              />
            </section>

            <Divider sx={{ my: 4 }} />

            <section id="notes" style={{ scrollMarginTop: scrollOffset }}>
              <CustomerNotes customer={customer} />
            </section>

            <Divider sx={{ my: 4 }} />

            <section id="jobs" style={{ scrollMarginTop: scrollOffset }}>
              <CustomerJobs customer={customer} />
            </section>

            <Divider sx={{ my: 4 }} />

            <section id="files" style={{ scrollMarginTop: scrollOffset }}>
              <CustomerFiles customer={customer} />
            </section>
          </ContentPaper>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbarStatus !== "closed"}
        autoHideDuration={6000}
        onClose={() => setSnackbarStatus("closed")}
      >
        <Alert
          severity={snackbarStatus === "success" ? "success" : "error"}
          onClose={() => setSnackbarStatus("closed")}
          sx={{ width: "100%" }}
        >
          {snackbarStatus === "success"
            ? "Customer updated!"
            : "Customer could not update"}
        </Alert>
      </Snackbar>
    </Wrapper>
  );
};
