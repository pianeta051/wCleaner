import { FC, useState } from "react";
import {
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Grid,
  Toolbar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import {
  Wrapper,
  Title,
  TopBarRow,
  OutcodeAccordion,
  AccordionTitle,
  LoadingCenter,
  DesktopOutcodeLoadingBox,
  DesktopOutcodeBox,
  ActionsGrid,
  NewCustomerButton,
} from "./Customers.style";

import { NewCustomerModal } from "../../../../components/Customer/CreateCustomer/NewCustomerModal/NewCustomerModal";
import { CustomersTable } from "../../../../components/CustomersTable/CustomersTable";
import { EmptyCustomers } from "../../../../components/EmptyCustomers/EmptyCustomers";
import { SearchBar } from "../../../../components/SearchBar/SearchBar";
import { ErrorMessage } from "../../../../components/ErrorMessage/ErrorMessage";
import { useCustomers } from "../../../../hooks/Customers/useCustomers";
import { useOutcodes } from "../../../../hooks/Customers/useOutcodes";
import { OutcodesSelector } from "../../../../components/OutcodesSelector/OutcodesSelector";
import { useAuth } from "../../../../context/AuthContext";
import { useAddCustomer } from "../../../../hooks/Customers/useAddCustomer";

export const Customers: FC = () => {
  const { isInGroup } = useAuth();
  const isAdmin = isInGroup("Admin");

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOutcodes, setSelectedOutcodes] = useState<string[]>([]);
  const [appliedOutcodes, setAppliedOutcodes] = useState<string[]>([]);
  const [searchInput, setSearchInput] = useState("");

  const {
    customers,
    error,
    loading,
    loadMore,
    moreToLoad,
    loadingMore,
    reload,
  } = useCustomers(searchInput, appliedOutcodes);

  const { outcodes, loading: loadingOutcodes } = useOutcodes();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const {
    addCustomer,
    loading: creating,
    error: createError,
  } = useAddCustomer(searchInput, appliedOutcodes);

  const closeNewModalHandler = () => setModalOpen(false);
  const openNewModalHandler = () => setModalOpen(true);

  const searchHandler = (value: string) => setSearchInput(value);

  const applyOutcodeFilterHandler = () => {
    setAppliedOutcodes(selectedOutcodes);
  };

  const isEmpty = customers.length === 0 && !loading && searchInput === "";

  return (
    <Wrapper>
      <Toolbar />
      {isAdmin && (
        <>
          {isEmpty ? (
            <EmptyCustomers onCreateNew={openNewModalHandler} />
          ) : (
            <>
              <Title>Customers</Title>

              <Grid container spacing={2}>
                <Grid size={12}>
                  <TopBarRow container spacing={2}>
                    <Grid
                      size={{
                        xs: 12,
                        md: 2,
                      }}
                    >
                      {isMobile ? (
                        <OutcodeAccordion elevation={0}>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <AccordionTitle>Search UK postcode</AccordionTitle>
                          </AccordionSummary>

                          <AccordionDetails>
                            {loadingOutcodes ? (
                              <LoadingCenter container>
                                <CircularProgress size={24} />
                              </LoadingCenter>
                            ) : (
                              outcodes && (
                                <OutcodesSelector
                                  outcodes={outcodes}
                                  selected={selectedOutcodes}
                                  onChange={setSelectedOutcodes}
                                  onFilter={applyOutcodeFilterHandler}
                                />
                              )
                            )}
                          </AccordionDetails>
                        </OutcodeAccordion>
                      ) : loadingOutcodes ? (
                        <DesktopOutcodeLoadingBox container>
                          <CircularProgress size={24} />
                        </DesktopOutcodeLoadingBox>
                      ) : (
                        outcodes && (
                          <DesktopOutcodeBox>
                            <OutcodesSelector
                              outcodes={outcodes}
                              selected={selectedOutcodes}
                              onChange={setSelectedOutcodes}
                              onFilter={applyOutcodeFilterHandler}
                            />
                          </DesktopOutcodeBox>
                        )
                      )}
                    </Grid>

                    <Grid
                      size={{
                        xs: 12,
                        md: 6,
                      }}
                    >
                      <SearchBar
                        onSearch={searchHandler}
                        initialValue={searchInput}
                      />
                    </Grid>

                    <Grid
                      size={{
                        xs: 12,
                        md: 3,
                      }}
                    >
                      <ActionsGrid>
                        <NewCustomerButton
                          startIcon={<AddIcon />}
                          onClick={openNewModalHandler}
                          variant="contained"
                          fullWidth={isMobile}
                        >
                          New customer
                        </NewCustomerButton>
                      </ActionsGrid>
                    </Grid>
                  </TopBarRow>
                </Grid>

                <Grid size={12}>
                  {loading ? (
                    <CircularProgress />
                  ) : error ? (
                    <ErrorMessage code={error} />
                  ) : (
                    <>
                      <CustomersTable customers={customers} onReload={reload} />
                      {moreToLoad && (
                        <NewCustomerButton
                          variant="text"
                          onClick={loadMore}
                          disabled={loadingMore}
                          sx={{ height: "auto" }}
                        >
                          {loadingMore ? "Loading..." : "Load more"}
                        </NewCustomerButton>
                      )}
                    </>
                  )}
                </Grid>
              </Grid>
            </>
          )}

          <NewCustomerModal
            open={modalOpen}
            onClose={closeNewModalHandler}
            onSubmit={closeNewModalHandler}
            addCustomer={addCustomer}
            loading={creating}
            error={createError ?? undefined}
          />
        </>
      )}
    </Wrapper>
  );
};
