import { LoadingButton } from "@mui/lab";
import { FC, useState } from "react";
import { ErrorCode, isErrorCode } from "../../services/error";
import { makeUserAdmin } from "../../services/authentication";

type MakeAdminButtonProps = {
  userId: string;
  onError: (error: ErrorCode) => void;
  onMakeAdmin: () => void;
};

export const MakeAdminButton: FC<MakeAdminButtonProps> = ({
  userId,
  onError,
  onMakeAdmin,
}) => {
  const [loading, setLoading] = useState(false);

  const makeAdminHandler = () => {
    setLoading(true);
    makeUserAdmin(userId)
      .then(() => {
        onMakeAdmin();
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
    <LoadingButton
      loading={loading}
      variant="text"
      color="success"
      onClick={makeAdminHandler}
    >
      Make Admin
    </LoadingButton>
  );
};
