"use client";

import "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale/en-US";

const locales = {
    "en-US": enUS,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

type Props = {
    events: {
        title: string;
        start: Date;
        end: Date;
    }[];
};

export function PaymentsCalendar({ events }: Props) {
    return (
        <div className="h-175 rounded-lg border border-zinc-200 bg-white p-4">
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
            />
        </div>
    );
}
