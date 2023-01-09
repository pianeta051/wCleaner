import { FC } from "react";
import { User } from "../../services/authentication";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Wrapper } from "./UsersTable.style";

type UsersTableProps = {
  users?: User[];
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

export const UsersTable: FC<UsersTableProps> = ({ users = [] }) => {
  return (
    <Wrapper elements={users.length}>
      <DataGrid columns={columns} rows={users} />
    </Wrapper>
  );
};
