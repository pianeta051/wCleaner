import { Button, CircularProgress, Grid, Typography } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { UsersTable } from "../../../../components/UsersTable/UsersTable";
import {
  getUsers,
  removeUser,
  User,
} from "../../../../services/authentication";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { UserBackground, Wrapper } from "./Users.style";
import { EditUserModal } from "../../../../components/EditUserModal/EditUserModal";
import { ErrorCode, isErrorCode } from "../../../../services/error";
import { DeleteUser } from "../../../../components/DeleteUser/DeleteUser";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { ErrorMessage } from "../../../../components/ErrorMessage/ErrorMessage";
export const UsersPage: FC = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [error, setError] = useState<ErrorCode | null>(null);

  const navigate = useNavigate();

  const toCreateUser = () => navigate("/admin/users/create");
  const handleOpenEditModal = () => setOpenEditModal(true);
  const handleCloseEditModal = () => setOpenEditModal(false);
  const handleOpenDeleteAlert = () => setOpenDeleteAlert(true);
  const handleCloseDeleteAlert = () => setOpenDeleteAlert(false);

  const userClickEditHandler = (userId: string) => {
    const user = users.find((user) => user.id === userId);
    if (user) {
      setSelectedUser(user);
      handleOpenEditModal();
    }
  };

  const userClickDeleteHandler = (userId: string) => {
    const user = users.find((user) => user.id === userId);
    if (user) {
      setSelectedUser(user);
      handleOpenDeleteAlert();
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
            <UsersTable
              users={users}
              onUserEditClick={userClickEditHandler}
              onUserDeleteClick={userClickDeleteHandler}
            />
          )}
        </Grid>
        {selectedUser && (
          <EditUserModal
            open={openEditModal}
            onClose={handleCloseEditModal}
            user={selectedUser}
          />
        )}
      </Wrapper>
      {selectedUser && (
        <DeleteUser
          id={selectedUser.id}
          openDialog={openDeleteAlert}
          onClose={handleCloseDeleteAlert}
        />
      )}
      {error && <ErrorMessage code={error} />}
    </UserBackground>
  );
};
