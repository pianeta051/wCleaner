import { CircularProgress } from "@mui/material";
import { FC, SetStateAction, useEffect, useState } from "react";
import { getUserGroups } from "../../services/authentication";

type UserGroupsProps = {
  id: string;
};

export const UserGroups: FC<UserGroupsProps> = ({ id }) => {
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState<string[]>([]);
  useEffect(() => {
    if (loading) {
      getUserGroups(id).then((groups: SetStateAction<string[]>) => {
        setLoading(false);
        setGroups(groups);
      });
    }
  }, [loading, setGroups, setLoading, id]);

  useEffect(() => {
    if (!loading) {
      setLoading(true);
    }
  }, [id]);

  return loading ? (
    <CircularProgress />
  ) : (
    <>
      <h3>Groups</h3>

      {groups.map((group) => (
        <p key={group}>{group}</p>
      ))}
    </>
  );
};
