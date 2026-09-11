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
  ScoreHistoryItem,
  TrustProfile,
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

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-[#E2EAF2] rounded-xl px-4 py-3 shadow-lg">
        <p className="text-xs text-[#64748B] mb-1">
          {payload[0]?.payload?.date}
        </p>

        <p className="text-lg font-bold text-[#0D2D52] font-['JetBrains_Mono',monospace]">
          {payload[0].value}
        </p>

        <p className="text-xs text-[#94A3B8]">TrustID Score</p>
      </div>
    );
  }

  return null;
};

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(dateString));
}

function formatMonth(dateString: string) {
  return new Intl.DateTimeFormat("en-NG", {
    month: "short",
  }).format(new Date(dateString));
}

function getFilterStartDate(filter: string) {
  const now = new Date();

  switch (filter) {
    case "7 days":
      now.setDate(now.getDate() - 7);
      break;

    case "30 days":
      now.setDate(now.getDate() - 30);
      break;

    case "6 months":
      now.setMonth(now.getMonth() - 6);
      break;

    case "1 year":
      now.setFullYear(now.getFullYear() - 1);
      break;

    default:
      return null;
  }

  return now;
}

function getMilestoneNote(
  previousScore: number | null,
  currentScore: number
) {
  if (previousScore === null) {
    return null;
  }

  const thresholds = [
    {
      score: 800,
      note: "Reached Excellent financial profile",
    },
    {
      score: 700,
      note: "Reached Strong financial profile",
    },
    {
      score: 600,
      note: "Reached Good financial profile",
    },
    {
      score: 500,
      note: "Reached Fair financial profile",
    },
    {
      score: 400,
      note: "Reached Developing financial profile",
    },
  ];

  for (const threshold of thresholds) {
    if (
      previousScore < threshold.score &&
      currentScore >= threshold.score
    ) {
      return threshold.note;
    }
  }

  return null;
}

