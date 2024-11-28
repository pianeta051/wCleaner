import { FC } from "react";

type UserColorProps = {
  color: string;
};

export const UserColor: FC<UserColorProps> = ({ color }) => {
  return (
    <div
      style={{
        backgroundColor: color,
        width: 20,
        height: 20,
        borderRadius: "50%",
      }}
    />
  );
};
