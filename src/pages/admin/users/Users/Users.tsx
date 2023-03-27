import { Button, CircularProgress, Grid, Typography } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { UsersTable } from "../../../../components/UsersTable/UsersTable";
import { getUsers, User } from "../../../../services/authentication";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { UserBackground, Wrapper } from "./Users.style";
import { UserDetails } from "../../../../components/UserDetails/UserDetails";

export const UsersPage: FC = () => {
  const [loading, setLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [users, setUsers] = useState<User[]>([]);

  const navigate = useNavigate();

  const toCreateUser = () => navigate("/admin/users/create");

  useEffect(() => {
    if (loading) {
      getUsers().then((users) => {
        setSelectedUserId(users[0].id);
        setLoading(false);
        setUsers(users);
      });
    }
  }, [loading, setUsers, setLoading]);

  const selectUserHandler = (id: string) => {
    setSelectedUserId(id);
  };

  const selectedUser = selectedUserId
    ? users.find((user) => user.id === selectedUserId)
    : null;

  return (
    <UserBackground>
      <Wrapper container spacing={1} columns={16}>
        <Grid item xs={8}>
          <Typography align="center" variant="h3" gutterBottom>
            Users
          </Typography>
          <Button startIcon={<AddIcon />} onClick={toCreateUser}>
            New user
          </Button>
          {loading ? (
            <CircularProgress />
          ) : (
            <UsersTable
              users={users}
              selectedUserId={selectedUserId}
              onSelectUser={selectUserHandler}
            />
          )}
        </Grid>
        {selectedUser && (
          <Grid item xs={8}>
            <UserDetails user={selectedUser} />
          </Grid>
        )}
      </Wrapper>
    </UserBackground>
  );
};
