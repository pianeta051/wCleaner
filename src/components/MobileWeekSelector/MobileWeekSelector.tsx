import { FC, useMemo } from "react";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";

import {
  WeekSelectorContainer,
  WeekDayButton,
  WeekDayLabel,
} from "./MobileWeekSelector.style";

dayjs.extend(isoWeek);

type MobileWeekSelectorProps = {
  date: Date;
  onNavigate: (date: Date) => void;
};

const WEEK_DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

export const MobileWeekSelector: FC<MobileWeekSelectorProps> = ({
  date,
  onNavigate,
}) => {
  const weekDays = useMemo(() => {
    const startOfWeek = dayjs(date).isoWeekday(1);

    return WEEK_DAYS.map((label, index) => ({
      label,
      date: startOfWeek.add(index, "day"),
    }));
  }, [date]);

  return (
    <WeekSelectorContainer>
      {weekDays.map(({ label, date: day }) => {
        const selected = day.isSame(dayjs(date), "day");

        return (
          <WeekDayButton
            key={day.format("YYYY-MM-DD")}
            type="button"
            selected={selected}
            onClick={() => onNavigate(day.toDate())}
            aria-label={day.format("dddd D MMMM YYYY")}
            aria-pressed={selected}
          >
            <WeekDayLabel>{label}</WeekDayLabel>

            <span className="day-number">{day.date()}</span>
          </WeekDayButton>
        );
      })}
    </WeekSelectorContainer>
  );
};
