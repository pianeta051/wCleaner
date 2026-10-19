import dayjs from "dayjs";

export type CleaningDueStatus = "normal" | "dueSoon" | "overdue";

export const getCleaningDueInfo = (dueDate?: string) => {
  if (!dueDate) {
    return undefined;
  }

  const today = dayjs().startOf("day");
  const due = dayjs(dueDate).startOf("day");
  const daysRemaining = due.diff(today, "day");

  if (daysRemaining < 0) {
    const days = Math.abs(daysRemaining);

    return {
      status: "overdue" as CleaningDueStatus,
      label: `Overdue by ${days} ${days === 1 ? "day" : "days"}`,
    };
  }

  if (daysRemaining <= 7) {
    return {
      status: "dueSoon" as CleaningDueStatus,
      label:
        daysRemaining === 0
          ? "Due today"
          : daysRemaining === 1
          ? "Due tomorrow"
          : `Due in ${daysRemaining} days`,
    };
  }

  return {
    status: "normal" as CleaningDueStatus,
    label: `Due in ${daysRemaining} days`,
  };
};
