import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
} from "lucide-react";

import { BankLayout } from "../components/Layout";
import {
  Badge,
  Button,
  Card,
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

export default function RecommendationPage({
  navigate,
  customerId,
}: Props) {
  const [data, setData] =
    useState<EcobankCustomerDetail | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

useEffect(() => {
  if (!customerId) {
    setError("No customer was selected.");
    setLoading(false);
    return;
  }

  const selectedCustomerId = customerId;

  let cancelled = false;

  async function loadCustomer() {
    try {
      setLoading(true);
      setError("");

      const result =
        await getEcobankCustomer(selectedCustomerId);

      if (!cancelled) {
        setData(result);
      }
    } catch (err) {
      if (!cancelled) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load customer profile."
        );
      }
    } finally {
      if (!cancelled) {
        setLoading(false);
      }
    }
  }

  loadCustomer();

  return () => {
    cancelled = true;
  };
}, [customerId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFB] p-6">
        <div className="max-w-5xl mx-auto animate-pulse space-y-5">
          <div className="h-8 w-72 bg-slate-200 rounded" />
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
            <h1 className="text-xl font-bold text-[#0D2D52]">
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
      <div className="px-6 sm:px-8 py-8 max-w-5xl mx-auto">
        <button
          onClick={() =>
            navigate("customer-detail", {
              customerId: customer._id,
            })
          }
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-[#0D2D52] mb-6"
        >
          <ArrowLeft size={16} />
          Back to Customer Profile
        </button>

        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest font-semibold text-slate-400">
            TrustID Assessment
          </p>

          <h1 className="text-2xl font-bold text-[#0D2D52] mt-1">
            {customer.firstName} {customer.lastName}
          </h1>

          <p className="text-sm text-slate-500 mt-2">
            Explainable assessment of the customer's financial
            behaviour.
          </p>
        </div>

        {!profile ? (
          <Card className="p-10 text-center">
            <ShieldCheck
              size={44}
              className="mx-auto text-slate-300"
            />

            <h2 className="font-bold text-[#0D2D52] mt-4">
              No Trust Profile Available
            </h2>

            <p className="text-sm text-slate-500 mt-2">
              There is currently no TrustID assessment for
              this customer.
            </p>
          </Card>
        ) : (
          <>
            <Card className="p-6 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div>
                  <p className="text-sm text-slate-500">
                    TrustID Financial Credibility Score
                  </p>

                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-5xl font-bold text-[#0D2D52]">
                      {profile.totalScore}
                    </span>

                    <span className="text-sm text-slate-400">
                      / 850
                    </span>
                  </div>
                </div>

                <Badge
                  variant={getBandVariant(profile.band)}
                >
                  {profile.band}
                </Badge>
              </div>

              <div className="mt-6">
                <ProgressBar
                  value={profile.totalScore}
                  max={850}
                />
              </div>
            </Card>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-5">
                  <CheckCircle2
                    size={22}
                    className="text-emerald-600"
                  />

                  <h2 className="font-bold text-[#0D2D52]">
                    Key Strengths
                  </h2>
                </div>

                <div className="space-y-4">
                  {profile.strengths.length ? (
                    profile.strengths.map((item, index) => (
                      <div
                        key={index}
                        className="flex gap-3"
                      >
                        <span className="text-emerald-600 font-bold">
                          ✓
                        </span>

                        <p className="text-sm text-slate-600 leading-6">
                          {item}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">
                      No strengths recorded.
                    </p>
                  )}
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3 mb-5">
                  <AlertTriangle
                    size={22}
                    className="text-amber-600"
                  />

                  <h2 className="font-bold text-[#0D2D52]">
                    Areas to Monitor
                  </h2>
                </div>

                <div className="space-y-4">
                  {profile.opportunities.length ? (
                    profile.opportunities.map(
                      (item, index) => (
                        <div
                          key={index}
                          className="flex gap-3"
                        >
                          <span className="text-amber-600 font-bold">
                            !
                          </span>

                          <p className="text-sm text-slate-600 leading-6">
                            {item}
                          </p>
                        </div>
                      )
                    )
                  ) : (
                    <p className="text-sm text-slate-500">
                      No opportunities recorded.
                    </p>
                  )}
                </div>
              </Card>
            </div>

            <Card className="p-6 mt-6">
              <h2 className="font-bold text-[#0D2D52] mb-5">
                Factor Assessment
              </h2>

              <div className="space-y-5">
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
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium text-[#0D2D52]">
                            {getFactorLabel(key)}
                          </span>

                          <span className="text-sm text-slate-500">
                            {factor.score} / {factor.max}
                          </span>
                        </div>

                        <ProgressBar
                          value={factor.score}
                          max={factor.max}
                        />

                        <p className="text-xs text-slate-400 mt-1 text-right">
                          {percentage}%
                        </p>
                      </div>
                    );
                  }
                )}
              </div>
            </Card>

            <div className="mt-6 p-5 rounded-2xl bg-[#0D2D52] text-white">
              <p className="font-bold">
                What this means
              </p>

              <p className="text-sm text-white/70 leading-6 mt-2">
                The TrustID profile gives Ecobank additional
                context about this customer's financial
                behaviour. It does not independently determine
                eligibility, approve credit, or reject an
                application.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
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
                  navigate("decision-support", {
                    customerId: customer._id,
                  })
                }
              >
                Continue to Decision Support
                <ArrowRight size={16} />
              </Button>
            </div>
          </>
        )}
      </div>
    </BankLayout>
  );
}