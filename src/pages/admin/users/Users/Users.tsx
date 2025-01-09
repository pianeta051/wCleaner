import { Button, CircularProgress, Grid, Typography } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { UsersTable } from "../../../../components/UsersTable/UsersTable";
import { getUsers, User } from "../../../../services/authentication";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { UserBackground, Wrapper } from "./Users.style";
import { EditUserModal } from "../../../../components/EditUserModal/EditUserModal";

export const UsersPage: FC = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const navigate = useNavigate();

  const toCreateUser = () => navigate("/admin/users/create");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const userClickEditHandler = (userId: string) => {
    const user = users.find((user) => user.id === userId);
    if (user) {
      setSelectedUser(user);
      handleOpen();
    }
  };

  useEffect(() => {
    if (loading) {
      getUsers()
        .then((users) => {
          setLoading(false);
          setUsers(users);
        })
        .catch(() => {
          // Do nothing, the hook manages the error
        });
    }
  }, [loading, setUsers, setLoading]);

  return (
    <UserBackground>
      <Wrapper container spacing={1} columns={12}>
        <Grid item xs={12}>
          <Typography align="center" variant="h3" gutterBottom>
            Users
          </Typography>
          <Button startIcon={<AddIcon />} onClick={toCreateUser}>
            New user
          </Button>
          {loading ? (
            <CircularProgress />
          ) : (
            <UsersTable users={users} onUserEditClick={userClickEditHandler} />
          )}
        </Grid>
        {selectedUser && (
          <EditUserModal
            open={open}
            onClose={handleClose}
            user={selectedUser}
          />
        )}
      </Wrapper>
    </UserBackground>
  );
};
