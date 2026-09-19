import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { View, Views } from "react-big-calendar";

dayjs.extend(customParseFormat);

export const DEFAULT_CALENDAR_VIEW: View = Views.WEEK;

const VALID_VIEWS: View[] = [Views.DAY, Views.WEEK, Views.MONTH];

export const isValidCalendarView = (value: string | null): value is View => {
  return !!value && VALID_VIEWS.includes(value as View);
};

export const parseCalendarDate = (value: string | null): Dayjs | null => {
  if (!value) return null;

  const parsed = dayjs(value, "DD-MM-YYYY", true);

  return parsed.isValid() ? parsed : null;
};

const startOfMondayWeek = (date: Dayjs): Dayjs => {
  const day = date.day();

  const daysSinceMonday = day === 0 ? 6 : day - 1;

  return date.subtract(daysSinceMonday, "day").startOf("day");
};

export const normalizeCalendarDate = (date: Dayjs, view: View): Dayjs => {
  switch (view) {
    case Views.MONTH:
      return date.startOf("month");

    case Views.WEEK:
      return startOfMondayWeek(date);

    case Views.DAY:
    default:
      return date.startOf("day");
  }
};
