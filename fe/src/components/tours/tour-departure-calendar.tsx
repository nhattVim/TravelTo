"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { formatCurrencyVnd, formatDateVi } from "@/lib/format";
import { TourDeparture } from "@/types/travel";
import { TourTransportTimeline } from "./tour-transport-timeline";

interface TourDepartureCalendarProps {
  departures: TourDeparture[];
  initialDate?: string;
  departureLocation?: string;
  destinationLocation?: string;
  transportText?: string;
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

export function TourDepartureCalendar({ 
  departures, 
  initialDate,
  departureLocation,
  destinationLocation,
  transportText
}: TourDepartureCalendarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateDateInUrl = useCallback(
    (date: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (date) {
        params.set("date", date);
      } else {
        params.delete("date");
      }
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

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

  const initialDepartureId = useMemo(() => {
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

  const [localSelectedId, setLocalSelectedId] = useState<number | null>(initialDepartureId);

  const effectiveSelectedDepartureId = localSelectedId;

  const selectedDeparture =
    monthDepartures.find((item) => item.id === effectiveSelectedDepartureId) ?? null;

  const handleSelectDeparture = useCallback(
    (departure: TourDeparture) => {
      setLocalSelectedId(departure.id);
      updateDateInUrl(departure.departureDate);
    },
    [updateDateInUrl],
  );

  const handleClearSelection = useCallback(() => {
    setLocalSelectedId(null);
    updateDateInUrl(null);
  }, [updateDateInUrl]);

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

      {selectedDeparture ? (
        <div className="rounded-2xl border border-[#dbf2e9] bg-[#f8fff9] p-6 animate-in slide-in-from-bottom-4 fade-in duration-300">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#dbf2e9] pb-4 mb-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0a7d59]">Ngày khởi hành đã chọn</p>
              <p className="text-2xl font-bold text-[#083b2d] mt-1">{formatDateVi(selectedDeparture.departureDate)}</p>
            </div>
            <button
              onClick={handleClearSelection}
              className="text-sm font-semibold text-[#0a7d59] hover:underline whitespace-nowrap"
            >
              ← Chọn ngày khác
            </button>
          </div>
          
          <div className="mb-8">
            <TourTransportTimeline 
              departureLocation={departureLocation || ""}
              destinationLocation={destinationLocation || ""}
              transportText={transportText || ""}
              departureDate={selectedDeparture.departureDate}
              returnDate={selectedDeparture.returnDate}
              embedded={true}
            />
          </div>

          <div className="space-y-4 border-t border-[#dbf2e9] pt-8">
            {selectedDeparture.slotsAvailable > 0 ? (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-[#bde6d6] bg-gradient-to-r from-[#e7fff4] to-[#f8fff9] px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0a7d59] text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                    </svg>
                  </span>
                  <span className="text-base font-bold text-[#0a7d59]">Số chỗ còn nhận</span>
                </div>
                <span className="text-2xl font-bold text-[#0a7d59]">{selectedDeparture.slotsAvailable} chỗ</span>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-[#f5b9b0] bg-gradient-to-r from-[#ffeae6] to-[#fff5f3] px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#db2200] text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                    </svg>
                  </span>
                  <span className="text-base font-bold text-[#db2200]">Trạng thái</span>
                </div>
                <span className="text-2xl font-bold text-[#db2200]">Đã hết chỗ</span>
              </div>
            )}

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-xl bg-white p-4 border border-[#eafbf3] text-center">
                <p className="text-sm text-[#285447] font-medium">Người lớn</p>
                <p className="mt-2 text-lg font-bold text-[#db2200]">{formatCurrencyVnd(selectedDeparture.price)}</p>
              </div>
              <div className="rounded-xl bg-white p-4 border border-[#eafbf3] text-center">
                <p className="text-sm text-[#285447] font-medium">Trẻ em <span className="text-xs text-[#7a9a8e]">(5-11 tuổi)</span></p>
                <p className="mt-2 text-lg font-bold text-[#db2200]">{formatCurrencyVnd(selectedDeparture.price * 0.75)}</p>
              </div>
              <div className="rounded-xl bg-white p-4 border border-[#eafbf3] text-center">
                <p className="text-sm text-[#285447] font-medium">Trẻ nhỏ <span className="text-xs text-[#7a9a8e]">(2-4 tuổi)</span></p>
                <p className="mt-2 text-lg font-bold text-[#db2200]">{formatCurrencyVnd(selectedDeparture.price * 0.5)}</p>
              </div>
              <div className="rounded-xl bg-white p-4 border border-[#eafbf3] text-center">
                <p className="text-sm text-[#285447] font-medium">Em bé <span className="text-xs text-[#7a9a8e]">(Dưới 2 tuổi)</span></p>
                <p className="mt-2 text-lg font-bold text-[#0a7d59]">Miễn phí</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
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
                  onClick={() => handleSelectDeparture(departure)}
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
      )}

    </section>
  );
}
