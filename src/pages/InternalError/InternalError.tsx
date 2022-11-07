import { FC } from "react";

type InternalErrorProps = {
  "data-testid"?: string;
};

export const InternalError: FC<InternalErrorProps> = ({
  "data-testid": testId,
}) => <h1 data-testid={testId}>Internal error</h1>;
