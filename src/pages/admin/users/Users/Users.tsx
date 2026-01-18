import { Button, CircularProgress, Grid } from "@mui/material";
import { FC, useState } from "react";
import { UsersTable } from "../../../../components/UsersTable/UsersTable";
import { User } from "../../../../services/authentication";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { Title, UserBackground, Wrapper } from "./Users.style";
import { EditUserModal } from "../../../../components/EditUserModal/EditUserModal";
import { DeleteUser } from "../../../../components/DeleteUser/DeleteUser";
import { ErrorMessage } from "../../../../components/ErrorMessage/ErrorMessage";
import { useUsers } from "../../../../hooks/Users/useUsers";

export const UsersPage: FC = () => {
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const navigate = useNavigate();
  const { users, loading, error, reload } = useUsers();

  const toCreateUser = () => navigate("/admin/users/create");
  const handleOpenEditModal = () => setOpenEditModal(true);
  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    reload();
  };

  const handleOpenDeleteAlert = () => setOpenDeleteAlert(true);
  const handleCloseDeleteAlert = () => {
    setOpenDeleteAlert(false);
    reload();
  };

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

  return (
    <UserBackground>
      <Title>Users</Title>
      <Wrapper container spacing={1} columns={12}>
        <Grid size={12}>
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
