"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { formatCurrencyVnd, formatDateVi } from "@/lib/format";
import { TourDeparture } from "@/types/travel";

interface TourDepartureCalendarProps {
  tourId: number;
  departures: TourDeparture[];
  initialDate?: string;
}

const WEEKDAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

type MonthFormat = "long" | "short";

function toMonthKey(dateValue: string): string {
  return dateValue.slice(0, 7);
}

function monthLabel(monthKey: string, format: MonthFormat = "long"): string {
  const [year, month] = monthKey.split("-").map(Number);
  const value = new Date(year, month - 1, 1);

  if (format === "short") {
    return `${String(month).padStart(2, '0')}/${year}`;
  }

  return new Intl.DateTimeFormat("vi-VN", { month: "long", year: "numeric" }).format(value);
}

function formatCompactPrice(price: number): string {
  if (price >= 1000000) {
    const millions = price / 1000000;
    return Number.isInteger(millions) ? `${millions}tr` : `${millions.toFixed(1).replace('.', 'tr')}`;
  }
  if (price >= 1000) {
    return `${Math.round(price / 1000)}k`;
  }
  return String(price);
}

function buildCalendarCells(year: number, month: number): Array<number | null> {
  const firstDate = new Date(year, month - 1, 1);
  const totalDays = new Date(year, month, 0).getDate();
  const leading = (firstDate.getDay() + 6) % 7;

  const cells: Array<number | null> = [];
  for (let i = 0; i < leading; i += 1) {
    cells.push(null);
  }
  for (let day = 1; day <= totalDays; day += 1) {
    cells.push(day);
  }
  while (cells.length % 7 !== 0) {
    cells.push(null);
  }
  return cells;
}

export function TourDepartureCalendar({ tourId, departures, initialDate }: TourDepartureCalendarProps) {
  const router = useRouter();

  const sortedDepartures = useMemo(
    () => [...departures].sort((a, b) => a.departureDate.localeCompare(b.departureDate)),
    [departures],
  );

  const departuresByMonth = useMemo(() => {
    const grouped = new Map<string, TourDeparture[]>();
    for (const departure of sortedDepartures) {
      const key = toMonthKey(departure.departureDate);
      const existing = grouped.get(key) ?? [];
      grouped.set(key, [...existing, departure]);
    }
    return grouped;
  }, [sortedDepartures]);

  const monthKeys = useMemo(() => Array.from(departuresByMonth.keys()), [departuresByMonth]);

  const [selectedMonthKey, setSelectedMonthKey] = useState<string>(() => {
    if (initialDate && departures.length > 0) {
      const match = departures.find(d => d.departureDate === initialDate);
      if (match) return toMonthKey(match.departureDate);
    }
    return monthKeys[0] ?? "";
  });

  const selectedDepartureId = useMemo(() => {
    if (initialDate && departures.length > 0) {
      const match = departures.find(d => d.departureDate === initialDate);
      if (match) return match.id;
    }
    return null;
  }, [initialDate, departures]);

  const effectiveMonthKey = monthKeys.includes(selectedMonthKey) ? selectedMonthKey : (monthKeys[0] ?? "");

  const monthDepartures = useMemo(
    () => departuresByMonth.get(effectiveMonthKey) ?? [],
    [departuresByMonth, effectiveMonthKey],
  );

  const departureByDay = useMemo(() => {
    const map = new Map<number, TourDeparture>();
    for (const departure of monthDepartures) {
      const day = Number(departure.departureDate.slice(8, 10));
      map.set(day, departure);
    }
    return map;
  }, [monthDepartures]);

  const effectiveSelectedDepartureId = selectedDepartureId;

  const selectedDeparture =
    monthDepartures.find((item) => item.id === effectiveSelectedDepartureId) ?? null;

  if (sortedDepartures.length === 0) {
    return (
      <section className="rounded-3xl border border-dashed border-[#9ed8c5] bg-white p-6 text-base text-[#2f5b4d]">
        Hiện chưa có lịch khởi hành cho tour này. Bạn quay lại sau nhé.
      </section>
    );
  }

  const [year, month] = effectiveMonthKey.split("-").map(Number);
  const cells = Number.isFinite(year) && Number.isFinite(month) ? buildCalendarCells(year, month) : [];

  return (
    <section className="space-y-5 rounded-3xl border border-[#ccebe0] bg-white p-6 md:p-8">
      <h2 className="text-3xl font-bold text-[#083b2d]">Lịch khởi hành</h2>

      <div className="grid gap-4 lg:grid-cols-[140px_1fr]">
        <div className="rounded-2xl border border-[#dbf2e9] bg-[#f8fff9] p-3">
          <p className="px-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#0a7d59]">Chọn tháng</p>
          <div className="mt-3 flex flex-wrap gap-2 lg:flex-col">
            {monthKeys.map((monthKey) => (
              <button
                key={monthKey}
                type="button"
                onClick={() => {
                  setSelectedMonthKey(monthKey);
                }}
                className={`cursor-pointer rounded-xl px-3 py-3 text-base font-semibold transition ${monthKey === effectiveMonthKey
                  ? "bg-[#0a7d59] text-white"
                  : "border border-[#9dd6c2] bg-white text-[#0a7d59] hover:bg-[#ebfff6]"
                  }`}
              >
                {monthLabel(monthKey, "short")}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[#dbf2e9] p-4">
          <p className="text-center text-2xl font-bold uppercase text-[#0a68a4]">{monthLabel(effectiveMonthKey)}</p>

          <div className="mt-4 grid grid-cols-7 gap-2 text-center text-sm font-semibold uppercase text-[#2f5a4d]">
            {WEEKDAYS.map((weekday) => (
              <div key={weekday}>{weekday}</div>
            ))}
          </div>

          <div className="mt-2 grid grid-cols-7 gap-2">
            {cells.map((day, index) => {
              if (!day) {
                return <div key={`blank-${index}`} className="aspect-square rounded-lg bg-transparent" />;
              }

              const departure = departureByDay.get(day);
              const isSelected = departure?.id === effectiveSelectedDepartureId;

              if (!departure) {
                return (
                  <button
                    key={`day-${day}`}
                    type="button"
                    disabled
                    className="aspect-square rounded-lg border border-transparent bg-[#f5f8f6] flex flex-col items-center justify-center text-base text-[#9bb6ad]"
                  >
                    {day}
                  </button>
                );
              }

              return (
                <button
                  key={`day-${day}`}
                  type="button"
                  onClick={() => router.push(`?date=${departure.departureDate}#lich-khoi-hanh`, { scroll: false })}
                  className={`aspect-square rounded-lg border flex flex-col items-center justify-center p-1 transition ${isSelected
                    ? "border-[#0a7d59] bg-[#e7fff4] shadow-sm transform scale-105 z-10"
                    : "border-[#bde6d6] bg-white hover:border-[#0a7d59] hover:shadow-md hover:-translate-y-1"
                    }`}
                >
                  <span className="text-xl md:text-2xl font-bold text-[#184b3d]">{day}</span>
                  <span className="text-[10px] md:text-[11px] font-bold text-[#d91f00] truncate w-full px-1">{formatCompactPrice(departure.price)}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

    </section>
  );
}
