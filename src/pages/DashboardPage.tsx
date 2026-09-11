import { useEffect, useMemo, useState } from "react";

import { CustomerLayout } from "../components/Layout";
import {
  Card,
  Badge,
  ProgressBar,
  ScoreRing,
  getLevelVariant,
  getLevelColor,
} from "../components/ui";

import { useAuth } from "../context/AuthContext";

import {
  getScoreHistory,
  getTrustProfile,
  type ScoreHistoryItem,
  type TrustProfile,
} from "../services/financialProfileService";

interface Props {
  navigate: (s: string) => void;
}

interface DisplayFactor {
  id: string;
  label: string;
  score: number;
  max: number;
  percentage: number;
  level: string;
}

function getFactorLevel(percentage: number): string {
  if (percentage >= 90) return "Excellent";
  if (percentage >= 75) return "Strong";
  if (percentage >= 60) return "Good";
  if (percentage >= 40) return "Fair";
  return "Developing";
}

function formatDate(dateString?: string) {
  if (!dateString) return "—";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getInitials(firstName?: string, lastName?: string) {
  return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
}

export default function DashboardPage({ navigate }: Props) {
  const { user } = useAuth();

  const [profile, setProfile] = useState<TrustProfile | null>(null);
  const [history, setHistory] = useState<ScoreHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadDashboard = async () => {
      setLoading(true);
      setError("");

      try {
        const [trustProfile, scoreHistory] = await Promise.all([
          getTrustProfile(),
          getScoreHistory(),
        ]);

        if (!mounted) return;

        setProfile(trustProfile);
        setHistory(scoreHistory);
      } catch (err) {
        if (!mounted) return;

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load your Trust Profile."
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  const currentScore = profile?.totalScore ?? 0;
  const maxScore = 850;

  const previousScore = useMemo(() => {
    if (history.length < 2) {
      return history[0]?.previousScore || 0;
    }

    return history[history.length - 2]?.score || 0;
  }, [history]);

  const scoreChange = useMemo(() => {
    if (!history.length) return 0;

    return history[history.length - 1]?.change || 0;
  }, [history]);

  const factors: DisplayFactor[] = useMemo(() => {
    if (!profile) return [];

    const rawFactors = [
      {
        id: "income",
        label: "Income Consistency",
        score: profile.factors.incomeConsistency.score,
        max: profile.factors.incomeConsistency.max,
      },
      {
        id: "savings",
        label: "Savings Behaviour",
        score: profile.factors.savingsBehaviour.score,
        max: profile.factors.savingsBehaviour.max,
      },
      {
        id: "repayment",
        label: "Repayment Behaviour",
        score: profile.factors.repaymentBehaviour.score,
        max: profile.factors.repaymentBehaviour.max,
      },
      {
        id: "cashflow",
        label: "Cash-flow Stability",
        score: profile.factors.cashFlowStability.score,
        max: profile.factors.cashFlowStability.max,
      },
      {
        id: "discipline",
        label: "Financial Discipline",
        score: profile.factors.financialDiscipline.score,
        max: profile.factors.financialDiscipline.max,
      },
    ];

    return rawFactors.map((factor) => {
      const percentage = Math.round(
        (factor.score / factor.max) * 100
      );

      return {
        ...factor,
        percentage,
        level: getFactorLevel(percentage),
      };
    });
  }, [profile]);

  const trendData = useMemo(() => {
    return history.slice(-7);
  }, [history]);

  const firstName = user?.firstName || "there";

  if (loading) {
    return (
      <CustomerLayout current="dashboard" navigate={navigate}>
        <div className="max-w-4xl mx-auto px-5 sm:px-8 py-8">
          <div className="mb-8">
            <div className="h-3 w-32 rounded bg-[#E2EAF2] animate-pulse mb-3" />
            <div className="h-7 w-56 rounded bg-[#E2EAF2] animate-pulse" />
          </div>

          <Card padding="none" className="mb-6 overflow-hidden">
            <div className="bg-[#0D2D52] px-6 pt-8 pb-8 sm:px-8">
              <div className="flex flex-col sm:flex-row items-center gap-8">
                <div className="h-[180px] w-[180px] rounded-full border-[14px] border-white/10 animate-pulse" />

                <div className="flex-1 w-full">
                  <div className="h-6 w-32 bg-white/10 rounded-full animate-pulse mb-4" />
                  <div className="h-6 w-48 bg-white/10 rounded animate-pulse mb-3" />
                  <div className="h-4 w-full max-w-sm bg-white/10 rounded animate-pulse mb-2" />
                  <div className="h-4 w-3/4 max-w-sm bg-white/10 rounded animate-pulse" />
                </div>
              </div>
            </div>
          </Card>

          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((item) => (
              <Card key={item} padding="sm">
                <div className="h-10 w-full bg-[#F1F5F9] rounded-lg animate-pulse" />
              </Card>
            ))}
          </div>
        </div>
      </CustomerLayout>
    );
  }

  if (error || !profile) {
    return (
      <CustomerLayout current="dashboard" navigate={navigate}>
        <div className="max-w-4xl mx-auto px-5 sm:px-8 py-12">
          <Card className="text-center py-12">
            <div className="h-14 w-14 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto mb-5">
              <svg
                className="h-6 w-6 text-amber-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
              >
                <path
                  d="M12 8v5M12 16.5v.5"
                  strokeLinecap="round"
                />
                <path
                  d="M10.3 4.2L2.2 18a2 2 0 001.7 3h16.2a2 2 0 001.7-3L13.7 4.2a2 2 0 00-3.4 0z"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h2 className="text-xl font-bold text-[#0D1F35] mb-2">
              Your Trust Profile isn't available yet
            </h2>

            <p className="text-sm text-[#64748B] max-w-md mx-auto mb-6">
              {error ||
                "Complete your financial analysis first and your Trust Profile will appear here."}
            </p>

            <button
              onClick={() => navigate("connect")}
              className="inline-flex items-center justify-center rounded-xl bg-[#0D2D52] px-5 py-3 text-sm font-semibold text-white hover:bg-[#163D6A] transition-colors"
            >
              Start Analysis →
            </button>
          </Card>
        </div>
      </CustomerLayout>
    );
  }

  const scorePct = currentScore / maxScore;

  const strengths =
    profile.strengths.length > 0
      ? profile.strengths
      : ["Keep building consistent financial habits"];

  const opportunities =
    profile.opportunities.length > 0
      ? profile.opportunities
      : ["Continue improving your financial profile"];

  const initials = getInitials(user?.firstName, user?.lastName);

  return (
    <CustomerLayout current="dashboard" navigate={navigate}>
      <div className="max-w-4xl mx-auto px-5 sm:px-8 py-8">
        {/* Page header */}
        <div className="mb-8">
          <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-widest mb-1">
            Welcome back, {firstName}
          </p>

          <h1 className="text-2xl font-bold text-[#0D1F35] tracking-tight">
            Your Trust Profile
          </h1>
        </div>

        {/* Hero score card */}
        <Card padding="none" className="mb-6 overflow-hidden">
          <div className="bg-[#0D2D52] px-6 pt-8 pb-0 sm:px-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
              {/* Score ring */}
              <div className="relative shrink-0">
                <ScoreRing
                  score={currentScore}
                  max={maxScore}
                  size={180}
                  color="#10B981"
                />

                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <p className="text-4xl font-bold text-white font-['JetBrains_Mono',monospace] leading-none">
                    {currentScore}
                  </p>

                  <p className="text-white/50 text-sm mt-1">
                    of {maxScore}
                  </p>
                </div>
              </div>

              {/* Score info */}
              <div className="flex-1 sm:pt-4 text-center sm:text-left pb-6">
                <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-500/30 mb-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                  {profile.band} Financial Profile
                </div>

                <h2 className="text-xl font-bold text-white mb-2">
                  Your TrustID Score
                </h2>

                <p className="text-white/60 text-sm leading-relaxed mb-5 max-w-sm">
                  Your score reflects patterns in your financial behaviour
                  across income, savings, repayment, cash flow and financial
                  discipline.
                </p>

                <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                  <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5">
                    <p className="text-xs text-white/50 mb-0.5">
                      Previous score
                    </p>

                    <p className="text-white font-bold font-['JetBrains_Mono',monospace]">
                      {previousScore || "—"}
                    </p>
                  </div>

                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-2.5">
                    <p className="text-xs text-emerald-400/70 mb-0.5">
                      Change
                    </p>

                    <p className="text-emerald-400 font-bold font-['JetBrains_Mono',monospace]">
                      {scoreChange > 0
                        ? `+${scoreChange}`
                        : scoreChange}
                    </p>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5">
                    <p className="text-xs text-white/50 mb-0.5">
                      Last updated
                    </p>

                    <p className="text-white font-bold text-sm">
                      {formatDate(profile.generatedAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom actions */}
          <div className="px-6 sm:px-8 py-4 flex flex-wrap gap-3 border-t border-[#E2EAF2] bg-white">
            <button
              onClick={() => navigate("score-explanation")}
              className="text-sm font-semibold text-[#0D2D52] hover:text-[#163D6A] flex items-center gap-1.5 transition-colors"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <circle cx="8" cy="8" r="6.5" />
                <path d="M8 7v5M8 5v.5" strokeLinecap="round" />
              </svg>

              How is my score calculated?
            </button>

            <div className="h-4 w-px bg-[#E2EAF2] self-center" />

            <button
              onClick={() => navigate("financial-growth")}
              className="text-sm font-semibold text-[#10B981] hover:text-emerald-600 flex items-center gap-1.5 transition-colors"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  d="M2 12l4-4 3 3 5-5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M11 6h3v3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              Improve My Profile
            </button>
          </div>
        </Card>

        {/* Trust Factors */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-[#0D1F35]">
              Trust Factors
            </h3>

            <button
              onClick={() => navigate("score-explanation")}
              className="text-xs font-semibold text-[#0D2D52] hover:underline"
            >
              View breakdown →
            </button>
          </div>

          <div className="space-y-3">
            {factors.map((factor) => (
              <Card
                key={factor.id}
                padding="sm"
                hover
                onClick={() => navigate("score-explanation")}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-xs font-['JetBrains_Mono',monospace]"
                    style={{
                      backgroundColor: getLevelColor(
                        factor.percentage
                      ),
                    }}
                  >
                    {factor.percentage}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-sm font-semibold text-[#0D1F35] truncate">
                        {factor.label}
                      </p>

                      <Badge
                        variant={getLevelVariant(factor.level)}
                        className="ml-2 shrink-0"
                      >
                        {factor.level}
                      </Badge>
                    </div>

                    <ProgressBar
                      value={factor.percentage}
                      color={getLevelColor(factor.percentage)}
                      size="sm"
                    />
                  </div>

                  <p className="text-xs text-[#94A3B8] font-medium shrink-0 hidden sm:block">
                    {factor.score}/{factor.max}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Strengths & Improvements */}
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <Card>
            <p className="text-xs font-semibold text-[#64748B] uppercase tracking-widest mb-3">
              Key Strengths
            </p>

            <div className="space-y-2.5">
              {strengths.map((strength) => (
                <div
                  key={strength}
                  className="flex items-center gap-2.5 text-sm text-[#374151]"
                >
                  <div className="h-5 w-5 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                    <svg
                      className="h-3 w-3 text-emerald-600"
                      viewBox="0 0 10 10"
                      fill="none"
                    >
                      <path
                        d="M2 5l2 2.5 4-4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>

                  <span>{strength}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <p className="text-xs font-semibold text-[#64748B] uppercase tracking-widest mb-3">
              Areas to Improve
            </p>

            <div className="space-y-2.5">
              {opportunities.map((opportunity) => (
                <div
                  key={opportunity}
                  className="flex items-center gap-2.5 text-sm text-[#374151]"
                >
                  <div className="h-5 w-5 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
                    <svg
                      className="h-3 w-3 text-amber-600"
                      viewBox="0 0 10 10"
                      fill="none"
                    >
                      <path
                        d="M5 3v4M5 8v.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>

                  <span>{opportunity}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Score trend */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-semibold text-[#64748B] uppercase tracking-widest mb-1">
                Score Trend
              </p>

              <p className="text-sm text-[#64748B]">
                {scoreChange > 0
                  ? `Your TrustID score increased by ${scoreChange} points`
                  : "Your TrustID score history"}
              </p>
            </div>

            <button
              onClick={() => navigate("score-history")}
              className="text-xs font-semibold text-[#0D2D52] hover:underline"
            >
              Full history →
            </button>
          </div>

          {trendData.length > 0 ? (
            <>
              <div className="flex items-end gap-2 h-16">
                {trendData.map((item, index) => {
                  const scores = trendData.map((entry) => entry.score);

                  const minScore = Math.min(...scores, 0);
                  const maxTrendScore = Math.max(...scores, maxScore);

                  const range =
                    maxTrendScore - minScore || 1;

                  const pct =
                    ((item.score - minScore) / range) * 100;

                  const isLast =
                    index === trendData.length - 1;

                  return (
                    <div
                      key={item._id}
                      className="flex-1 flex flex-col items-center gap-1"
                    >
                      <div
                        className={`w-full rounded-t-md transition-all ${
                          isLast
                            ? "bg-[#0D2D52]"
                            : "bg-[#E2EAF2]"
                        }`}
                        style={{
                          height: `${Math.max(pct, 8)}%`,
                          minHeight: 4,
                        }}
                        title={`${item.score} points`}
                      />
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between mt-2">
                {trendData.map((item) => (
                  <p
                    key={item._id}
                    className="text-xs text-[#94A3B8] flex-1 text-center"
                  >
                    {new Intl.DateTimeFormat("en-GB", {
                      month: "short",
                    }).format(new Date(item.createdAt))}
                  </p>
                ))}
              </div>
            </>
          ) : (
            <div className="py-6 text-center">
              <p className="text-sm text-[#64748B]">
                Your score history will appear here as your profile is
                updated.
              </p>
            </div>
          )}
        </Card>

        {/* Prototype information */}
        <div className="mt-6 flex items-center justify-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

          <p className="text-xs text-[#94A3B8]">
            TrustID Profile · {initials || "User"} · {scorePct.toFixed(2)}
          </p>
        </div>
      </div>
    </CustomerLayout>
  );
}