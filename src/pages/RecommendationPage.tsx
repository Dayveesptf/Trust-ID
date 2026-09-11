import { useEffect, useState } from "react";
import { BankLayout } from "../components/Layout";
import {
  Card,
  Badge,
  Button,
  ScoreRing,
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

export default function RecommendationPage({
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
            : "Unable to load the TrustID assessment."
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
          <div className="h-48 bg-slate-200 rounded-2xl" />
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
              Assessment Unavailable
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
      current="recommendation"
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
            TrustID Assessment
          </span>
        </div>

        <div className="mb-8">
          <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-widest mb-1">
            TrustID Assessment
          </p>

          <h1 className="text-2xl font-bold text-[#0D1F35]">
            {customer.firstName}{" "}
            {customer.lastName}
          </h1>

          <p className="text-sm text-[#64748B] mt-2">
            Explainable behavioural assessment generated
            from the customer's Trust Profile.
          </p>
        </div>

        {!profile ? (
          <Card className="p-8 text-center">
            <h2 className="font-semibold text-[#0D2D52]">
              No Trust Profile available
            </h2>

            <p className="text-sm text-slate-500 mt-2">
              There is currently no TrustID assessment for this
              customer.
            </p>
          </Card>
        ) : (
          <>
            {/* Assessment card */}
            <Card className="mb-6 border-2 border-[#0D2D52]">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative shrink-0">
                  <ScoreRing
                    score={profile.totalScore}
                    max={850}
                    size={130}
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

                <div className="text-center sm:text-left">
                  <p className="text-xs font-semibold text-[#64748B] uppercase tracking-widest mb-2">
                    Financial Credibility Band
                  </p>

                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <Badge
                      variant={getBandVariant(
                        profile.band
                      )}
                      size="md"
                    >
                      {profile.band}
                    </Badge>
                  </div>

                  <p className="text-sm text-[#64748B] mt-3 leading-6">
                    The TrustID profile indicates the
                    financial behaviour represented by this
                    score and band.
                  </p>
                </div>
              </div>
            </Card>

            {/* Strengths */}
            <Card className="mb-6">
              <p className="text-xs font-semibold text-[#64748B] uppercase tracking-widest mb-4">
                Positive Signals
              </p>

              {profile.strengths.length > 0 ? (
                <div className="space-y-3">
                  {profile.strengths.map(
                    (strength) => (
                      <div
                        key={strength}
                        className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50/60 border border-emerald-100"
                      >
                        <span className="text-emerald-600 font-bold">
                          ✓
                        </span>

                        <p className="text-sm text-[#374151]">
                          {strength}
                        </p>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <p className="text-sm text-slate-400">
                  No positive signals recorded.
                </p>
              )}
            </Card>

            {/* Considerations */}
            <Card className="mb-6">
              <p className="text-xs font-semibold text-[#64748B] uppercase tracking-widest mb-4">
                Areas Requiring Attention
              </p>

              {profile.opportunities.length > 0 ? (
                <div className="space-y-3">
                  {profile.opportunities.map(
                    (opportunity) => (
                      <div
                        key={opportunity}
                        className="flex items-start gap-3 p-3 rounded-xl bg-amber-50/60 border border-amber-100"
                      >
                        <span className="text-amber-600 font-bold">
                          →
                        </span>

                        <p className="text-sm text-[#374151]">
                          {opportunity}
                        </p>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <p className="text-sm text-slate-400">
                  No major areas requiring attention were
                  identified.
                </p>
              )}
            </Card>

            {/* Responsible decision notice */}
            <div className="bg-[#EFF4F9] border border-[#C8D9EC] rounded-2xl p-5 mb-6">
              <p className="text-sm text-[#0D2D52] leading-relaxed">
                <span className="font-bold">
                  TrustID Assessment Disclaimer:
                </span>{" "}
                This assessment provides behavioural insights
                to support review. It does not recommend,
                approve or reject a lending decision. Ecobank
                analysts retain full responsibility for all
                credit and lending determinations.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() =>
                  navigate("decision-support", {
                    customerId: customer._id,
                  })
                }
              >
                Proceed to Decision Support →
              </Button>

              <Button
                variant="secondary"
                onClick={() =>
                  navigate("supporting-evidence", {
                    customerId: customer._id,
                  })
                }
              >
                ← View Evidence
              </Button>
            </div>
          </>
        )}
      </div>
    </BankLayout>
  );
}