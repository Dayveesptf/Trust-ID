import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ShieldCheck,
  Info,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

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

export default function DecisionSupportPage({
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
      <div className="min-h-screen bg-[#F8FAFB] p-6 lg:p-10">
        <div className="max-w-5xl mx-auto animate-pulse space-y-6">
          <div className="h-8 w-72 bg-slate-200 rounded" />
          <div className="h-40 bg-slate-200 rounded-2xl" />
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
            Decision Support
          </p>

          <h1 className="text-2xl font-bold text-[#0D2D52] mt-1">
            {customer.firstName} {customer.lastName}
          </h1>

          <p className="text-sm text-slate-500 mt-2">
            Structured information for an Ecobank analyst's
            review.
          </p>
        </div>

        {/* Critical disclaimer */}
        <div className="bg-[#0D2D52] text-white rounded-2xl p-5 mb-6 flex gap-4">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
            <Info size={20} />
          </div>

          <div>
            <p className="font-bold text-sm">
              Decision responsibility remains with Ecobank
            </p>

            <p className="text-sm text-white/70 leading-6 mt-1">
              TrustID provides additional financial behaviour
              information for decision support. It does not
              approve or reject financial products. Ecobank
              retains full responsibility for the final
              lending decision.
            </p>
          </div>
        </div>

        {!profile ? (
          <Card className="p-10 text-center">
            <ShieldCheck
              size={44}
              className="mx-auto text-slate-300"
            />

            <h2 className="font-bold text-[#0D2D52] mt-4">
              Trust Profile Unavailable
            </h2>

            <p className="text-sm text-slate-500 mt-2">
              There is not enough TrustID information to
              prepare decision-support context.
            </p>
          </Card>
        ) : (
          <>
            {/* Summary */}
            <Card className="p-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <p className="text-xs uppercase tracking-widest font-semibold text-slate-400">
                    TrustID Profile
                  </p>

                  <div className="flex items-baseline gap-2 mt-2">
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

            {/* Factor summary */}
            <Card className="p-6 mb-6">
              <h2 className="text-lg font-bold text-[#0D2D52]">
                Behavioural Assessment
              </h2>

              <p className="text-sm text-slate-500 mt-1 mb-6">
                The following factors explain the TrustID
                profile.
              </p>

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
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-[#0D2D52]">
                            {getFactorLabel(key)}
                          </span>

                          <span className="text-sm text-slate-500">
                            {factor.score}/{factor.max}
                          </span>
                        </div>

                        <ProgressBar
                          value={factor.score}
                          max={factor.max}
                        />

                        <p className="text-xs text-slate-400 text-right mt-1">
                          {percentage}%
                        </p>
                      </div>
                    );
                  }
                )}
              </div>
            </Card>

            {/* Positive signals */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-5">
                  <CheckCircle2
                    size={21}
                    className="text-emerald-600"
                  />

                  <h2 className="font-bold text-[#0D2D52]">
                    Positive Signals
                  </h2>
                </div>

                <div className="space-y-4">
                  {profile.strengths.length > 0 ? (
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
                      No positive signals recorded.
                    </p>
                  )}
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3 mb-5">
                  <AlertTriangle
                    size={21}
                    className="text-amber-600"
                  />

                  <h2 className="font-bold text-[#0D2D52]">
                    Areas for Review
                  </h2>
                </div>

                <div className="space-y-4">
                  {profile.opportunities.length > 0 ? (
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
                      No specific areas for review recorded.
                    </p>
                  )}
                </div>
              </Card>
            </div>

            {/* Final analyst panel */}
            <Card className="p-6 mt-6 border-2 border-[#0D2D52]">
              <div className="flex gap-4">
                <ShieldCheck
                  size={25}
                  className="text-[#0D2D52] shrink-0"
                />

                <div>
                  <h2 className="font-bold text-[#0D2D52]">
                    Analyst Review Context
                  </h2>

                  <p className="text-sm text-slate-600 leading-6 mt-2">
                    This TrustID profile can be considered as
                    one additional source of financial
                    behaviour information alongside Ecobank's
                    existing assessment processes.
                  </p>

                  <div className="mt-4 p-4 bg-slate-50 rounded-xl">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Prototype Boundary
                    </p>

                    <p className="text-sm text-slate-600 leading-6 mt-2">
                      TrustID does not make the final lending
                      decision, calculate an official credit
                      limit, or disburse a loan.
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Button
                variant="secondary"
                onClick={() =>
                  navigate("recommendation", {
                    customerId: customer._id,
                  })
                }
              >
                <ArrowLeft size={16} />
                Assessment
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
                  navigate("customer-overview")
                }
              >
                Finish Review
              </Button>
            </div>
          </>
        )}

        <div className="mt-8 text-xs text-slate-400 leading-5">
          {data.decisionNotice}
        </div>
      </div>
    </BankLayout>
  );
}