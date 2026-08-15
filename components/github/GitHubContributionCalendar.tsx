"use client";

import {
  useEffect,
  useState,
} from "react";

type ContributionDay = {
  date: string;
  contributionCount: number;
  contributionLevel: string;
  color: string;
  weekday: number;
};

type ContributionWeek = {
  firstDay: string;
  contributionDays:
    ContributionDay[];
};

type ContributionMonth = {
  name: string;
  firstDay: string;
  totalWeeks: number;
  year: number;
};

type Calendar = {
  totalContributions: number;
  colors: string[];
  months:
    ContributionMonth[];
  weeks:
    ContributionWeek[];
};

type ContributionResponse = {
  year: number;
  contributionYears: number[];
  calendar: Calendar;
};

export default function GitHubContributionCalendar() {
  const currentYear =
    new Date().getFullYear();

  const [
    selectedYear,
    setSelectedYear,
  ] =
    useState(currentYear);

  const [
    data,
    setData,
  ] =
    useState<ContributionResponse | null>(
      null
    );

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);

      const response =
        await fetch(
          `/api/github/contributions?year=${selectedYear}`,
          {
            cache: "no-store",
          }
        );

      const json =
        await response.json();

      console.log(
        "Contribution response:",
        json
      );

      setData(json);

      setLoading(false);
    }

    load();
  }, [selectedYear]);

  if (loading) {
    return (
      <div className="py-10 text-muted">
        Loading contributions...
      </div>
    );
  }

  if (!data?.calendar) {
    return (
      <div className="py-10 text-muted">
        Contribution data unavailable.
      </div>
    );
  }

  const {
    calendar,
    contributionYears,
  } = data;

  return (
    <section className="">
      <div className="grid gap-8 lg:grid-cols-[1fr_130px]">

        {/* Calendar */}
        <div>
            <div className="flex gap-4">

          <h2 className="mb-5 font-display text-xl font-semibold text-ink">
            {calendar.totalContributions} contributions in {selectedYear}
          </h2>
                  <div className=" flex gap-3 mb-3 space-y-2">
          {contributionYears.map(
            (year) => (
              <button
                key={year}
                type="button"
                onClick={() =>
                  setSelectedYear(
                    year
                  )
                }
                className={`
                  w-full
                  rounded-lg
                  px-4
                  py-1
                  text-left
                  text-sm
                  transition-all

                  ${
                    selectedYear ===
                    year
                      ? "bg-teal text-base font-semibold"
                      : "text-muted hover:bg-surface hover:text-ink"
                  }
                `}
              >
                {year}
              </button>
            )
          )}
        </div>

            </div>

          <div className="overflow-x-auto rounded-2xl border border-border bg-surface/50 p-6">

            {/* Month labels */}
            <div className="ml-9 flex gap-1">
              {calendar.months.map(
                (month) => (
                  <div
                    key={
                      month.firstDay
                    }
                    style={{
                      width:
                        month.totalWeeks *
                        16,
                    }}
                    className="text-xs text-muted"
                  >
                    {month.name.slice(
                      0,
                      3
                    )}
                  </div>
                )
              )}
            </div>

            <div className="mt-2 flex gap-2">

              {/* Week day labels */}
              <div className="grid grid-rows-7 gap-1 text-[10px] text-muted">
                <span />
                <span>Mon</span>
                <span />
                <span>Wed</span>
                <span />
                <span>Fri</span>
                <span />
              </div>

              {/* Contribution grid */}
              <div className="flex gap-1">
                {calendar.weeks.map(
                  (
                    week,
                    weekIndex
                  ) => (
                    <div
                      key={
                        week.firstDay
                      }
                      className="grid grid-rows-7 gap-1"
                    >
                      {week.contributionDays.map(
                        (day) => (
                          <div
                            key={
                              day.date
                            }
                            title={`${day.contributionCount} contribution${
                              day.contributionCount ===
                              1
                                ? ""
                                : "s"
                            } on ${day.date}`}
                            className="
                              h-3
                              w-3
                              rounded-[2px]
                              border
                              border-black/5
                              transition-transform
                              hover:scale-150
                            "
                            style={{
                              backgroundColor:
                                day.color,
                            }}
                          />
                        )
                      )}
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Legend */}
            <div className="mt-5 flex items-center justify-end gap-1 text-[10px] text-muted">
              <span className="mr-1">
                Less
              </span>

              <span className="h-3 w-3 rounded-[2px] border border-border bg-surface" />

              {calendar.colors.map(
                (
                  color
                ) => (
                  <span
                    key={color}
                    className="h-3 w-3 rounded-[2px]"
                    style={{
                      backgroundColor:
                        color,
                    }}
                  />
                )
              )}

              <span className="ml-1">
                More
              </span>
            </div>
          </div>
        </div>

        {/* Year filter */}
        {/* <div className="space-y-2">
          {contributionYears.map(
            (year) => (
              <button
                key={year}
                type="button"
                onClick={() =>
                  setSelectedYear(
                    year
                  )
                }
                className={`
                  w-full
                  rounded-lg
                  px-4
                  py-3
                  text-left
                  text-sm
                  transition-all

                  ${
                    selectedYear ===
                    year
                      ? "bg-teal text-base font-semibold"
                      : "text-muted hover:bg-surface hover:text-ink"
                  }
                `}
              >
                {year}
              </button>
            )
          )}
        </div> */}
      </div>
    </section>
  );
}