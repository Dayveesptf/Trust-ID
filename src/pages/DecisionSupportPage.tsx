import { useEffect, useState } from "react";
import { BankLayout } from "../components/Layout";
import {
  Card,
  Badge,
  Button,
  ScoreRing,
  ProgressBar,
} from "../components/ui";
import {
  EcobankCustomerDetail,
  getEcobankCustomer,
} from "../services/ecobankService";

interface Props {
  navigate: (
    page: string,
    params?: { customerId?: string }
  ) => void;
  customerId?: string;
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
    default:
      return "neutral";
  }
}

function getFactorLabel(key: string) {
  const labels: Record<string, string> = {
    incomeConsistency: "Income Consistency",
    savingsBehaviour: "Savings Behaviour",
    repaymentBehaviour: "Repayment Behaviour",
    cashFlowStability: "Cash-flow Stability",
    financialDiscipline: "Financial Discipline",
  };

  return labels[key] || key;
}

function formatCurrency(value?: number) {
  if (value === undefined || value === null) {
    return "—";
  }

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function DecisionSupportPage({
  navigate,
  customerId,
}: Props) {
  const [data, setData] =
    useState<EcobankCustomerDetail | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCustomer() {
      if (!customerId) {
        setError(
          "No customer was selected for review."
        );
        setLoading(false);
        return;
      }

      try {
        const result =
          await getEcobankCustomer(customerId);

        setData(result);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load customer decision-support information."
        );
      } finally {
        setLoading(false);
      }
    }

    loadCustomer();
  }, [customerId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFB] p-6 lg:p-10">
        <div className="max-w-5xl mx-auto animate-pulse space-y-6">
          <div className="h-8 w-80 bg-slate-200 rounded" />
          <div className="h-36 bg-slate-200 rounded-2xl" />
          <div className="h-72 bg-slate-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#F8FAFB] p-6 lg:p-10">
        <div className="max-w-3xl mx-auto">
          <Card className="p-8 text-center">
            <div className="text-3xl mb-3">
              ⚠️
            </div>

            <h1 className="text-xl font-semibold text-[#0D2D52]">
              Decision Support Unavailable
            </h1>

            <p className="text-sm text-slate-500 mt-2 mb-6">
              {error}
            </p>

            <Button
              onClick={() =>
                navigate("customer-overview")
              }
            >
              Back to Customers
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const customer = data.customer;
  const profile = data.trustProfile;

  return (
    <BankLayout
      current="decision-support"
      navigate={navigate}
    >
      <div className="px-6 sm:px-8 py-8 max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#94A3B8] mb-6">
          <button
            onClick={() =>
              navigate("customer-overview")
            }
            className="hover:text-[#0D2D52] font-medium"
          >
            Customers
          </button>

          <span>›</span>

          <button
            onClick={() =>
              navigate("customer-detail", {
                customerId: customer._id,
              })
            }
            className="hover:text-[#0D2D52] font-medium"
          >
            {customer.firstName}{" "}
            {customer.lastName}
          </button>

          <span>›</span>

          <span className="text-[#374151] font-medium">
            Decision Support
          </span>
        </div>

        {/* Disclaimer */}
        <div className="bg-[#0D2D52] text-white rounded-2xl p-5 mb-8 flex items-start gap-4">
          <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
            ℹ️
          </div>

          <div>
            <p className="text-sm font-bold mb-1">
              Important: Decision Responsibility
            </p>

            <p className="text-sm text-white/70 leading-relaxed">
              TrustID provides additional information for
              decision support.{" "}
              <span className="text-white font-semibold">
                Ecobank retains full responsibility for the
                final lending decision.
              </span>{" "}
              TrustID does not approve or reject financial
              products on behalf of Ecobank.
            </p>
          </div>
        </div>

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-widest mb-1">
            Decision Support
          </p>

          <h1 className="text-2xl font-bold text-[#0D1F35]">
            Review Summary —{" "}
            {customer.firstName}{" "}
            {customer.lastName}
          </h1>

          <p className="text-sm text-[#64748B] mt-2">
            Consolidated TrustID behavioural information for
            this customer.
          </p>
        </div>

        {!profile ? (
          <Card className="p-8 text-center">
            <h2 className="font-semibold text-[#0D2D52]">
              Trust Profile not available
            </h2>

            <p className="text-sm text-slate-500 mt-2 mb-6">
              This customer does not have a generated Trust
              Profile yet.
            </p>

            <Button
              onClick={() =>
                navigate("customer-detail", {
                  customerId: customer._id,
                })
              }
            >
              Return to Customer
            </Button>
          </Card>
        ) : (
          <>
            {/* Score */}
            <Card className="mb-6">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative shrink-0">
                  <ScoreRing
                    score={profile.totalScore}
                    max={850}
                    size={120}
                    color="#10B981"
                  />

                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-2xl font-bold text-[#0D1F35] font-['JetBrains_Mono',monospace]">
                      {profile.totalScore}
                    </p>

                    <p className="text-xs text-[#94A3B8]">
                      / 850
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-[#64748B] uppercase tracking-widest mb-2">
                    TrustID Score
                  </p>

                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-xl font-bold text-[#0D1F35]">
                      {profile.totalScore}
                    </p>

                    <Badge
                      variant={getBandVariant(
                        profile.band
                      )}
                      size="md"
                    >
                      {profile.band}
                    </Badge>
                  </div>

                  <p className="text-xs text-[#64748B]">
                    Generated{" "}
                    {new Date(
                      profile.generatedAt
                    ).toLocaleDateString("en-NG")}
                  </p>
                </div>
              </div>
            </Card>

            {/* Behavioural Summary */}
            <Card className="mb-6">
              <p className="text-xs font-semibold text-[#64748B] uppercase tracking-widest mb-5">
                Behavioural Summary
              </p>

              <div className="space-y-4">
                {Object.entries(profile.factors).map(
                  ([key, factor]) => {
                    const percentage =
                      factor.max > 0
                        ? Math.round(
                            (factor.score /
                              factor.max) *
                              100
                          )
                        : 0;

                    return (
                      <div key={key}>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-medium text-[#0D1F35]">
                            {getFactorLabel(key)}
                          </p>

                          <span className="text-xs font-semibold text-[#64748B]">
                            {factor.score} /{" "}
                            {factor.max} ({percentage}%)
                          </span>
                        </div>

                        <ProgressBar
                          value={factor.score}
                          max={factor.max}
                          size="sm"
                        />
                      </div>
                    );
                  }
                )}
              </div>
            </Card>

            {/* Evidence */}
            <Card className="mb-6">
              <p className="text-xs font-semibold text-[#64748B] uppercase tracking-widest mb-5">
                Supporting Evidence
              </p>

              {data.financialEvidence ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-[#F8FAFB] p-4">
                    <p className="text-xs text-[#94A3B8]">
                      Avg. Monthly Inflow
                    </p>

                    <p className="text-sm font-bold text-[#0D1F35] mt-2">
                      {formatCurrency(
                        data.financialEvidence
                          .averageMonthlyInflow
                      )}
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#F8FAFB] p-4">
                    <p className="text-xs text-[#94A3B8]">
                      Avg. Monthly Savings
                    </p>

                    <p className="text-sm font-bold text-[#0D1F35] mt-2">
                      {formatCurrency(
                        data.financialEvidence
                          .averageMonthlySavings
                      )}
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#F8FAFB] p-4">
                    <p className="text-xs text-[#94A3B8]">
                      Repayment On Time
                    </p>

                    <p className="text-sm font-bold text-[#0D1F35] mt-2">
                      {
                        data.financialEvidence
                          .repaymentOnTimeRate
                      }
                      %
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#F8FAFB] p-4">
                    <p className="text-xs text-[#94A3B8]">
                      Savings Rate
                    </p>

                    <p className="text-sm font-bold text-[#0D1F35] mt-2">
                      {
                        data.financialEvidence
                          .savingsRate
                      }
                      %
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-400">
                  No financial evidence available.
                </p>
              )}
            </Card>

            {/* Assessment */}
            <div className="grid lg:grid-cols-2 gap-6 mb-6">
              <Card>
                <p className="text-xs font-semibold text-[#64748B] uppercase tracking-widest mb-4">
                  Strengths
                </p>

                {profile.strengths.length > 0 ? (
                  <div className="space-y-3">
                    {profile.strengths.map(
                      (strength) => (
                        <div
                          key={strength}
                          className="flex items-start gap-2 text-sm text-[#374151]"
                        >
                          <span className="text-emerald-500">
                            ✓
                          </span>

                          <span>{strength}</span>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">
                    No strengths recorded.
                  </p>
                )}
              </Card>

              <Card>
                <p className="text-xs font-semibold text-[#64748B] uppercase tracking-widest mb-4">
                  Considerations
                </p>

                {profile.opportunities.length > 0 ? (
                  <div className="space-y-3">
                    {profile.opportunities.map(
                      (opportunity) => (
                        <div
                          key={opportunity}
                          className="flex items-start gap-2 text-sm text-[#374151]"
                        >
                          <span className="text-amber-500">
                            →
                          </span>

                          <span>{opportunity}</span>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">
                    No major considerations identified.
                  </p>
                )}
              </Card>
            </div>

            {/* Decision Notice */}
            <div className="border-2 border-[#E2EAF2] rounded-2xl p-5 mb-6">
              <p className="text-sm text-[#374151] leading-relaxed text-center">
                <span className="font-bold text-[#0D2D52]">
                  TrustID provides additional information
                  for decision support.
                </span>{" "}
                Ecobank retains responsibility for the final
                lending decision. TrustID behavioural insights
                are one input among many in a holistic review.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <Button
                variant="secondary"
                onClick={() =>
                  navigate("customer-detail", {
                    customerId: customer._id,
                  })
                }
              >
                ← Customer Profile
              </Button>

              <Button
                variant="secondary"
                onClick={() =>
                  navigate("supporting-evidence", {
                    customerId: customer._id,
                  })
                }
              >
                Supporting Evidence
              </Button>

              <Button
                onClick={() =>
                  navigate("recommendation", {
                    customerId: customer._id,
                  })
                }
              >
                TrustID Assessment →
              </Button>
            </div>
          </>
        )}
      </div>
    </BankLayout>
  );
}