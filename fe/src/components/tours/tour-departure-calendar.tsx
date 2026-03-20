"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { formatCurrencyVnd, formatDateVi } from "@/lib/format";
import { TourDeparture } from "@/types/travel";

interface TourDepartureCalendarProps {
  tourId: number;
  departures: TourDeparture[];
}

const WEEKDAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

function toMonthKey(dateValue: string): string {
  return dateValue.slice(0, 7);
}

function monthLabel(monthKey: string): string {
  const [year, month] = monthKey.split("-").map(Number);
  const value = new Date(year, month - 1, 1);
  return new Intl.DateTimeFormat("vi-VN", { month: "long", year: "numeric" }).format(value);
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

export function TourDepartureCalendar({ tourId, departures }: TourDepartureCalendarProps) {
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
  const [selectedMonthKey, setSelectedMonthKey] = useState<string>(monthKeys[0] ?? "");
  const [selectedDepartureId, setSelectedDepartureId] = useState<number | null>(null);

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

  const effectiveSelectedDepartureId = monthDepartures.some((item) => item.id === selectedDepartureId)
    ? selectedDepartureId
    : (monthDepartures[0]?.id ?? null);

  const selectedDeparture =
    monthDepartures.find((item) => item.id === effectiveSelectedDepartureId) ?? null;

  if (sortedDepartures.length === 0) {
    return (
      <section className="rounded-3xl border border-dashed border-[#9ed8c5] bg-white p-6 text-sm text-[#2f5b4d]">
        Hiện chưa có lịch khởi hành cho tour này. Bạn quay lại sau nhé.
      </section>
    );
  }

  const [year, month] = effectiveMonthKey.split("-").map(Number);
  const cells = Number.isFinite(year) && Number.isFinite(month) ? buildCalendarCells(year, month) : [];

  return (
    <section className="space-y-5 rounded-3xl border border-[#ccebe0] bg-white p-6 md:p-8">
      <h2 className="text-2xl font-bold text-[#083b2d]">Lịch khởi hành</h2>

      <div className="grid gap-4 lg:grid-cols-[180px_1fr]">
        <div className="rounded-2xl border border-[#dbf2e9] bg-[#f8fff9] p-3">
          <p className="px-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#0a7d59]">Chọn tháng</p>
          <div className="mt-3 flex flex-wrap gap-2 lg:flex-col">
            {monthKeys.map((monthKey) => (
              <button
                key={monthKey}
                type="button"
                onClick={() => {
                  setSelectedMonthKey(monthKey);
                  setSelectedDepartureId(null);
                }}
                className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${monthKey === effectiveMonthKey
                    ? "bg-[#0a7d59] text-white"
                    : "border border-[#9dd6c2] bg-white text-[#0a7d59] hover:bg-[#ebfff6]"
                  }`}
              >
                {monthLabel(monthKey)}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[#dbf2e9] p-4">
          <p className="text-center text-xl font-bold uppercase text-[#0a68a4]">{monthLabel(effectiveMonthKey)}</p>

          <div className="mt-4 grid grid-cols-7 gap-2 text-center text-xs font-semibold uppercase text-[#2f5a4d]">
            {WEEKDAYS.map((weekday) => (
              <div key={weekday}>{weekday}</div>
            ))}
          </div>

          <div className="mt-2 grid grid-cols-7 gap-2">
            {cells.map((day, index) => {
              if (!day) {
                return <div key={`blank-${index}`} className="h-16 rounded-lg bg-transparent" />;
              }

              const departure = departureByDay.get(day);
              const isSelected = departure?.id === effectiveSelectedDepartureId;

              if (!departure) {
                return (
                  <button
                    key={`day-${day}`}
                    type="button"
                    disabled
                    className="h-16 rounded-lg border border-transparent bg-[#f5f8f6] text-sm text-[#9bb6ad]"
                  >
                    {day}
                  </button>
                );
              }

              return (
                <button
                  key={`day-${day}`}
                  type="button"
                  onClick={() => setSelectedDepartureId(departure.id)}
                  className={`h-16 rounded-lg border p-1 text-center transition ${isSelected
                      ? "border-[#0a7d59] bg-[#e7fff4]"
                      : "border-[#bde6d6] bg-white hover:border-[#0a7d59]"
                    }`}
                >
                  <p className="text-sm font-semibold text-[#184b3d]">{day}</p>
                  <p className="text-[11px] font-bold text-[#d91f00]">{formatCurrencyVnd(departure.price)}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {selectedDeparture ? (
        <div className="space-y-4 rounded-2xl border border-[#b9e4d3] bg-[#f0fff7] p-5">
          <h3 className="text-lg font-semibold text-[#0b3f30]">Thông tin chuyến đã chọn</h3>
          <div className="grid gap-2 text-sm text-[#245145] md:grid-cols-2">
            <p>Ngày đi: {formatDateVi(selectedDeparture.departureDate)}</p>
            <p>Ngày về: {formatDateVi(selectedDeparture.returnDate)}</p>
            <p>Giá: {formatCurrencyVnd(selectedDeparture.price)} / khách</p>
            <p>Còn lại: {selectedDeparture.slotsAvailable} / {selectedDeparture.slotsTotal} chỗ</p>
          </div>

          <Link
            href={`/bookings?tourId=${tourId}&departureId=${selectedDeparture.id}`}
            className="inline-flex rounded-full bg-[#0a7d59] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#085a41]"
          >
            Đặt chuyến này
          </Link>
        </div>
      ) : null}
    </section>
  );
}
