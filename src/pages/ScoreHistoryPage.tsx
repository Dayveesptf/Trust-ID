import { useEffect, useMemo, useState } from "react";
import { CustomerLayout } from "../components/Layout";
import { Card } from "../components/ui";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import {
  getScoreHistory,
  getTrustProfile,
  type ScoreHistoryItem,
  type TrustProfile,
} from "../services/financialProfileService";

interface Props {
  navigate: (s: string) => void;
}

const filters = ["7 days", "30 days", "6 months", "1 year"];

interface ChartPoint {
  date: string;
  month: string;
  score: number;
  createdAt: string;
}

function formatDate(dateString: string) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatMonth(dateString: string) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-NG", {
    month: "short",
  }).format(date);
}

function getFilterStartDate(filter: string) {
  const date = new Date();

  switch (filter) {
    case "7 days":
      date.setDate(date.getDate() - 7);
      break;

    case "30 days":
      date.setDate(date.getDate() - 30);
      break;

    case "6 months":
      date.setMonth(date.getMonth() - 6);
      break;

    case "1 year":
      date.setFullYear(date.getFullYear() - 1);
      break;

    default:
      return null;
  }

  return date;
}

function getMilestoneNote(
  previousScore: number | null,
  currentScore: number
) {
  if (previousScore === null) return null;

  const thresholds = [
    [800, "Reached Excellent financial profile"],
    [700, "Reached Strong financial profile"],
    [600, "Reached Good financial profile"],
    [500, "Reached Fair financial profile"],
    [400, "Reached Developing financial profile"],
  ] as const;

  for (const [threshold, note] of thresholds) {
    if (
      previousScore < threshold &&
      currentScore >= threshold
    ) {
      return note;
    }
  }

  return null;
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{
    value?: number;
    payload?: ChartPoint;
  }>;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-white border border-[#E2EAF2] rounded-xl px-4 py-3 shadow-lg">
      <p className="text-xs text-[#64748B] mb-1">
        {payload[0]?.payload?.date}
      </p>

      <p className="text-lg font-bold text-[#0D2D52]">
        {payload[0]?.value}
      </p>

      <p className="text-xs text-[#94A3B8]">
        TrustID Score
      </p>
    </div>
  );
}

