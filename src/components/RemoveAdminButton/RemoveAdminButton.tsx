import { FC, useState } from "react";
import { ErrorCode, isErrorCode } from "../../services/error";
import { Button } from "@mui/material";
import { removeUserAdmin } from "../../services/authentication";

type RemoveAdminButtonProps = {
  userId: string;
  onError: (error: ErrorCode) => void;
  onRemoveAdmin: () => void;
};
export const RemoveAdminButton: FC<RemoveAdminButtonProps> = ({
  userId,
  onError,
  onRemoveAdmin,
}) => {
  const [loading, setLoading] = useState(false);
  const removeAdminHandler = () => {
    setLoading(true);
    removeUserAdmin(userId)
      .then(() => {
        onRemoveAdmin();
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        if (isErrorCode(error)) {
          onError(error);
        } else {
          onError("INTERNAL_ERROR");
        }
      });
  };
  return (
    <Button
      loading={loading}
      variant="text"
      color="error"
      onClick={removeAdminHandler}
    >
      Remove Admin
    </Button>
  );
};
