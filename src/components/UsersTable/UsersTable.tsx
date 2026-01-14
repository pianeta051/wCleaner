import { FC, useMemo, useState } from "react";
import { User } from "../../services/authentication";
import { GridColDef } from "@mui/x-data-grid";
import {
  AdminManagementContainer,
  StyledDataGrid,
  Wrapper,
  UserCard,
} from "./UsersTable.style";
import { UserColor } from "../UserColor/UserColor";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import { MakeAdminButton } from "../MakeAdminButton/MakeAdminButton";
import { ErrorCode } from "../../services/error";
import { useUsers } from "../../hooks/Users/useUsers";
import {
  IconButton,
  Snackbar,
  useMediaQuery,
  Stack,
  CardContent,
  Typography,
  Divider,
  Chip,
  CardActions,
} from "@mui/material";
import { ErrorMessage } from "../ErrorMessage/ErrorMessage";
import { RemoveAdminButton } from "../RemoveAdminButton/RemoveAdminButton";
import { theme } from "../../theme";

type UsersTableProps = {
  users?: User[];
  onUserEditClick?: (userId: string) => void;
  onUserDeleteClick?: (userId: string) => void;
};

const baseColumns: GridColDef[] = [
  {
    field: "name",
    headerName: "Name",
    sortable: true,
    width: 200,
  },
  {
    field: "email",
    headerName: "Email",
    sortable: true,
    width: 220,
  },
  {
    field: "color",
    headerName: "Color",
    width: 70,
    sortable: false,
    renderCell: (params) =>
      params.value ? <UserColor color={params.value as string} /> : null,
  },
  {
    field: "isAdmin",
    headerName: "Is Admin",
    sortable: true,
    width: 100,
    renderCell: (params) => (params.value ? <DoneIcon /> : <CloseIcon />),
  },
];

export const UsersTable: FC<UsersTableProps> = ({
  users = [],
  onUserEditClick,
  onUserDeleteClick,
}) => {
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [errorCode, setErrorCode] = useState<ErrorCode | null>(null);
  const { reload } = useUsers();

  const errorHandler = (error: ErrorCode) => setErrorCode(error);
  const successHandler = () => reload();
  const closeErrorSnackBar = () => setErrorCode(null);

  const actionsColumn: GridColDef = useMemo(
    () => ({
      field: "actions",
      type: "actions",
      width: 320,
      headerName: "Actions",
      getActions: (params) => [
        <IconButton
          aria-label="edit"
          onClick={() => onUserEditClick?.(params.row.id)}
          key="edit"
        >
          <EditIcon />
        </IconButton>,
        <IconButton
          aria-label="delete"
          onClick={() => onUserDeleteClick?.(params.row.id)}
          key="delete"
        >
          <DeleteIcon />
        </IconButton>,
        <AdminManagementContainer key="admin-management">
          {params.row.isAdmin ? (
            <RemoveAdminButton
              userId={params.row.id}
              onError={errorHandler}
              onRemoveAdmin={successHandler}
            />
          ) : (
            <MakeAdminButton
              userId={params.row.id}
              onError={errorHandler}
              onMakeAdmin={successHandler}
            />
          )}
        </AdminManagementContainer>,
      ],
    }),
    [onUserEditClick, onUserDeleteClick]
  );

  return (
    <Wrapper elements={users.length} isMobile={isMobile}>
      {isMobile ? (
        <Stack spacing={2}>
          {users.map((user) => {
            const isAdmin = !!user.isAdmin;

            return (
              <UserCard key={user.id} variant="outlined">
                <CardContent sx={{ pb: 1.5 }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    gap={2}
                  >
                    <Stack minWidth={0}>
                      <Typography variant="h6" fontWeight={800} noWrap>
                        {user.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ wordBreak: "break-word" }}
                      >
                        {user.email}
                      </Typography>
                    </Stack>

                    <Stack direction="row" alignItems="center" gap={1}>
                      {user.color ? <UserColor color={user.color} /> : null}
                      <Chip
                        size="small"
                        variant="outlined"
                        label={isAdmin ? "Admin" : "User"}
                        icon={isAdmin ? <DoneIcon /> : <CloseIcon />}
                      />
                    </Stack>
                  </Stack>

                  <Divider sx={{ my: 1.5 }} />

                  <Stack direction="row" justifyContent="flex-end">
                    {isAdmin ? (
                      <RemoveAdminButton
                        userId={user.id}
                        onError={errorHandler}
                        onRemoveAdmin={successHandler}
                      />
                    ) : (
                      <MakeAdminButton
                        userId={user.id}
                        onError={errorHandler}
                        onMakeAdmin={successHandler}
                      />
                    )}
                  </Stack>
                </CardContent>

                <CardActions
                  sx={{
                    px: 2,
                    pb: 2,
                    pt: 0,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <IconButton
                    aria-label="edit"
                    onClick={() => onUserEditClick?.(user.id)}
                  >
                    <EditIcon />
                  </IconButton>

                  <IconButton
                    aria-label="delete"
                    onClick={() => onUserDeleteClick?.(user.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </UserCard>
            );
          })}
        </Stack>
      ) : (
        <StyledDataGrid
          columns={[...baseColumns, actionsColumn]}
          rows={users}
          disableRowSelectionOnClick
        />
      )}

      <Snackbar
        open={errorCode !== null}
        autoHideDuration={6000}
        onClose={closeErrorSnackBar}
        message={<ErrorMessage code={errorCode ?? "INTERNAL_ERROR"} />}
      />
    </Wrapper>
  );
};
