import { FC, useState } from "react";
import { Button, CircularProgress, Grid } from "@mui/material";
import { Wrapper, Title, IconButton, OutcodeGrid } from "./Customers.style";
import AddIcon from "@mui/icons-material/Add";
import { NewCustomerModal } from "../../../../components/Customer/CreateCustomer/NewCustomerModal/NewCustomerModal";
import { CustomersTable } from "../../../../components/CustomersTable/CustomersTable";
import { EmptyCustomers } from "../../../../components/EmptyCustomers/EmptyCustomers";
import { LoadingButton } from "@mui/lab";
import { SearchBar } from "../../../../components/SearchBar/SearchBar";
import { ErrorMessage } from "../../../../components/ErrorMessage/ErrorMessage";
import { useCustomers } from "../../../../hooks/Customers/useCustomers";
import { useOutcodes } from "../../../../hooks/Customers/useOutcodes";
import { OutcodesSelector } from "../../../../components/OutcodesSelector/OutcodesSelector";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useMediaQuery,
  useTheme,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useAuth } from "../../../../context/AuthContext";

export const Customers: FC = () => {
  const { isInGroup } = useAuth();
  const isAdmin = isInGroup("Admin");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOutcodes, setSelectedOutcodes] = useState<string[]>([]);
  const [appliedOutcodes, setAppliedOutcodes] = useState<string[]>([]);

  const [searchInput, setSearchInput] = useState("");

  const { customers, error, loading, loadMore, moreToLoad, loadingMore } =
    useCustomers(searchInput, appliedOutcodes);

  const { outcodes, loading: loadingOutcodes } = useOutcodes();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const closeNewModalHandler = () => {
    setModalOpen(false);
  };
  const openNewMHandler = () => {
    setModalOpen(true);
  };

  const searchHandler = (searchInput: string) => {
    setSearchInput(searchInput);
  };
  const applyOutcodeFilterHandler = () => {
    setAppliedOutcodes(selectedOutcodes);
  };

  const isEmpty = customers.length === 0 && !loading && searchInput === "";

  return (
    <Wrapper>
      {isAdmin && (
        <>
          {" "}
          {isEmpty ? (
            <EmptyCustomers onCreateNew={openNewMHandler} />
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

                <Grid item xs={9}>
                  <IconButton>
                    <Button startIcon={<AddIcon />} onClick={openNewMHandler}>
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
                      <CustomersTable customers={customers} />
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
          />
        </>
      )}
    </Wrapper>
  );
};