export default function ScoreHistoryPage({
  navigate,
}: Props) {
  const [filter, setFilter] = useState("6 months");
  const [history, setHistory] = useState<ScoreHistoryItem[]>(
    []
  );
  const [profile, setProfile] = useState<TrustProfile | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadHistory() {
      try {
        setLoading(true);
        setError("");

        const [historyData, profileData] = await Promise.all([
          getScoreHistory(),
          getTrustProfile(),
        ]);

        if (!mounted) return;

        setHistory(historyData || []);
        setProfile(profileData);
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load your score history."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadHistory();

    return () => {
      mounted = false;
    };
  }, []);

  const filteredHistory = useMemo(() => {
    if (!history.length) return [];

    const startDate = getFilterStartDate(filter);

    if (!startDate) return history;

    const filtered = history.filter(
      (item) => new Date(item.createdAt) >= startDate
    );

    const latest = history[history.length - 1];

    if (
      latest &&
      !filtered.some((item) => item._id === latest._id)
    ) {
      return [...filtered, latest];
    }

    return filtered;
  }, [history, filter]);

  const chartData: ChartPoint[] = useMemo(() => {
    return filteredHistory.map((item) => ({
      date: formatDate(item.createdAt),
      month: formatMonth(item.createdAt),
      score: item.score,
      createdAt: item.createdAt,
    }));
  }, [filteredHistory]);

  const currentScore =
    profile?.totalScore ??
    history[history.length - 1]?.score ??
    0;

  const previousScore =
    history.length > 1
      ? history[history.length - 2].score
      : null;

  const currentChange =
    history.length > 0
      ? history[history.length - 1].change
      : 0;

  const milestoneRows = useMemo(() => {
    return history
      .map((item, index) => ({
        ...item,
        milestone: getMilestoneNote(
          index > 0 ? history[index - 1].score : null,
          item.score
        ),
      }))
      .filter((item) => item.milestone);
  }, [history]);

  if (loading) {
    return (
      <CustomerLayout current="score-history" navigate={navigate}>
        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-8 space-y-5 animate-pulse">
          <div className="h-8 w-64 bg-[#E2EAF2] rounded" />

          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((item) => (
              <Card key={item}>
                <div className="h-16 bg-[#F8FAFB] rounded" />
              </Card>
            ))}
          </div>

          <Card>
            <div className="h-72 bg-[#F8FAFB] rounded-xl" />
          </Card>
        </div>
      </CustomerLayout>
    );
  }

  if (error) {
    return (
      <CustomerLayout current="score-history" navigate={navigate}>
        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-10">
          <Card className="text-center py-12">
            <h2 className="text-lg font-bold text-[#0D1F35]">
              Unable to load score history
            </h2>

            <p className="text-sm text-[#64748B] mt-2">
              {error}
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 rounded-xl bg-[#0D2D52] px-5 py-3 text-sm font-semibold text-white"
            >
              Try Again
            </button>
          </Card>
        </div>
      </CustomerLayout>
    );
  }

  if (!profile || !history.length) {
    return (
      <CustomerLayout current="score-history" navigate={navigate}>
        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-10">
          <Card className="text-center py-12">
            <div className="text-3xl mb-4">📈</div>

            <h2 className="text-lg font-bold text-[#0D1F35]">
              Your score history isn't available yet
            </h2>

            <p className="text-sm text-[#64748B] mt-2 max-w-md mx-auto">
              Complete your financial analysis first. Once your
              TrustID Score is generated, you will be able to
              track how it changes over time.
            </p>

            <button
              type="button"
              onClick={() => navigate("connect")}
              className="mt-6 rounded-xl bg-[#0D2D52] px-5 py-3 text-sm font-semibold text-white"
            >
              Start Analysis
            </button>
          </Card>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout current="score-history" navigate={navigate}>
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-8">
        <div className="mb-8">
          <button
            type="button"
            onClick={() => navigate("dashboard")}
            className="text-sm text-[#64748B] hover:text-[#0D2D52]"
          >
            ← Back to dashboard
          </button>

          <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-widest mt-6">
            Score History
          </p>

          <h1 className="text-2xl font-bold text-[#0D1F35] mt-1">
            Your Score Over Time
          </h1>

          <p className="text-sm text-[#64748B] mt-2">
            Track how your TrustID Score has evolved with your
            financial behaviour.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="text-center">
            <p className="text-xs text-[#64748B] uppercase tracking-wide">
              Current
            </p>

            <p className="text-2xl font-bold text-[#0D1F35] mt-1">
              {currentScore}
            </p>
          </Card>

          <Card className="text-center">
            <p className="text-xs text-[#64748B] uppercase tracking-wide">
              Previous
            </p>

            <p className="text-2xl font-bold text-[#0D1F35] mt-1">
              {previousScore ?? "—"}
            </p>
          </Card>

          <Card className="text-center">
            <p className="text-xs text-[#64748B] uppercase tracking-wide">
              Change
            </p>

            <p
              className={`text-2xl font-bold mt-1 ${
                currentChange > 0
                  ? "text-[#10B981]"
                  : currentChange < 0
                  ? "text-red-500"
                  : "text-[#64748B]"
              }`}
            >
              {currentChange > 0 ? "+" : ""}
              {currentChange}
            </p>
          </Card>
        </div>

        <Card className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <p className="text-sm font-bold text-[#0D1F35]">
                Score Progression
              </p>

              <p className="text-xs text-[#94A3B8] mt-1">
                Your TrustID Score over the selected period
              </p>
            </div>

            <div className="flex gap-1.5 flex-wrap">
              {filters.map((item) => (
                <button
                  type="button"
                  key={item}
                  onClick={() => setFilter(item)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    filter === item
                      ? "bg-[#0D2D52] text-white"
                      : "bg-[#F8FAFB] text-[#64748B] border border-[#E2EAF2]"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {chartData.length > 0 ? (
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#E2EAF2"
                  />

                  <XAxis
                    dataKey="month"
                    tick={{
                      fontSize: 11,
                      fill: "#94A3B8",
                    }}
                  />

                  <YAxis
                    domain={[0, 850]}
                    tick={{
                      fontSize: 11,
                      fill: "#94A3B8",
                    }}
                  />

                  <Tooltip content={<CustomTooltip />} />

                  <ReferenceLine
                    y={700}
                    stroke="#D7E5F2"
                    strokeDasharray="4 4"
                  />

                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#0D2D52"
                    strokeWidth={3}
                    dot={{
                      r: 4,
                      fill: "#0D2D52",
                    }}
                    activeDot={{
                      r: 6,
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-sm text-[#64748B]">
                No scores were recorded during this period.
              </p>
            </div>
          )}
        </Card>

        <Card className="mb-6">
          <h2 className="text-sm font-bold text-[#0D1F35] mb-5">
            Score Records
          </h2>

          <div className="divide-y divide-[#E2EAF2]">
            {filteredHistory
              .slice()
              .reverse()
              .map((item, index) => (
                <div
                  key={
                    item._id ||
                    `${item.createdAt}-${index}`
                  }
                  className="py-4 flex items-center justify-between gap-4"
                >
                  <div>
                    <p className="text-sm font-semibold text-[#0D1F35]">
                      {item.score} / 850
                    </p>

                    <p className="text-xs text-[#64748B] mt-1">
                      {formatDate(item.createdAt)}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs font-semibold text-[#64748B]">
                      {profile.band}
                    </p>

                    <p
                      className={`text-xs mt-1 ${
                        item.change > 0
                          ? "text-emerald-600"
                          : item.change < 0
                          ? "text-red-500"
                          : "text-[#94A3B8]"
                      }`}
                    >
                      {item.change > 0 ? "+" : ""}
                      {item.change} pts
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </Card>

        {milestoneRows.length > 0 && (
          <Card>
            <h2 className="text-sm font-bold text-[#0D1F35] mb-4">
              Milestones
            </h2>

            <div className="space-y-3">
              {milestoneRows.map((item, index) => (
                <div
                  key={
                    item._id ||
                    `${item.createdAt}-milestone-${index}`
                  }
                  className="rounded-xl bg-[#F3F8FC] border border-[#D7E5F2] p-4"
                >
                  <p className="text-sm font-semibold text-[#0D2D52]">
                    {item.milestone}
                  </p>

                  <p className="text-xs text-[#64748B] mt-1">
                    Score: {item.score} ·{" "}
                    {formatDate(item.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        )}

        <div className="mt-6 text-center">
          <p className="text-xs text-[#94A3B8]">
            TrustID provides an explainable view of financial
            behaviour. It is not a lending decision.
          </p>
        </div>
      </div>
    </CustomerLayout>
  );
}
