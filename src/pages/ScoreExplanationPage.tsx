import { useEffect, useMemo, useState } from "react";
import { CustomerLayout } from "../components/Layout";
import {
  Card,
  Badge,
  ProgressBar,
  ScoreRing,
  getLevelVariant,
} from "../components/ui";
import {
  getTrustProfile,
  type TrustProfile,
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
    case "Good":
      return "good";
    case "Fair":
      return "fair";
    case "Developing":
      return "warning";
    default:
      return "neutral";
  }
}

function getLevel(percentage: number) {
  if (percentage >= 90) return "Excellent";
  if (percentage >= 75) return "Strong";
  if (percentage >= 60) return "Good";
  if (percentage >= 40) return "Fair";
  return "Developing";
}

function getDescription(id: string) {
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

function getHelped(id: string, profile: TrustProfile) {
  switch (id) {
    case "income":
      return `Your income consistency contributed ${profile.factors.incomeConsistency.score} out of ${profile.factors.incomeConsistency.max} available points.`;
    case "savings":
      return `Your savings behaviour contributed ${profile.factors.savingsBehaviour.score} out of ${profile.factors.savingsBehaviour.max} available points.`;
    case "repayment":
      return `Your repayment behaviour contributed ${profile.factors.repaymentBehaviour.score} out of ${profile.factors.repaymentBehaviour.max} available points.`;
    case "cashflow":
      return `Your cash-flow stability contributed ${profile.factors.cashFlowStability.score} out of ${profile.factors.cashFlowStability.max} available points.`;
    default:
      return `Your financial discipline contributed ${profile.factors.financialDiscipline.score} out of ${profile.factors.financialDiscipline.max} available points.`;
  }
}

function getImprovement(id: string, percentage: number) {
  if (percentage >= 90) {
    return "This is already one of your strongest areas. Maintain these habits consistently.";
  }

  const messages: Record<string, string> = {
    income:
      "Maintaining more consistent income patterns over time can strengthen this part of your profile.",
    savings:
      "Increasing your savings rate and maintaining a longer savings streak can improve this factor.",
    repayment:
      "Keeping repayments and recurring obligations consistently on time can improve this factor.",
    cashflow:
      "Reducing large cash-flow swings and maintaining a healthier balance can strengthen this factor.",
    discipline:
      "Improving budgeting consistency, recurring payments, and reducing low-balance days can strengthen this factor.",
  };

  return messages[id] || "Consistent positive financial behaviour can improve this factor.";
}

export default function ScoreExplanationPage({
  navigate,
}: Props) {
  const [profile, setProfile] = useState<TrustProfile | null>(null);
  const [expanded, setExpanded] = useState("repayment");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      try {
        const data = await getTrustProfile();

        if (mounted) {
          setProfile(data);
        }
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load your TrustID Score."
          );
        }
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

    const raw = [
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

    return raw.map((factor) => {
      const percentage =
        factor.maxPoints > 0
          ? Math.round((factor.score / factor.maxPoints) * 100)
          : 0;

      return {
        ...factor,
        percentage,
        level: getLevel(percentage),
        description: getDescription(factor.id),
        whatHelped: getHelped(factor.id, profile),
        whatCouldImprove: getImprovement(
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
          <div className="animate-pulse space-y-5">
            <div className="h-8 w-72 bg-[#E2EAF2] rounded" />
            <div className="h-40 bg-[#E2EAF2] rounded-2xl" />

            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="h-20 bg-[#E2EAF2] rounded-xl"
              />
            ))}
          </div>
        </div>
      </CustomerLayout>
    );
  }

  if (error || !profile) {
    return (
      <CustomerLayout
        current="score-explanation"
        navigate={navigate}
      >
        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-10">
          <Card className="text-center py-12">
            <h2 className="text-lg font-bold text-[#0D1F35]">
              Your TrustID Score isn't available yet
            </h2>

            <p className="text-sm text-[#64748B] mt-2 max-w-md mx-auto">
              {error ||
                "Complete your financial analysis first."}
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
    <CustomerLayout
      current="score-explanation"
      navigate={navigate}
    >
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
            Score Breakdown
          </p>

          <h1 className="text-2xl font-bold text-[#0D1F35] mt-1">
            Why is my TrustID Score {profile.totalScore}?
          </h1>

          <p className="text-sm text-[#64748B] mt-2">
            Your score is built from five measurable dimensions
            of financial behaviour.
          </p>
        </div>

        <Card className="mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative shrink-0">
              <ScoreRing
                score={profile.totalScore}
                max={850}
                size={120}
                color="#10B981"
              />

              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <p className="text-2xl font-bold text-[#0D1F35]">
                  {profile.totalScore}
                </p>
                <p className="text-xs text-[#94A3B8]">
                  / 850
                </p>
              </div>
            </div>

            <div className="flex-1">
              <Badge
                variant={getBandVariant(profile.band)}
                size="md"
              >
                {profile.band} Financial Profile
              </Badge>

              <p className="text-sm text-[#64748B] leading-relaxed mt-3">
                Your score is the sum of five factor scores.
                The maximum total is{" "}
                <strong className="text-[#0D1F35]">
                  850 points
                </strong>
                .
              </p>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-[#E2EAF2] space-y-3">
            {factors.map((factor) => (
              <div
                key={factor.id}
                className="flex items-center gap-3"
              >
                <p className="text-xs font-medium text-[#64748B] w-36 shrink-0 truncate">
                  {factor.label}
                </p>

                <div className="flex-1">
                  <ProgressBar
                    value={factor.score}
                    max={factor.maxPoints}
                    color={factor.color}
                    size="sm"
                  />
                </div>

                <p className="text-xs font-bold text-[#0D1F35] w-16 text-right">
                  {factor.score}/{factor.maxPoints}
                </p>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-3">
          {factors.map((factor) => {
            const open = expanded === factor.id;

            return (
              <Card
                key={factor.id}
                padding="none"
                className="overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() =>
                    setExpanded(open ? "" : factor.id)
                  }
                  className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-[#F8FAFB]"
                >
                  <div
                    className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-xs"
                    style={{
                      backgroundColor: factor.color,
                    }}
                  >
                    {factor.score}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-bold text-[#0D1F35]">
                        {factor.label}
                      </p>

                      <Badge
                        variant={getLevelVariant(factor.level)}
                        size="sm"
                      >
                        {factor.level}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex-1 max-w-[160px]">
                        <ProgressBar
                          value={factor.score}
                          max={factor.maxPoints}
                          color={factor.color}
                          size="sm"
                        />
                      </div>

                      <p className="text-xs text-[#94A3B8]">
                        {factor.percentage}%
                      </p>
                    </div>
                  </div>

                  <span className="text-[#94A3B8]">
                    {open ? "⌃" : "⌄"}
                  </span>
                </button>

                {open && (
                  <div className="px-5 pb-5 border-t border-[#E2EAF2]">
                    <p className="text-sm text-[#64748B] leading-relaxed mt-4">
                      {factor.description}
                    </p>

                    <div className="grid sm:grid-cols-2 gap-3 mt-5">
                      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                        <p className="text-xs font-bold text-emerald-800 mb-2">
                          What helped
                        </p>

                        <p className="text-sm text-emerald-900 leading-relaxed">
                          {factor.whatHelped}
                        </p>
                      </div>

                      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                        <p className="text-xs font-bold text-amber-800 mb-2">
                          What could improve
                        </p>

                        <p className="text-sm text-amber-900 leading-relaxed">
                          {factor.whatCouldImprove}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        <Card className="mt-6">
          <p className="text-sm font-bold text-[#0D1F35] mb-2">
            About TrustID Scoring
          </p>

          <p className="text-sm text-[#64748B] leading-relaxed">
            TrustID analyses observable financial behaviour
            patterns and presents them transparently. TrustID
            does not approve or reject financial products. It
            provides additional context to support informed
            decision-making by financial institutions.
          </p>
        </Card>
      </div>
    </CustomerLayout>
  );
}
