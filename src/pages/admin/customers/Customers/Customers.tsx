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
  SearchArea,
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
import { useAddCustomer } from "../../../../hooks/Customers/useAddCustomer";

import { OutcodesSelector } from "../../../../components/OutcodesSelector/OutcodesSelector";
import { useAuth } from "../../../../context/AuthContext";

export const Customers: FC = () => {
  const { isInGroup } = useAuth();

  const isAdmin = isInGroup("Admin");

  const [modalOpen, setModalOpen] = useState(false);

  const [outcodesFilter, setOutcodesFilter] = useState<string[]>([]);

  const [searchInput, setSearchInput] = useState("");

  const {
    customers,
    error,
    loading,
    moreToLoad,
    loadMore,
    loadingMore,
    reload,
  } = useCustomers(searchInput, outcodesFilter);

  const { outcodes, loading: loadingOutcodes } = useOutcodes();

  const {
    addCustomer,
    loading: creating,
    error: createError,
  } = useAddCustomer();

  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const closeNewModalHandler = () => {
    setModalOpen(false);
  };

  const openNewModalHandler = () => {
    setModalOpen(true);
  };

  const searchHandler = (value: string) => {
    setSearchInput(value);
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

              {isMobile ? (
                <TopBarRow>
                  <SearchArea>
                    <SearchBar
                      onSearch={searchHandler}
                      initialValue={searchInput}
                    />
                  </SearchArea>

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
                            selected={outcodesFilter}
                            onChange={setOutcodesFilter}
                          />
                        )
                      )}
                    </AccordionDetails>
                  </OutcodeAccordion>

                  <ActionsGrid>
                    <NewCustomerButton
                      startIcon={<AddIcon />}
                      onClick={openNewModalHandler}
                      variant="contained"
                    >
                      New customer
                    </NewCustomerButton>
                  </ActionsGrid>
                </TopBarRow>
              ) : (
                <TopBarRow>
                  {loadingOutcodes ? (
                    <DesktopOutcodeLoadingBox>
                      <CircularProgress size={24} />
                    </DesktopOutcodeLoadingBox>
                  ) : (
                    outcodes && (
                      <DesktopOutcodeBox>
                        <OutcodesSelector
                          outcodes={outcodes}
                          selected={outcodesFilter}
                          onChange={setOutcodesFilter}
                        />
                      </DesktopOutcodeBox>
                    )
                  )}

                  <SearchArea>
                    <SearchBar
                      onSearch={searchHandler}
                      initialValue={searchInput}
                    />
                  </SearchArea>

                  <ActionsGrid>
                    <NewCustomerButton
                      startIcon={<AddIcon />}
                      onClick={openNewModalHandler}
                      variant="contained"
                    >
                      New customer
                    </NewCustomerButton>
                  </ActionsGrid>
                </TopBarRow>
              )}

              {loading ? (
                <Grid container justifyContent="center" sx={{ py: 4 }}>
                  <CircularProgress />
                </Grid>
              ) : error ? (
                <ErrorMessage code={error} />
              ) : (
                <>
                  <CustomersTable customers={customers} onReload={reload} />

                  {moreToLoad && (
                    <Grid container justifyContent="center" sx={{ mt: 2 }}>
                      <NewCustomerButton
                        variant="outlined"
                        onClick={loadMore}
                        disabled={loadingMore}
                      >
                        {loadingMore ? "Loading..." : "Load more"}
                      </NewCustomerButton>
                    </Grid>
                  )}
                </>
              )}
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