export default function ScoreHistoryPage({ navigate }: Props) {
  const [filter, setFilter] = useState("6 months");
  const [history, setHistory] = useState<ScoreHistoryItem[]>([]);
  const [profile, setProfile] = useState<TrustProfile | null>(null);

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
        if (!mounted) return;

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load your score history."
        );
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

    /*
     * Always include the latest score so the user can see
     * their current position even if the selected period
     * has no recent recalculation.
     */
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
      .map((item, index) => {
        const previous =
          index > 0 ? history[index - 1].score : null;

        return {
          ...item,
          milestone: getMilestoneNote(previous, item.score),
        };
      })
      .filter((item) => item.milestone);
  }, [history]);

  if (loading) {
    return (
      <CustomerLayout current="score-history" navigate={navigate}>
        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-8">
          <div className="mb-8">
            <div className="h-3 w-24 bg-[#E2EAF2] rounded animate-pulse mb-2" />
            <div className="h-8 w-64 bg-[#E2EAF2] rounded animate-pulse" />
            <div className="h-4 w-96 max-w-full bg-[#E2EAF2] rounded animate-pulse mt-3" />
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            {[1, 2, 3].map((item) => (
              <Card key={item} className="text-center">
                <div className="h-3 w-16 bg-[#E2EAF2] rounded mx-auto mb-3 animate-pulse" />
                <div className="h-8 w-16 bg-[#E2EAF2] rounded mx-auto animate-pulse" />
              </Card>
            ))}
          </div>

          <Card className="mb-6">
            <div className="h-64 bg-[#F8FAFB] rounded-xl animate-pulse" />
          </Card>

          <Card>
            <div className="h-6 w-40 bg-[#E2EAF2] rounded animate-pulse mb-5" />

            <div className="space-y-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-8 bg-[#F8FAFB] rounded animate-pulse"
                />
              ))}
            </div>
          </Card>
        </div>
      </CustomerLayout>
    );
  }

  if (error) {
    return (
      <CustomerLayout current="score-history" navigate={navigate}>
        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-8">
          <Card className="text-center py-12">
            <div className="h-12 w-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <svg
                className="h-6 w-6 text-red-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
              >
                <path
                  d="M12 8v4M12 16h.01"
                  strokeLinecap="round"
                />
                <circle cx="12" cy="12" r="9" />
              </svg>
            </div>

            <h2 className="text-lg font-bold text-[#0D1F35]">
              Unable to load score history
            </h2>

            <p className="text-sm text-[#64748B] mt-2 max-w-md mx-auto">
              {error}
            </p>

            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-5 py-2.5 rounded-xl bg-[#0D2D52] text-white text-sm font-semibold hover:bg-[#163D68] transition-colors"
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
        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-8">
          <Card className="text-center py-12">
            <div className="h-14 w-14 rounded-2xl bg-[#EFF4F9] flex items-center justify-center mx-auto mb-5">
              <svg
                className="h-7 w-7 text-[#0D2D52]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  d="M4 19V5M4 19h16"
                  strokeLinecap="round"
                />
                <path
                  d="M7 15l4-4 3 2 5-6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h2 className="text-lg font-bold text-[#0D1F35]">
              Your score history isn't available yet
            </h2>

            <p className="text-sm text-[#64748B] mt-2 max-w-md mx-auto">
              Complete your financial analysis first. Once your
              TrustID Score is generated, you'll be able to track
              how it changes over time.
            </p>

            <button
              onClick={() => navigate("connect")}
              className="mt-6 px-5 py-2.5 rounded-xl bg-[#0D2D52] text-white text-sm font-semibold hover:bg-[#163D68] transition-colors"
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
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-widest mb-1">
            Score History
          </p>

          <h1 className="text-2xl font-bold text-[#0D1F35] tracking-tight">
            Your Score Over Time
          </h1>

          <p className="text-sm text-[#64748B] mt-2">
            Track how your TrustID Score has evolved with your
            financial behaviour.
          </p>
        </div>

        {/* Score summary */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="text-center">
            <p className="text-xs text-[#64748B] uppercase tracking-wide font-medium mb-1">
              Current
            </p>

            <p className="text-2xl font-bold text-[#0D1F35] font-['JetBrains_Mono',monospace]">
              {currentScore}
            </p>
          </Card>

          <Card className="text-center">
            <p className="text-xs text-[#64748B] uppercase tracking-wide font-medium mb-1">
              Previous
            </p>

            <p className="text-2xl font-bold text-[#0D1F35] font-['JetBrains_Mono',monospace]">
              {previousScore ?? "—"}
            </p>
          </Card>

          <Card className="text-center">
            <p className="text-xs text-[#64748B] uppercase tracking-wide font-medium mb-1">
              Change
            </p>

            <p
              className={`text-2xl font-bold font-['JetBrains_Mono',monospace] ${
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

        {/* Chart */}
        <Card className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <p className="text-sm font-bold text-[#0D1F35]">
              Score Progression
            </p>

            <div className="flex gap-1.5 flex-wrap">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    filter === f
                      ? "bg-[#0D2D52] text-white"
                      : "bg-[#F8FAFB] text-[#64748B] hover:bg-[#EFF4F9] border border-[#E2EAF2]"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {chartData.length > 0 ? (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{
                    top: 5,
                    right: 10,
                    left: -20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#F1F5F9"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="month"
                    tick={{
                      fontSize: 11,
                      fill: "#94A3B8",
                      fontFamily: "DM Sans",
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    domain={[0, 850]}
                    tick={{
                      fontSize: 11,
                      fill: "#94A3B8",
                      fontFamily: "JetBrains Mono",
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip content={<CustomTooltip />} />

                  <ReferenceLine
                    y={700}
                    stroke="#E2EAF2"
                    strokeDasharray="4 4"
                  />

                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#0D2D52"
                    strokeWidth={2.5}
                    dot={{
                      fill: "#0D2D52",
                      r: 4,
                      strokeWidth: 0,
                    }}
                    activeDot={{
                      fill: "#10B981",
                      r: 6,
                      strokeWidth: 0,
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-56 flex items-center justify-center">
              <p className="text-sm text-[#94A3B8]">
                No score updates were recorded during this period.
              </p>
            </div>
          )}

          <p className="text-xs text-[#94A3B8] text-center mt-2">
            700 threshold line shown for reference
          </p>
        </Card>

        {/* Score breakdown */}
        <Card className="mb-6">
          <p className="text-sm font-bold text-[#0D1F35] mb-4">
            Score Updates
          </p>

          <div className="space-y-0">
            {[...filteredHistory]
              .reverse()
              .map((row, reverseIndex) => {
                const originalIndex = history.findIndex(
                  (item) => item._id === row._id
                );

                const previous =
                  originalIndex > 0
                    ? history[originalIndex - 1].score
                    : null;

                const diff =
                  row.change ??
                  (previous !== null
                    ? row.score - previous
                    : 0);

                const milestone = getMilestoneNote(
                  previous,
                  row.score
                );

                return (
                  <div
                    key={row._id}
                    className={`flex items-center gap-4 py-3 ${
                      reverseIndex <
                      filteredHistory.length - 1
                        ? "border-b border-[#F1F5F9]"
                        : ""
                    }`}
                  >
                    <div className="w-20 shrink-0">
                      <p className="text-sm font-semibold text-[#64748B]">
                        {formatMonth(row.createdAt)}
                      </p>

                      <p className="text-[10px] text-[#94A3B8]">
                        {formatDate(row.createdAt)}
                      </p>
                    </div>

                    <p className="text-sm font-bold text-[#0D1F35] font-['JetBrains_Mono',monospace] w-10">
                      {row.score}
                    </p>

                    <div className="flex-1 min-w-0">
                      {milestone ? (
                        <span className="inline-flex items-center gap-1 text-xs bg-[#EFF4F9] text-[#0D2D52] border border-[#C8D9EC] px-2 py-0.5 rounded-full font-medium">
                          🏅 {milestone}
                        </span>
                      ) : (
                        <p className="text-xs text-[#94A3B8] truncate">
                          {row.reason}
                        </p>
                      )}
                    </div>

                    <span
                      className={`text-xs font-bold font-['JetBrains_Mono',monospace] ${
                        diff > 0
                          ? "text-[#10B981]"
                          : diff < 0
                            ? "text-red-500"
                            : "text-[#94A3B8]"
                      }`}
                    >
                      {diff > 0 ? "+" : ""}
                      {diff}
                    </span>
                  </div>
                );
              })}
          </div>
        </Card>

        {/* Milestones */}
        {milestoneRows.length > 0 && (
          <Card>
            <p className="text-sm font-bold text-[#0D1F35] mb-4">
              Score Milestones
            </p>

            <div className="space-y-3">
              {[...milestoneRows]
                .reverse()
                .map((milestone) => (
                  <div
                    key={milestone._id}
                    className="flex items-center gap-3"
                  >
                    <div className="h-8 w-8 rounded-full bg-[#EFF4F9] flex items-center justify-center text-sm">
                      🏅
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-[#0D1F35]">
                        {milestone.milestone}
                      </p>

                      <p className="text-xs text-[#94A3B8]">
                        {formatDate(milestone.createdAt)} ·
                        Score reached {milestone.score}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </Card>
        )}
      </div>
    </CustomerLayout>
  );
}