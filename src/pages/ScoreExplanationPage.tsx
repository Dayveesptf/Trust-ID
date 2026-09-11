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
import {
  getTrustProfile,
  TrustProfile,
} from "../services/financialProfileService";

interface Props {
  navigate: (s: string) => void;
}

interface Factor {
  id: string;
  label: string;
  score: number;
  maxPoints: number;
  percentage: number;
  level: string;
  color: string;
  description: string;
  whatHelped: string;
  whatCouldImprove: string;
}

function getBandVariant(
  band: string
): "success" | "good" | "fair" | "warning" | "info" | "neutral" {
  switch (band) {
    case "Excellent":
      return "success";

    case "Strong":
      return "good";

    case "Good":
      return "good";

    case "Fair":
      return "fair";

    case "Developing":
      return "warning";

    case "Needs Improvement":
      return "neutral";

    default:
      return "neutral";
  }
}

function getFactorLevel(percentage: number) {
  if (percentage >= 90) return "Excellent";
  if (percentage >= 75) return "Strong";
  if (percentage >= 60) return "Good";
  if (percentage >= 40) return "Fair";
  return "Developing";
}

function getFactorDescription(id: string) {
  const descriptions: Record<string, string> = {
    income:
      "Measures how consistently money comes into your financial profile over time. More predictable income behaviour contributes positively to your TrustID Score.",

    savings:
      "Measures your ability to consistently set money aside. Both your savings rate and the length of your savings streak contribute to this factor.",

    repayment:
      "Measures how reliably you keep up with repayments and recurring financial obligations. Consistent on-time behaviour strengthens this part of your profile.",

    cashflow:
      "Measures how stable your money movement is over time. More stable cash-flow patterns indicate stronger financial predictability.",

    discipline:
      "Measures everyday financial discipline, including budgeting behaviour, recurring payment consistency, and how often your balance remains very low.",
  };

  return descriptions[id] || "";
}

function getWhatHelped(
  id: string,
  profile: TrustProfile
) {
  const factor = profile.factors;

  switch (id) {
    case "income":
      return `Your income consistency contributed ${factor.incomeConsistency.score} out of ${factor.incomeConsistency.max} available points.`;

    case "savings":
      return `Your savings behaviour contributed ${factor.savingsBehaviour.score} out of ${factor.savingsBehaviour.max} available points.`;

    case "repayment":
      return `Your repayment behaviour contributed ${factor.repaymentBehaviour.score} out of ${factor.repaymentBehaviour.max} available points.`;

    case "cashflow":
      return `Your cash-flow stability contributed ${factor.cashFlowStability.score} out of ${factor.cashFlowStability.max} available points.`;

    case "discipline":
      return `Your financial discipline contributed ${factor.financialDiscipline.score} out of ${factor.financialDiscipline.max} available points.`;

    default:
      return "Your financial behaviour contributed to this factor.";
  }
}

function getWhatCouldImprove(
  id: string,
  percentage: number
) {
  if (percentage >= 90) {
    return "This is already one of your strongest areas. Maintain these habits consistently.";
  }

  switch (id) {
    case "income":
      return "Maintaining more consistent income patterns over time can strengthen this part of your profile.";

    case "savings":
      return "Increasing your savings rate and maintaining a longer savings streak can improve this factor.";

    case "repayment":
      return "Keeping repayments and recurring obligations consistently on time can improve this factor.";

    case "cashflow":
      return "Reducing large cash-flow swings and maintaining a healthier balance can strengthen this factor.";

    case "discipline":
      return "Improving budgeting consistency, recurring payments, and reducing low-balance days can strengthen this factor.";

    default:
      return "Consistent positive financial behaviour can improve this factor.";
  }
}

