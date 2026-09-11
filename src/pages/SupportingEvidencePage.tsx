import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Mail,
  Phone,
  Calendar,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

import { BankLayout } from "../components/Layout";
import {
  Avatar,
  Badge,
  Button,
  Card,
  ProgressBar,
} from "../components/ui";

import {
  EcobankCustomerDetail,
  EcobankTrustProfile,
  getEcobankCustomer,
} from "../services/ecobankService";

interface Props {
  customerId?: string;
  navigate: (
    screen: string,
    params?: { customerId?: string }
  ) => void;
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

function getInitials(firstName: string, lastName: string) {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

function formatDate(date?: string) {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatCurrency(value?: number) {
  if (value === undefined || value === null) return "—";

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
}

function getFactorLevel(score: number, max: number) {
  const percentage = max > 0 ? (score / max) * 100 : 0;

  if (percentage >= 90) return "Excellent";
  if (percentage >= 75) return "Strong";
  if (percentage >= 60) return "Good";
  if (percentage >= 40) return "Fair";
  return "Developing";
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

function FactorRow({
  label,
  factor,
}: {
  label: string;
  factor: { score: number; max: number };
}) {
  const percentage =
    factor.max > 0
      ? Math.round((factor.score / factor.max) * 100)
      : 0;

  return (
    <div className="py-5 border-b border-slate-100 last:border-b-0">
      <div className="flex items-center justify-between gap-4 mb-2">
        <div>
          <p className="font-semibold text-[#0D2D52]">
            {label}
          </p>

          <p className="text-xs text-slate-500 mt-1">
            {factor.score} / {factor.max} points
          </p>
        </div>

        <div className="text-right">
          <p className="font-bold text-[#0D2D52]">
            {percentage}%
          </p>

          <p className="text-xs text-slate-500">
            {getFactorLevel(factor.score, factor.max)}
          </p>
        </div>
      </div>

      <ProgressBar
        value={factor.score}
        max={factor.max}
      />
    </div>
  );
}

function TrustSummary({
  profile,
}: {
  profile: EcobankTrustProfile;
}) {
  return (
    <Card className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <p className="text-sm font-medium text-slate-500">
            TrustID Score
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

        <Badge variant={getBandVariant(profile.band)}>
          {profile.band}
        </Badge>
      </div>

      <div className="mt-6">
        <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-[#0D2D52] transition-all"
            style={{
              width: `${Math.min(
                (profile.totalScore / 850) * 100,
                100
              )}%`,
            }}
          />
        </div>

        <div className="flex justify-between text-xs text-slate-400 mt-2">
          <span>0</span>
          <span>850</span>
        </div>
      </div>

      <p className="text-xs text-slate-500 leading-5 mt-4">
        TrustID provides an explainable view of the
        customer's financial behaviour. It is intended as
        decision-support information and not as an automatic
        lending decision.
      </p>
    </Card>
  );
}

export default function CustomerDetailPage({
  customerId,
  navigate,
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
          <div className="h-6 w-48 bg-slate-200 rounded" />
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
            <AlertCircle className="mx-auto text-red-500" size={40} />

            <h1 className="text-xl font-bold text-[#0D2D52] mt-4">
              Customer Profile Unavailable
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
  const evidence = data.financialEvidence;

  return (
    <BankLayout
      current="customer-overview"
      navigate={navigate}
    >
      <div className="px-6 sm:px-8 py-8 max-w-6xl mx-auto">
        <button
          onClick={() =>
            navigate("customer-overview")
          }
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-[#0D2D52] mb-6"
        >
          <ArrowLeft size={16} />
          Back to Customers
        </button>

        {/* Customer header */}
        <Card className="p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <Avatar
                initials={getInitials(
                  customer.firstName,
                  customer.lastName
                )}
                size="lg"
              />

              <div>
                <h1 className="text-2xl font-bold text-[#0D2D52]">
                  {customer.firstName}{" "}
                  {customer.lastName}
                </h1>

                <div className="flex flex-wrap gap-x-5 gap-y-2 mt-2 text-sm text-slate-500">
                  <span className="flex items-center gap-2">
                    <Mail size={15} />
                    {customer.email}
                  </span>

                  <span className="flex items-center gap-2">
                    <Phone size={15} />
                    {customer.phone}
                  </span>

                  <span className="flex items-center gap-2">
                    <Calendar size={15} />
                    Joined {formatDate(customer.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            <Badge variant={customer.onboardingCompleted ? "success" : "warning"}>
              {customer.onboardingCompleted
                ? "Onboarding Complete"
                : "Onboarding Pending"}
            </Badge>
          </div>
        </Card>

        {!profile ? (
          <Card className="p-10 text-center mb-6">
            <ShieldCheck
              size={42}
              className="mx-auto text-slate-300"
            />

            <h2 className="text-lg font-bold text-[#0D2D52] mt-4">
              Trust Profile Not Available
            </h2>

            <p className="text-sm text-slate-500 mt-2">
              This customer has not generated a TrustID
              profile yet.
            </p>
          </Card>
        ) : (
          <>
            <TrustSummary profile={profile} />

            {/* Factors */}
            <Card className="p-6 mt-6">
              <div className="mb-5">
                <p className="text-xs uppercase tracking-widest font-semibold text-slate-400">
                  Score Breakdown
                </p>

                <h2 className="text-xl font-bold text-[#0D2D52] mt-1">
                  Five TrustID Factors
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  The score is built from explainable financial
                  behaviour signals.
                </p>
              </div>

              {Object.entries(profile.factors).map(
                ([key, factor]) => (
                  <FactorRow
                    key={key}
                    label={getFactorLabel(key)}
                    factor={factor}
                  />
                )
              )}
            </Card>

            {/* Evidence snapshot */}
            {evidence && (
              <Card className="p-6 mt-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-xs uppercase tracking-widest font-semibold text-slate-400">
                      Financial Snapshot
                    </p>

                    <h2 className="text-xl font-bold text-[#0D2D52] mt-1">
                      Supporting Evidence
                    </h2>
                  </div>

                  <TrendingUp
                    size={22}
                    className="text-[#0D2D52]"
                  />
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs text-slate-500">
                      Monthly Inflow
                    </p>
                    <p className="font-bold text-[#0D2D52] mt-1">
                      {formatCurrency(
                        evidence.averageMonthlyInflow
                      )}
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs text-slate-500">
                      Monthly Savings
                    </p>
                    <p className="font-bold text-[#0D2D52] mt-1">
                      {formatCurrency(
                        evidence.averageMonthlySavings
                      )}
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs text-slate-500">
                      Savings Rate
                    </p>
                    <p className="font-bold text-[#0D2D52] mt-1">
                      {evidence.savingsRate}%
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs text-slate-500">
                      Repayment Rate
                    </p>
                    <p className="font-bold text-[#0D2D52] mt-1">
                      {evidence.repaymentOnTimeRate}%
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs text-slate-500">
                      Cash-flow Stability
                    </p>
                    <p className="font-bold text-[#0D2D52] mt-1">
                      {evidence.cashFlowStability}%
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Strengths / opportunities */}
            <div className="grid lg:grid-cols-2 gap-6 mt-6">
              <Card className="p-6">
                <h2 className="font-bold text-[#0D2D52]">
                  Strengths
                </h2>

                <div className="space-y-3 mt-4">
                  {profile.strengths.length > 0 ? (
                    profile.strengths.map((item, index) => (
                      <div
                        key={index}
                        className="flex gap-3"
                      >
                        <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                          ✓
                        </div>

                        <p className="text-sm text-slate-600 leading-6">
                          {item}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">
                      No strengths have been recorded.
                    </p>
                  )}
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="font-bold text-[#0D2D52]">
                  Opportunities
                </h2>

                <div className="space-y-3 mt-4">
                  {profile.opportunities.length > 0 ? (
                    profile.opportunities.map(
                      (item, index) => (
                        <div
                          key={index}
                          className="flex gap-3"
                        >
                          <div className="w-6 h-6 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                            !
                          </div>

                          <p className="text-sm text-slate-600 leading-6">
                            {item}
                          </p>
                        </div>
                      )
                    )
                  ) : (
                    <p className="text-sm text-slate-500">
                      No opportunities have been recorded.
                    </p>
                  )}
                </div>
              </Card>
            </div>

            {/* Actions */}
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
                  navigate("recommendation", {
                    customerId: customer._id,
                  })
                }
              >
                View Assessment
                <ArrowRight size={16} />
              </Button>

              <Button
                variant="secondary"
                onClick={() =>
                  navigate("decision-support", {
                    customerId: customer._id,
                  })
                }
              >
                Decision Support
              </Button>
            </div>
          </>
        )}

        <div className="mt-8 p-4 bg-slate-50 rounded-xl text-xs text-slate-500 leading-5">
          <strong className="text-slate-700">
            Decision-support notice:
          </strong>{" "}
          {data.decisionNotice}
        </div>
      </div>
    </BankLayout>
  );
}