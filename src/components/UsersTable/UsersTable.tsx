import { FC } from "react";
import { User } from "../../services/authentication";
import { GridColDef, GridRowParams } from "@mui/x-data-grid";
import { Wrapper, StyledDataGrid } from "./UsersTable.style";

type UsersTableProps = {
  users?: User[];
  selectedUserId: string;
  onSelectUser: (id: string) => void;
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
    width: 150,
  },
];

export const UsersTable: FC<UsersTableProps> = ({
  users = [],
  selectedUserId,
  onSelectUser,
}) => {
  const rowClickHandler = (params: GridRowParams) => {
    const userId = params.row.id;
    onSelectUser(userId);
  };
  return (
    <Wrapper elements={users.length}>
      <StyledDataGrid
        columns={columns}
        rows={users}
        getRowClassName={(params) =>
          params.row.id === selectedUserId ? "user-selected" : ""
        }
        onRowClick={rowClickHandler}
      />
    </Wrapper>
  );
};