export default function ScoreExplanationPage({
  navigate,
}: Props) {
  const [profile, setProfile] = useState<TrustProfile | null>(
    null
  );

  const [expanded, setExpanded] = useState<string | null>(
    "repayment"
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      try {
        setLoading(true);
        setError("");

        const data = await getTrustProfile();

        if (!mounted) return;

        setProfile(data);
      } catch (err) {
        if (!mounted) return;

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load your TrustID Score."
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      mounted = false;
    };
  }, []);

  const factors: Factor[] = useMemo(() => {
    if (!profile) return [];

    const rawFactors = [
      {
        id: "income",
        label: "Income Consistency",
        score: profile.factors.incomeConsistency.score,
        maxPoints: profile.factors.incomeConsistency.max,
        color: "#0D2D52",
      },
      {
        id: "savings",
        label: "Savings Behaviour",
        score: profile.factors.savingsBehaviour.score,
        maxPoints: profile.factors.savingsBehaviour.max,
        color: "#0F766E",
      },
      {
        id: "repayment",
        label: "Repayment Behaviour",
        score: profile.factors.repaymentBehaviour.score,
        maxPoints: profile.factors.repaymentBehaviour.max,
        color: "#10B981",
      },
      {
        id: "cashflow",
        label: "Cash-flow Stability",
        score: profile.factors.cashFlowStability.score,
        maxPoints: profile.factors.cashFlowStability.max,
        color: "#0891B2",
      },
      {
        id: "discipline",
        label: "Financial Discipline",
        score: profile.factors.financialDiscipline.score,
        maxPoints: profile.factors.financialDiscipline.max,
        color: "#7C3AED",
      },
    ];

    return rawFactors.map((factor) => {
      const percentage = Math.round(
        (factor.score / factor.maxPoints) * 100
      );

      return {
        ...factor,
        percentage,
        level: getFactorLevel(percentage),
        description: getFactorDescription(factor.id),
        whatHelped: getWhatHelped(factor.id, profile),
        whatCouldImprove: getWhatCouldImprove(
          factor.id,
          percentage
        ),
      };
    });
  }, [profile]);

  if (loading) {
    return (
      <CustomerLayout
        current="score-explanation"
        navigate={navigate}
      >
        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-8">
          <div className="mb-8">
            <div className="h-3 w-28 bg-[#E2EAF2] rounded animate-pulse mb-2" />

            <div className="h-8 w-96 max-w-full bg-[#E2EAF2] rounded animate-pulse" />

            <div className="h-4 w-full max-w-xl bg-[#E2EAF2] rounded animate-pulse mt-3" />
          </div>

          <Card className="mb-6">
            <div className="flex items-center gap-6">
              <div className="h-[120px] w-[120px] rounded-full bg-[#E2EAF2] animate-pulse shrink-0" />

              <div className="flex-1">
                <div className="h-7 w-44 bg-[#E2EAF2] rounded animate-pulse mb-3" />
                <div className="h-12 w-full bg-[#F8FAFB] rounded animate-pulse" />
              </div>
            </div>
          </Card>

          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((item) => (
              <Card key={item}>
                <div className="h-10 bg-[#F8FAFB] rounded animate-pulse" />
              </Card>
            ))}
          </div>
        </div>
      </CustomerLayout>
    );
  }

  if (error) {
    return (
      <CustomerLayout
        current="score-explanation"
        navigate={navigate}
      >
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
              Unable to load your score
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

  if (!profile) {
    return (
      <CustomerLayout
        current="score-explanation"
        navigate={navigate}
      >
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
                <circle cx="12" cy="12" r="9" />
                <path
                  d="M12 10v6M12 7.5v.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <h2 className="text-lg font-bold text-[#0D1F35]">
              Your TrustID Score isn't available yet
            </h2>

            <p className="text-sm text-[#64748B] mt-2 max-w-md mx-auto">
              Complete your financial analysis first. Your
              score explanation will appear here once your
              Trust Profile has been generated.
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
    <CustomerLayout
      current="score-explanation"
      navigate={navigate}
    >
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-widest mb-1">
            Score Breakdown
          </p>

          <h1 className="text-2xl font-bold text-[#0D1F35] tracking-tight">
            Why is my TrustID Score{" "}
            <span className="text-[#0D2D52] font-['JetBrains_Mono',monospace]">
              {profile.totalScore}
            </span>
            ?
          </h1>

          <p className="text-sm text-[#64748B] mt-2">
            Your score is built from five measurable dimensions
            of financial behaviour. Here's exactly how each one
            contributes.
          </p>
        </div>

        {/* Total breakdown card */}
        <Card className="mb-6">
          <div className="flex items-center gap-6">
            <div className="relative shrink-0">
              <ScoreRing
                score={profile.totalScore}
                max={850}
                size={120}
                color="#10B981"
              />

              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <p className="text-2xl font-bold text-[#0D1F35] font-['JetBrains_Mono',monospace]">
                  {profile.totalScore}
                </p>

                <p className="text-xs text-[#94A3B8]">
                  / 850
                </p>
              </div>
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge
                  variant={getBandVariant(profile.band)}
                  size="md"
                >
                  {profile.band} Financial Profile
                </Badge>
              </div>

              <p className="text-sm text-[#64748B] leading-relaxed">
                Your score is the sum of five factor scores,
                each weighted by importance. The maximum total
                is{" "}
                <span className="font-semibold text-[#0D1F35]">
                  850 points
                </span>
                .
              </p>
            </div>
          </div>

          {/* Contribution bars */}
          <div className="mt-5 pt-5 border-t border-[#E2EAF2]">
            <p className="text-xs font-semibold text-[#64748B] uppercase tracking-widest mb-3">
              Score Composition
            </p>

            <div className="space-y-2.5">
              {factors.map((f) => (
                <div
                  key={f.id}
                  className="flex items-center gap-3"
                >
                  <p className="text-xs font-medium text-[#64748B] w-36 shrink-0 truncate">
                    {f.label}
                  </p>

                  <div className="flex-1">
                    <ProgressBar
                      value={f.score}
                      max={f.maxPoints}
                      color={f.color}
                      size="sm"
                    />
                  </div>

                  <p className="text-xs font-bold text-[#0D1F35] font-['JetBrains_Mono',monospace] w-16 text-right shrink-0">
                    {f.score}/{f.maxPoints}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-3 pt-3 border-t border-[#E2EAF2] flex justify-between">
              <p className="text-xs font-semibold text-[#64748B]">
                Total
              </p>

              <p className="text-sm font-bold text-[#0D1F35] font-['JetBrains_Mono',monospace]">
                {profile.totalScore}/850
              </p>
            </div>
          </div>
        </Card>

        {/* Factor detail cards */}
        <div className="space-y-3">
          {factors.map((f) => {
            const isOpen = expanded === f.id;

            return (
              <Card
                key={f.id}
                padding="none"
                className="overflow-hidden"
              >
                <button
                  onClick={() =>
                    setExpanded(isOpen ? null : f.id)
                  }
                  className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-[#F8FAFB] transition-colors"
                >
                  <div
                    className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-xs font-['JetBrains_Mono',monospace]"
                    style={{
                      backgroundColor: f.color,
                    }}
                  >
                    {f.score}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-bold text-[#0D1F35]">
                        {f.label}
                      </p>

                      <Badge
                        variant={getLevelVariant(f.level)}
                        size="sm"
                      >
                        {f.level}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex-1 max-w-[140px]">
                        <ProgressBar
                          value={f.score}
                          max={f.maxPoints}
                          color={getLevelColor(f.score)}
                          size="sm"
                        />
                      </div>

                      <p className="text-xs text-[#94A3B8]">
                        {f.percentage}% · {f.score}/
                        {f.maxPoints} pts
                      </p>
                    </div>
                  </div>

                  <svg
                    className={`h-4 w-4 text-[#94A3B8] transition-transform shrink-0 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path
                      d="M4 6l4 4 4-4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 border-t border-[#E2EAF2] animate-fade-in">
                    <p className="text-sm text-[#64748B] mt-4 mb-5 leading-relaxed">
                      {f.description}
                    </p>

                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center">
                            <svg
                              className="h-3 w-3 text-emerald-700"
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

                          <p className="text-xs font-bold text-emerald-800">
                            What helped
                          </p>
                        </div>

                        <p className="text-sm text-emerald-900 leading-relaxed">
                          {f.whatHelped}
                        </p>
                      </div>

                      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-5 w-5 rounded-full bg-amber-100 flex items-center justify-center">
                            <svg
                              className="h-3 w-3 text-amber-700"
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

                          <p className="text-xs font-bold text-amber-800">
                            What could improve
                          </p>
                        </div>

                        <p className="text-sm text-amber-900 leading-relaxed">
                          {f.whatCouldImprove}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Scoring philosophy */}
        <Card className="mt-6">
          <div className="flex gap-4">
            <div className="h-10 w-10 rounded-xl bg-[#EFF4F9] flex items-center justify-center shrink-0">
              <svg
                className="h-5 w-5 text-[#0D2D52]"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <circle cx="10" cy="10" r="8.5" />
                <path
                  d="M10 9v6M10 7v.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div>
              <p className="text-sm font-bold text-[#0D1F35] mb-1">
                About TrustID Scoring
              </p>

              <p className="text-sm text-[#64748B] leading-relaxed">
                Your TrustID Score is calculated from observable
                financial behaviour patterns — not from
                traditional credit history. Each dimension is
                analysed independently and transparently. TrustID
                never approves or rejects financial products; it
                provides additional context to support informed
                decision-making by financial institutions.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </CustomerLayout>
  );
}