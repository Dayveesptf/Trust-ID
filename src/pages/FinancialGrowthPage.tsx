import { useEffect, useMemo, useState } from "react";
import { CustomerLayout } from "../components/Layout";
import {
  Card,
  Badge,
  Button,
  ProgressBar,
} from "../components/ui";
import {
  getTrustInsights,
  getTrustProfile,
  TrustProfile,
} from "../services/financialProfileService";

interface GrowthRecommendation {
  id: number;
  factor: string;
  icon: string;
  title: string;
  currentBehaviour: string;
  recommendedAction: string;
  potentialBenefit: string;
  impact: "High" | "Medium" | "Low";
}

function getFactorLabel(factor: string): string {
  const labels: Record<string, string> = {
    incomeConsistency: "Income Consistency",
    savingsBehaviour: "Savings Behaviour",
    repaymentBehaviour: "Repayment Behaviour",
    cashFlowStability: "Cash-flow Stability",
    financialDiscipline: "Financial Discipline",
  };

  return labels[factor] || factor;
}

function getFactorIcon(factor: string): string {
  const icons: Record<string, string> = {
    incomeConsistency: "💼",
    savingsBehaviour: "💰",
    repaymentBehaviour: "✓",
    cashFlowStability: "📊",
    financialDiscipline: "🎯",
  };

  return icons[factor] || "📈";
}

function getImpact(
  score: number,
  max: number
): "High" | "Medium" | "Low" {
  const percentage = max > 0 ? (score / max) * 100 : 0;

  if (percentage < 60) return "High";
  if (percentage < 75) return "Medium";
  return "Low";
}

function getImpactVariant(
  impact: "High" | "Medium" | "Low"
): "warning" | "good" | "neutral" {
  if (impact === "High") return "warning";
  if (impact === "Medium") return "good";
  return "neutral";
}

function buildRecommendation(
  factorKey: string,
  factorScore: number,
  factorMax: number,
  opportunity: string,
  index: number
): GrowthRecommendation {
  const percentage =
    factorMax > 0 ? Math.round((factorScore / factorMax) * 100) : 0;

  const factor = getFactorLabel(factorKey);

  const templates: Record<
    string,
    {
      title: string;
      current: string;
      action: string;
      benefit: string;
    }
  > = {
    incomeConsistency: {
      title: "Build more consistent income patterns",
      current:
        percentage < 60
          ? "Your income pattern shows significant variation across the period analysed."
          : "Your income is reasonably consistent, with some room to strengthen the pattern.",
      action:
        "Maintain predictable income deposits where possible and build a buffer for lower-income periods.",
      benefit:
        "More consistent income patterns can strengthen your Income Consistency factor.",
    },

    savingsBehaviour: {
      title: "Build a more consistent savings habit",
      current:
        "Your savings behaviour has room for improvement based on your current Trust Profile.",
      action:
        "Set up a regular savings transfer and aim to maintain the habit every month.",
      benefit:
        "Consistent saving can improve your Savings Behaviour factor over time.",
    },

    repaymentBehaviour: {
      title: "Keep every repayment on schedule",
      current:
        "Your repayment behaviour is an important part of your financial credibility.",
      action:
        "Keep recurring repayments and bills on schedule and avoid missed payments.",
      benefit:
        "Maintaining timely repayments can protect and strengthen your Repayment Behaviour factor.",
    },

    cashFlowStability: {
      title: "Improve your cash-flow stability",
      current:
        "Your cash flow shows opportunities to create a more stable financial pattern.",
      action:
        "Reduce large month-to-month swings and maintain a stronger balance toward the end of each month.",
      benefit:
        "More stable cash flow can improve your Cash-flow Stability factor.",
    },

    financialDiscipline: {
      title: "Strengthen your financial discipline",
      current:
        "Your spending and recurring-payment patterns have room for improvement.",
      action:
        "Track recurring expenses, stay within your budget and reduce unnecessary spending spikes.",
      benefit:
        "Stronger financial discipline can improve your overall Trust Profile.",
    },
  };

  const template = templates[factorKey] || {
    title: `Improve your ${factor}`,
    current: opportunity,
    action:
      "Maintain consistent financial habits and focus on the areas highlighted in your Trust Profile.",
    benefit:
      `Improving ${factor} can contribute positively to your Trust Score.`,
  };

  return {
    id: index + 1,
    factor,
    icon: getFactorIcon(factorKey),
    title: template.title,
    currentBehaviour: template.current,
    recommendedAction: template.action,
    potentialBenefit: template.benefit,
    impact: getImpact(factorScore, factorMax),
  };
}

