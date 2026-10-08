import { useEffect, useState } from "react";

import "../App.css";
import "./GitHub.css";

type GitHubData = {
  totalContributions: number;
  weeks: {
    contributionDays: {
      date: string;
      contributionCount: number;
    }[];
  }[];
};

export default function GitHub() {
  const isMobile = window.innerWidth <= 768;

  const [gitHubData, setGitHubData] = useState<GitHubData>({
    totalContributions: 0,
    weeks: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const parseUtcDate = (dateString: string) => {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(Date.UTC(year, month - 1, day));
  };

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        const response = await fetch("/api/github-contributions", {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Contribution request failed");
        const data: GitHubData = await response.json();
        if (
          !Array.isArray(data.weeks) ||
          typeof data.totalContributions !== "number"
        ) {
          throw new Error("Invalid contribution response");
        }
        if (!controller.signal.aborted) setGitHubData(data);
      } catch {
        if (!controller.signal.aborted) {
          setError(
            "Unable to load GitHub contributions. Please try again later.",
          );
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    void fetchData();
    return () => controller.abort();
  }, []);

  const gitHubWeeks = gitHubData.weeks.map((week, weekIndex) => {
    const monthsOfYear = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const firstDayOfWeek = week.contributionDays[0];
    const firstDayOfWeekDate = parseUtcDate(firstDayOfWeek.date);
    const firstDayOfWeekDay = firstDayOfWeekDate.getUTCDate();
    const firstDayOfWeekMonth = firstDayOfWeekDate.getUTCMonth();

    const previousWeek = gitHubData.weeks[weekIndex - 1];
    const previousWeekFirstDay = previousWeek?.contributionDays[0];
    const previousWeekMonth = previousWeekFirstDay
      ? parseUtcDate(previousWeekFirstDay.date).getUTCMonth()
      : null;

    let monthLabel = "";
    if (firstDayOfWeekDay <= 7 && previousWeekMonth !== firstDayOfWeekMonth) {
      monthLabel = monthsOfYear[firstDayOfWeekMonth];
    }
    return (
      <div
        key={weekIndex}
        className="gitHubContributionWeek"
        style={{
          justifyContent: `${weekIndex === 0 ? "flex-end" : "flex-start"}`,
        }}
      >
        <span
          style={{
            position: "relative",
            height: 0,
            width: 0,
            bottom: `${ !isMobile ? monthLabel !== "Jan" ? "1.5rem" : "calc((4 / 7) * 100% + 1.5rem)" : monthLabel !== 'Jan' ? '1rem': 'calc((4 / 7) * 100% + 1rem)'}`,
            // Bottom is imperfect, but very close for now
          }}
        >
          {monthLabel}
        </span>
        {week.contributionDays.map((day, dayIndex) => {
          // const contributionColorsLight = [
          //   "#ebedf0",
          //   "#9be9a8",
          //   "#40c463",
          //   "#30a14e",
          //   "#216e39",
          // ];
          const contributionColorsDark = [
            "#2121219d",
            "#0e4429",
            "#006d32",
            "#26a641",
            "#39d353",
          ];
          let color = "#ebedf0";
          const contributionCount = Math.min(day.contributionCount, 4);
          if (contributionCount >= 4) {
            color = contributionColorsDark[4];
          } else {
            color = contributionColorsDark[contributionCount];
          }
          // const contributionCount = Math.min(day.contributionCount, 4);
          // const color = contributionColorsDark[contributionCount];

          return (
            <div
              key={dayIndex}
              className="gitHubContributionDay"
              style={{ backgroundColor: color }}
              title={`${day.date}: ${day.contributionCount} contributions`}
            />
          );
        })}
      </div>
    );
  });

  return (
    <div className="mainContentContainer">
      <div className="gitHubContentContainer">
        <h2 className="titleSecondary">GitHub Activity</h2>
        <div className="gitHubCalendarWrapper">
          <div className="gitHubWeekDaysWrapper">
            <span>Mon</span>
            <span>Wed</span>
            <span>Fri</span>
          </div>
          {loading ? (
            <p role="status">Loading contributions...</p>
          ) : error ? (
            <p role="alert">{error}</p>
          ) : (
            gitHubWeeks
          )}
        </div>
        {!loading && !error && (
          <p className="textSecondary">
            Year to Date Contributions: {gitHubData.totalContributions}
          </p>
        )}
        <span className="textSecondary">
          <a
            href="https://github.com/connorkormos"
            target="_blank"
            rel="noopener noreferrer"
          >
            View on GitHub
          </a>
        </span>
      </div>
    </div>
  );
}
