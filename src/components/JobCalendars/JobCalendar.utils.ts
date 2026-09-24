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
  if (!value) {
    return null;
  }

  const parsed = dayjs(value, "DD-MM-YYYY", true);

  return parsed.isValid() ? parsed : null;
};
