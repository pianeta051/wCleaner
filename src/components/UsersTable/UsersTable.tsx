import { FC } from "react";
import { User } from "../../services/authentication";
import {
  GridActionsCellItem,
  GridActionsColDef,
  GridColDef,
} from "@mui/x-data-grid";
import { StyledDataGrid, Wrapper } from "./UsersTable.style";
import { UserColor } from "../UserColor/UserColor";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

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
];

export const UsersTable: FC<UsersTableProps> = ({
  users = [],
  onUserEditClick,
  onUserDeleteClick,
}) => {
  const actionsColumn: GridActionsColDef = {
    field: "actions",
    type: "actions",
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
      ];
    },
  };

  return (
    <Wrapper elements={users.length}>
      <StyledDataGrid columns={[...columns, actionsColumn]} rows={users} />
    </Wrapper>
  );
};
