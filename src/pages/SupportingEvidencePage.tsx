import { useEffect, useState } from "react";
import { BankLayout } from "../components/Layout";
import {
  Card,
  Badge,
  Button,
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

function getPercentageLevel(value: number) {
  if (value >= 90) return "Excellent";
  if (value >= 75) return "Strong";
  if (value >= 60) return "Good";
  if (value >= 40) return "Fair";
  return "Developing";
}

function getLevelVariant(
  value: number
): "success" | "good" | "fair" | "warning" | "info" | "neutral" {
  if (value >= 90) return "success";
  if (value >= 75) return "good";
  if (value >= 60) return "fair";
  if (value >= 40) return "warning";
  return "neutral";
}

export default function SupportingEvidencePage({
  navigate,
  customerId,
}: Props) {
  const [data, setData] =
    useState<EcobankCustomerDetail | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      if (!customerId) {
        setError("No customer was selected.");
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
            : "Unable to load supporting evidence."
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [customerId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFB] p-6 lg:p-10">
        <div className="max-w-4xl mx-auto animate-pulse space-y-6">
          <div className="h-8 w-80 bg-slate-200 rounded" />
          <div className="h-36 bg-slate-200 rounded-2xl" />
          <div className="h-64 bg-slate-200 rounded-2xl" />
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
              Evidence Unavailable
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
  const evidence = data.financialEvidence;
  const profile = data.trustProfile;

  return (
    <BankLayout
      current="supporting-evidence"
      navigate={navigate}
    >
      <div className="px-6 sm:px-8 py-8 max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#94A3B8] mb-6">
          <button
            onClick={() =>
              navigate("customer-overview")
            }
            className="hover:text-[#0D2D52] font-medium"
          >
            Customer Insights
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
            Supporting Evidence
          </span>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-widest mb-1">
              Supporting Evidence
            </p>

            <h1 className="text-2xl font-bold text-[#0D1F35]">
              {customer.firstName}{" "}
              {customer.lastName}
            </h1>

            <p className="text-sm text-[#64748B] mt-1">
              Financial behaviour information available to
              TrustID.
            </p>
          </div>

          <Button
            size="sm"
            onClick={() =>
              navigate("recommendation", {
                customerId: customer._id,
              })
            }
          >
            View Assessment →
          </Button>
        </div>

        {/* Financial Evidence */}
        {evidence ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <Card>
                <p className="text-xs text-[#64748B] font-medium">
                  Average Monthly Inflow
                </p>

                <p className="text-xl font-bold text-[#0D1F35] mt-2">
                  {formatCurrency(
                    evidence.averageMonthlyInflow
                  )}
                </p>

                <p className="text-xs text-[#94A3B8] mt-2">
                  Average incoming funds represented in the
                  financial profile.
                </p>
              </Card>

              <Card>
                <p className="text-xs text-[#64748B] font-medium">
                  Average Monthly Savings
                </p>

                <p className="text-xl font-bold text-[#0D1F35] mt-2">
                  {formatCurrency(
                    evidence.averageMonthlySavings
                  )}
                </p>

                <p className="text-xs text-[#94A3B8] mt-2">
                  Average savings contribution represented in
                  the profile.
                </p>
              </Card>

              <Card>
                <p className="text-xs text-[#64748B] font-medium">
                  Repayment On-Time Rate
                </p>

                <div className="flex items-center gap-2 mt-2">
                  <p className="text-xl font-bold text-[#0D1F35]">
                    {evidence.repaymentOnTimeRate}%
                  </p>

                  <Badge
                    variant={getLevelVariant(
                      evidence.repaymentOnTimeRate
                    )}
                  >
                    {getPercentageLevel(
                      evidence.repaymentOnTimeRate
                    )}
                  </Badge>
                </div>

                <div className="mt-4">
                  <ProgressBar
                    value={
                      evidence.repaymentOnTimeRate
                    }
                    max={100}
                    size="sm"
                  />
                </div>
              </Card>

              <Card>
                <p className="text-xs text-[#64748B] font-medium">
                  Savings Rate
                </p>

                <div className="flex items-center gap-2 mt-2">
                  <p className="text-xl font-bold text-[#0D1F35]">
                    {evidence.savingsRate}%
                  </p>

                  <Badge
                    variant={getLevelVariant(
                      evidence.savingsRate
                    )}
                  >
                    {getPercentageLevel(
                      evidence.savingsRate
                    )}
                  </Badge>
                </div>

                <div className="mt-4">
                  <ProgressBar
                    value={evidence.savingsRate}
                    max={100}
                    size="sm"
                  />
                </div>
              </Card>
            </div>

            {/* Cash Flow */}
            <Card className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-[#64748B] font-medium">
                    Cash-flow Stability
                  </p>

                  <p className="text-2xl font-bold text-[#0D1F35] mt-1">
                    {evidence.cashFlowStability}%
                  </p>
                </div>

                <Badge
                  variant={getLevelVariant(
                    evidence.cashFlowStability
                  )}
                  size="md"
                >
                  {getPercentageLevel(
                    evidence.cashFlowStability
                  )}
                </Badge>
              </div>

              <ProgressBar
                value={evidence.cashFlowStability}
                max={100}
              />

              <p className="text-xs text-[#64748B] mt-3 leading-relaxed">
                This represents the cash-flow stability value
                currently recorded in the customer's TrustID
                financial profile.
              </p>
            </Card>
          </>
        ) : (
          <Card className="p-8 text-center mb-6">
            <h2 className="font-semibold text-[#0D2D52]">
              No financial evidence available
            </h2>

            <p className="text-sm text-slate-500 mt-2">
              This customer has not submitted a financial
              profile yet.
            </p>
          </Card>
        )}

        {/* Trust Profile evidence */}
        {profile && (
          <Card className="mb-6">
            <p className="text-xs font-semibold text-[#64748B] uppercase tracking-widest mb-4">
              Trust Profile Evidence
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#F8FAFB]">
                <p className="text-xs text-[#94A3B8]">
                  Trust Score
                </p>

                <p className="text-lg font-bold text-[#0D1F35] mt-1">
                  {profile.totalScore} / 850
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#F8FAFB]">
                <p className="text-xs text-[#94A3B8]">
                  Profile Band
                </p>

                <p className="text-lg font-bold text-[#0D1F35] mt-1">
                  {profile.band}
                </p>
              </div>
            </div>

            <div className="mt-5 pt-5 border-t border-[#E2EAF2]">
              <p className="text-xs font-semibold text-[#64748B] uppercase tracking-widest mb-3">
                Recorded Strengths
              </p>

              {profile.strengths.length > 0 ? (
                <div className="space-y-2">
                  {profile.strengths.map(
                    (strength) => (
                      <p
                        key={strength}
                        className="text-sm text-[#374151]"
                      >
                        <span className="text-emerald-500 mr-2">
                          ✓
                        </span>
                        {strength}
                      </p>
                    )
                  )}
                </div>
              ) : (
                <p className="text-sm text-slate-400">
                  No strengths recorded.
                </p>
              )}
            </div>

            <div className="mt-5">
              <p className="text-xs font-semibold text-[#64748B] uppercase tracking-widest mb-3">
                Recorded Opportunities
              </p>

              {profile.opportunities.length > 0 ? (
                <div className="space-y-2">
                  {profile.opportunities.map(
                    (opportunity) => (
                      <p
                        key={opportunity}
                        className="text-sm text-[#374151]"
                      >
                        <span className="text-amber-500 mr-2">
                          →
                        </span>
                        {opportunity}
                      </p>
                    )
                  )}
                </div>
              ) : (
                <p className="text-sm text-slate-400">
                  No opportunities recorded.
                </p>
              )}
            </div>
          </Card>
        )}

        {/* Data limitation */}
        <div className="bg-[#EFF4F9] border border-[#C8D9EC] rounded-2xl p-5 mb-6">
          <p className="text-xs font-semibold text-[#0D2D52] uppercase tracking-widest mb-2">
            Data note
          </p>

          <p className="text-sm text-[#374151] leading-relaxed">
            The current TrustID competition prototype uses
            simulated financial behaviour data. The evidence
            shown here reflects the information currently stored
            in the customer's financial profile; it should not be
            interpreted as direct access to a customer's real
            bank transaction history.
          </p>
        </div>

        {/* Disclaimer */}
        <div className="border-2 border-[#E2EAF2] rounded-2xl p-5 mb-6">
          <p className="text-sm text-[#374151] leading-relaxed text-center">
            <span className="font-bold text-[#0D2D52]">
              TrustID provides additional information for
              decision support.
            </span>{" "}
            Ecobank retains responsibility for the final
            lending decision.
          </p>
        </div>

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
            onClick={() =>
              navigate("decision-support", {
                customerId: customer._id,
              })
            }
          >
            Decision Support →
          </Button>
        </div>
      </div>
    </BankLayout>
  );
}