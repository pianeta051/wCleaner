import { FC, useEffect, useState } from "react";
import {
  Alert,
  Breadcrumbs,
  CircularProgress,
  Divider,
  Grid,
  Link as MuiLink,
  Snackbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useParams, Link as RouterLink } from "react-router-dom";

import {
  Wrapper,
  TopBar,
  MobileMenuButton,
  StyledDrawer,
  ContentPaper,
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

import { Section, SideMenu } from "../../../../components/SideMenu/SiteMenu";

const sections: Section[] = [
  { id: "details", label: "Details" },
  { id: "notes", label: "Notes" },
  { id: "jobs", label: "Jobs" },
  { id: "files", label: "Files" },
];

type CustomerParams = { slug: string };

export const CustomerDetails: FC = () => {
  const { slug } = useParams<CustomerParams>();
  const [snackbarStatus, setSnackbarStatus] = useState<
    "closed" | "success" | "error"
  >("closed");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState("details");

  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  const {
    customer,
    loading: initialLoading,
    error: initialError,
  } = useCustomer(slug);
  const {
    editCustomer,
    loading: editing,
    error: editError,
  } = useEditCustomer(customer?.id, customer?.slug);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible?.target.id) setCurrentSection(visible.target.id);
      },
      { rootMargin: "-50% 0px -49% 0px" }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
    setCurrentSection(id);
    setDrawerOpen(false);
  };

  const handleSubmit = async (v: CustomerFormValues) => {
    if (!customer) return;
    try {
      await editCustomer(v);
      setSnackbarStatus("success");
    } catch (e) {
      setSnackbarStatus("error");
    }
  };

  if (!slug) return <NotFound />;
  if (initialLoading)
    return (
      <Grid container justifyContent="center" mt={4}>
        <CircularProgress />
      </Grid>
    );
  if (initialError) return <ErrorMessage code={initialError} />;
  if (!customer) return <NotFound />;

  const menuEl = (
    <SideMenu
      sections={sections}
      currentSection={currentSection}
      onSelect={scrollTo}
      dense
    />
  );

  return (
    <Wrapper>
      <TopBar>
        <Breadcrumbs aria-label="breadcrumb">
          <MuiLink component={RouterLink} to="/admin/customers">
            Customers
          </MuiLink>
          <MuiLink component={RouterLink} to="/admin/customers/">
            {customer.name}
          </MuiLink>
        </Breadcrumbs>
      </TopBar>

      {!isMdUp && (
        <>
          <MobileMenuButton
            onClick={() => setDrawerOpen(true)}
            aria-label="menu"
          >
            <MenuIcon />
          </MobileMenuButton>
          <StyledDrawer
            anchor="left"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            ModalProps={{ keepMounted: true }}
          >
            {menuEl}
          </StyledDrawer>
        </>
      )}

      <Grid container spacing={4}>
        {isMdUp && (
          <Grid item md={2}>
            {menuEl}
          </Grid>
        )}

        <Grid item xs={12} md={10}>
          <ContentPaper elevation={3}>
            {editError && <ErrorMessage code={editError} />}

            <section id="details">
              <Typography variant="h4" gutterBottom mb={5}>
                Customer Details
              </Typography>
              <CustomerForm
                onSubmit={handleSubmit}
                initialValues={customerToFormValues(customer)}
                loading={editing}
                layout="horizontal"
                enableCopyAddress={false}
              />
            </section>

            <Divider sx={{ my: 4 }} />

            <section id="notes">
              <CustomerNotes customer={customer} />
            </section>

            <Divider sx={{ my: 4 }} />

            <section id="jobs">
              <CustomerJobs customer={customer} />
            </section>

            <Divider sx={{ my: 4 }} />

            <section id="files">
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
          {snackbarStatus === "success" ? (
            <>Customer updated!</>
          ) : (
            <>Customer could not update</>
          )}
        </Alert>
      </Snackbar>
    </Wrapper>
  );
};
