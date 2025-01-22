import { FC, useState } from "react";
import { User } from "../../services/authentication";
import {
  GridActionsCellItem,
  GridActionsColDef,
  GridColDef,
} from "@mui/x-data-grid";
import {
  AdminManagementContainer,
  StyledDataGrid,
  Wrapper,
} from "./UsersTable.style";
import { UserColor } from "../UserColor/UserColor";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import { MakeAdminButton } from "../MakeAdminButton/MakeAdminButton";
import { ErrorCode } from "../../services/error";
import { useUsers } from "../../hooks/Users/useUsers";
import { Snackbar } from "@mui/material";
import { ErrorMessage } from "../ErrorMessage/ErrorMessage";
import { RemoveAdminButton } from "../RemoveAdminButton/RemoveAdminButton";

type UsersTableProps = {
  users?: User[];
  onUserEditClick?: (userId: string) => void;
  onUserDeleteClick?: (userId: string) => void;
};

const columns: GridColDef[] = [
  {
    field: "name",
    headerName: "Name",
    sortable: true,
    width: 150,
  },
  {
    field: "email",
    headerName: "Email",
    sortable: true,
    width: 200,
  },
  {
    field: "color",
    headerName: "Color",
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
  const [errorCode, setErrorCode] = useState<ErrorCode | null>(null);
  const { reload } = useUsers();
  const errorHandler = (error: ErrorCode) => setErrorCode(error);

  const successHandler = () => {
    reload();
  };

  const closeErrorSnackBar = () => setErrorCode(null);

  const actionsColumn: GridActionsColDef = {
    field: "actions",
    type: "actions",
    width: 300,
    headerName: "Actions",

    getActions: (params) => {
      return [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          key="edit"
          onClick={() => onUserEditClick?.(params.row.id)}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          key="delete"
          onClick={() => onUserDeleteClick?.(params.row.id)}
        />,
        <AdminManagementContainer key="admin management">
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
      ];
    },
  };

  return (
    <Wrapper elements={users.length}>
      <StyledDataGrid columns={[...columns, actionsColumn]} rows={users} />
      <Snackbar
        open={errorCode !== null}
        autoHideDuration={6000}
        onClose={closeErrorSnackBar}
        message={<ErrorMessage code={errorCode ?? "INTERNAL_ERROR"} />}
      />
    </Wrapper>
  );
};
