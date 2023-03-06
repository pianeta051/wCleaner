import { Button, CircularProgress, Typography } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { UsersTable } from "../../../../components/UsersTable/UsersTable";
import { getUsers, User } from "../../../../services/authentication";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { UserBackground } from "./Users.style";
import { ErrorMessage } from "../../../../components/ErrorMessage/ErrorMessage";
import { useAuth } from "../../../../context/AuthContext";

export const UsersPage: FC = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();
  const { isInGroup } = useAuth();

  const toCreateUser = () => navigate("/admin/users/create");

  useEffect(() => {
    if (loading) {
      getUsers().then((users) => {
        setLoading(false);
        setUsers(users);
      });
    }
  }, [loading, setUsers, setLoading]);
  return (
    <UserBackground>
      <Typography variant="h3" gutterBottom>
        Users
      </Typography>
      {isInGroup("Admin") ? (
        <>
          <Button startIcon={<AddIcon />} onClick={toCreateUser}>
            New user
          </Button>
          {loading ? <CircularProgress /> : <UsersTable users={users} />}
        </>
      ) : (
        <ErrorMessage code="UNAUTHORIZED" />
      )}
    </UserBackground>
  );
};