export default function FinancialGrowthPage({
  navigate,
}: {
  navigate: (page: string) => void;
}) {
  const [profile, setProfile] = useState<TrustProfile | null>(null);
  const [opportunities, setOpportunities] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<
    GrowthRecommendation[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadGrowthData() {
      try {
        setLoading(true);
        setError("");

        const [trustProfile, insights] = await Promise.all([
          getTrustProfile(),
          getTrustInsights(),
        ]);

        if (!trustProfile) {
          throw new Error(
            "Your Trust Profile is not available yet."
          );
        }

        setProfile(trustProfile);
        setOpportunities(insights.opportunities || []);

        const factorEntries = Object.entries(trustProfile.factors);

        const generatedRecommendations = factorEntries
          .filter(([factorKey, factor]) =>
            insights.opportunities.some(
              (opportunity) =>
                opportunity.toLowerCase() ===
                getFactorLabel(factorKey).toLowerCase()
            )
          )
          .map(([factorKey, factor], index) =>
            buildRecommendation(
              factorKey,
              factor.score,
              factor.max,
              insights.opportunities[index] || "",
              index
            )
          );

        setRecommendations(generatedRecommendations);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load your growth recommendations."
        );
      } finally {
        setLoading(false);
      }
    }

    loadGrowthData();
  }, []);

  const overallProgress = useMemo(() => {
    if (!profile) return 0;
    return Math.round((profile.totalScore / 850) * 100);
  }, [profile]);

  if (loading) {
    return (
      <CustomerLayout current="financial-growth" navigate={navigate}>
        <div className="p-6 lg:p-10 max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-64 bg-slate-200 rounded" />
            <div className="h-4 w-96 bg-slate-200 rounded" />
            <div className="h-40 bg-slate-200 rounded-2xl" />
            <div className="h-64 bg-slate-200 rounded-2xl" />
          </div>
        </div>
      </CustomerLayout>
    );
  }

  if (error || !profile) {
    return (
      <CustomerLayout current="financial-growth" navigate={navigate}>
        <div className="p-6 lg:p-10 max-w-4xl mx-auto">
          <Card className="p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-[#E8F0F7] flex items-center justify-center mx-auto mb-4 text-2xl">
              📈
            </div>

            <h1 className="text-xl font-semibold text-[#0D2D52] mb-2">
              Financial Growth
            </h1>

            <p className="text-sm text-slate-500 mb-6">
              {error ||
                "Your Trust Profile needs to be generated before we can show growth recommendations."}
            </p>

            <Button onClick={() => navigate("analysis")}>
              Start Analysis
            </Button>
          </Card>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout current="financial-growth" navigate={navigate}>
      <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <p className="text-sm font-medium text-[#2563A0] mb-2">
            Financial Growth
          </p>

          <h1 className="text-2xl lg:text-3xl font-bold text-[#0D2D52]">
            Build a stronger financial profile
          </h1>

          <p className="text-slate-500 mt-2 max-w-2xl">
            Your recommendations are based on the financial behaviours
            reflected in your Trust Profile.
          </p>
        </div>

        {/* Current Score */}
        <Card className="p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <p className="text-sm text-slate-500 mb-2">
                Current Trust Score
              </p>

              <div className="flex items-end gap-3">
                <span className="text-4xl font-bold text-[#0D2D52]">
                  {profile.totalScore}
                </span>

                <span className="text-slate-400 mb-1">
                  / 850
                </span>

                <Badge
                  variant={
                    profile.band === "Excellent"
                      ? "success"
                      : profile.band === "Strong" ||
                        profile.band === "Good"
                      ? "good"
                      : profile.band === "Fair"
                      ? "fair"
                      : profile.band === "Developing"
                      ? "warning"
                      : "neutral"
                  }
                >
                  {profile.band}
                </Badge>
              </div>

              <p className="text-sm text-slate-500 mt-3">
                Keep building positive financial habits to strengthen
                your profile.
              </p>
            </div>

            <div className="w-full lg:w-72">
              <div className="flex items-center justify-between mb-2 text-sm">
                <span className="text-slate-500">
                  Profile strength
                </span>

                <span className="font-semibold text-[#0D2D52]">
                  {overallProgress}%
                </span>
              </div>

              <ProgressBar
                value={profile.totalScore}
                max={850}
              />
            </div>
          </div>
        </Card>

        {/* Opportunities */}
        <div>
          <div className="mb-5">
            <h2 className="text-xl font-semibold text-[#0D2D52]">
              Your growth opportunities
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              These are the areas with the greatest opportunity to
              strengthen your Trust Profile.
            </p>
          </div>

          {opportunities.length === 0 ? (
            <Card className="p-8 text-center">
              <div className="text-3xl mb-3">🎉</div>

              <h3 className="font-semibold text-[#0D2D52] mb-2">
                You are doing well
              </h3>

              <p className="text-sm text-slate-500">
                No major improvement areas were identified from your
                current financial behaviour.
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
              {recommendations.map((recommendation) => (
                <Card
                  key={recommendation.id}
                  className="p-6"
                >
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-xl bg-[#EAF1F7] flex items-center justify-center text-xl shrink-0">
                        {recommendation.icon}
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-[#2563A0] mb-1">
                          {recommendation.factor}
                        </p>

                        <h3 className="text-lg font-semibold text-[#0D2D52]">
                          {recommendation.title}
                        </h3>
                      </div>
                    </div>

                    <Badge
                      variant={getImpactVariant(
                        recommendation.impact
                      )}
                    >
                      {recommendation.impact} Impact
                    </Badge>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">
                        Current behaviour
                      </p>

                      <p className="text-sm text-slate-600 leading-6">
                        {recommendation.currentBehaviour}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">
                        Recommended action
                      </p>

                      <p className="text-sm text-slate-600 leading-6">
                        {recommendation.recommendedAction}
                      </p>
                    </div>

                    <div className="rounded-xl bg-[#F4F8FB] p-4">
                      <p className="text-xs font-semibold text-[#2563A0] uppercase tracking-wide mb-1">
                        Potential benefit
                      </p>

                      <p className="text-sm text-[#0D2D52] leading-6">
                        {recommendation.potentialBenefit}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Strengths */}
        {profile.factors && (
          <Card className="p-6 lg:p-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-[#0D2D52]">
                Your current strengths
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Keep maintaining these behaviours as you work on the
                areas above.
              </p>
            </div>

            <div className="space-y-5">
              {Object.entries(profile.factors)
                .filter(({ 1: factor }) => {
                  return (
                    factor.max > 0 &&
                    factor.score / factor.max >= 0.8
                  );
                })
                .map(([factorKey, factor]) => {
                  const percentage = Math.round(
                    (factor.score / factor.max) * 100
                  );

                  return (
                    <div key={factorKey}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-[#0D2D52]">
                          {getFactorLabel(factorKey)}
                        </span>

                        <span className="text-sm font-semibold text-[#2563A0]">
                          {percentage}%
                        </span>
                      </div>

                      <ProgressBar
                        value={factor.score}
                        max={factor.max}
                      />
                    </div>
                  );
                })}
            </div>
          </Card>
        )}

        {/* CTA */}
        <Card className="p-6 lg:p-8 bg-[#0D2D52] border-0">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <h2 className="text-xl font-semibold text-white">
                See how your score is calculated
              </h2>

              <p className="text-sm text-white/70 mt-2 max-w-xl">
                Understand exactly how each financial behaviour
                contributes to your Trust Score.
              </p>
            </div>

            <Button
              onClick={() => navigate("score-explanation")}
              className="bg-white text-[#0D2D52] hover:bg-slate-100"
            >
              View Score Explanation
            </Button>
          </div>
        </Card>
      </div>
    </CustomerLayout>
  );
}