import { FC, useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  CircularProgress,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { LoadingButton } from "@mui/lab";

import { Wrapper, Title, IconButton, OutcodeGrid } from "./Customers.style";
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
  } = useCustomers({ searchInput, outcodeFilter: appliedOutcodes });

  const { outcodes, loading: loadingOutcodes } = useOutcodes();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const {
    addCustomer,
    loading: creating,
    error: createError,
  } = useAddCustomer(searchInput, appliedOutcodes);

  const closeNewModalHandler = () => {
    setModalOpen(false);
  };
  const openNewModalHandler = () => {
    setModalOpen(true);
  };

  const searchHandler = (value: string) => {
    setSearchInput(value);
  };

  const applyOutcodeFilterHandler = () => {
    setAppliedOutcodes(selectedOutcodes);
  };

  const isEmpty = customers.length === 0 && !loading && searchInput === "";

  return (
    <Wrapper>
      {isAdmin && (
        <>
          {isEmpty ? (
            <EmptyCustomers onCreateNew={openNewModalHandler} />
          ) : (
            <>
              <Title>Customers</Title>
              <Grid container spacing={1}>
                {isMobile ? (
                  <Grid item xs={12}>
                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>Filter by Outcode</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        {loadingOutcodes ? (
                          <CircularProgress />
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
                    </Accordion>
                  </Grid>
                ) : (
                  <OutcodeGrid item xs={12} md={2}>
                    {loadingOutcodes ? (
                      <CircularProgress />
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
                  </OutcodeGrid>
                )}

                <Grid item xs={12} md={10}>
                  <IconButton>
                    <Button
                      startIcon={<AddIcon />}
                      onClick={openNewModalHandler}
                    >
                      New customer
                    </Button>
                  </IconButton>

                  <SearchBar
                    onSearch={searchHandler}
                    initialValue={searchInput}
                  />

                  {loading ? (
                    <CircularProgress />
                  ) : error ? (
                    <ErrorMessage code={error} />
                  ) : (
                    <>
                      <CustomersTable customers={customers} onReload={reload} />
                      {moreToLoad && (
                        <LoadingButton
                          variant="text"
                          onClick={loadMore}
                          loading={loadingMore}
                        >
                          Load more
                        </LoadingButton>
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
