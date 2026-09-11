import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

import {
  Avatar,
  Badge,
  Button,
  Card,
  ProgressBar,
} from "../components/ui";
import { BankLayout } from "../components/Layout";

import {
  EcobankCustomerDetail,
  EcobankTrustProfile,
  getEcobankCustomer,
} from "../services/ecobankService";

interface CustomerDetailPageProps {
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
    case "Needs Improvement":
      return "neutral";
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

interface FactorRowProps {
  label: string;
  factor: {
    score: number;
    max: number;
  };
}

function FactorRow({ label, factor }: FactorRowProps) {
  const percentage =
    factor.max > 0
      ? Math.round((factor.score / factor.max) * 100)
      : 0;

  const level = getFactorLevel(factor.score, factor.max);

  return (
    <div className="py-5 first:pt-0 last:pb-0">
      <div className="mb-2 flex items-center justify-between gap-4">
        <div>
          <p className="font-medium text-[#0D2D52]">
            {label}
          </p>

          <p className="mt-0.5 text-xs text-[#64748B]">
            {factor.score} / {factor.max} points
          </p>
        </div>

        <div className="text-right">
          <p className="font-bold text-[#0D2D52]">
            {percentage}%
          </p>

          <p className="text-xs text-[#64748B]">
            {level}
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
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-[#64748B]">
            TrustID Score
          </p>

          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-4xl font-bold text-[#0D2D52]">
              {profile.totalScore}
            </span>

            <span className="text-sm text-[#94A3B8]">
              / 850
            </span>
          </div>
        </div>

        <Badge variant={getBandVariant(profile.band)}>
          {profile.band}
        </Badge>
      </div>

      <div className="mt-6 h-3 overflow-hidden rounded-full bg-[#E2EAF2]">
        <div
          className="h-full rounded-full bg-[#0D2D52] transition-all duration-700"
          style={{
            width: `${Math.min(
              (profile.totalScore / 850) * 100,
              100
            )}%`,
          }}
        />
      </div>

      <p className="mt-3 text-xs leading-5 text-[#64748B]">
        This score represents the customer's financial
        behaviour profile within the TrustID prototype.
      </p>
    </Card>
  );
}

export default function CustomerDetailPage({
  customerId,
  navigate,
}: CustomerDetailPageProps) {
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

  async function loadCustomer() {
    try {
      setLoading(true);
      setError("");

      const result =
        await getEcobankCustomer(selectedCustomerId);

      setData(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load customer profile."
      );
    } finally {
      setLoading(false);
    }
  }

  loadCustomer();
}, [customerId]);
  if (loading) {
    return (
      <BankLayout current="customer-detail" navigate={navigate}>
        <div className="min-h-screen bg-[#F8FAFB] pt-14 lg:pt-0">
        <div className="mx-auto max-w-6xl px-6 py-10 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-5 w-32 rounded bg-[#E2EAF2]" />
            <div className="h-32 rounded-2xl bg-[#E2EAF2]" />
            <div className="h-64 rounded-2xl bg-[#E2EAF2]" />
          </div>
        </div>
        </div>
      </BankLayout>
    );
  }

  if (error || !data) {
    return (
      <BankLayout current="customer-detail" navigate={navigate}>
        <div className="min-h-screen bg-[#F8FAFB] pt-14 lg:pt-0">
        <div className="mx-auto max-w-3xl px-6 py-16 text-center">
          <Card className="p-8">
            <h2 className="text-xl font-bold text-[#0D2D52]">
              Unable to load customer
            </h2>

            <p className="mt-2 text-sm text-[#64748B]">
              {error || "Customer information is unavailable."}
            </p>

            <Button
              className="mt-6"
              variant="secondary"
              onClick={() => navigate("customer-overview")}
            >
              <ArrowLeft size={16} />
              Back to Customers
            </Button>
          </Card>
        </div>
        </div>
      </BankLayout>
    );
  }

  const {
    customer,
    trustProfile,
    financialEvidence,
    decisionNotice,
  } = data;

  const firstName = customer.firstName;
  const lastName = customer.lastName;

  return (
    <BankLayout current="customer-detail" navigate={navigate}>
      <div className="min-h-screen bg-[#F8FAFB] pt-14 lg:pt-0">
      {/* Header */}
      <div className="border-b border-[#E2EAF2] bg-white">
        <div className="mx-auto max-w-6xl px-6 py-6 lg:px-8">
          <button
            onClick={() => navigate("customer-overview")}
            className="mb-5 flex items-center gap-2 text-sm font-medium text-[#64748B] transition hover:text-[#0D2D52]"
          >
            <ArrowLeft size={16} />
            Back to Customers
          </button>

          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <Avatar
                initials={getInitials(firstName, lastName)}
                size="lg"
              />

              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-bold text-[#0D2D52]">
                    {firstName} {lastName}
                  </h1>

                  {trustProfile && (
                    <Badge
                      variant={getBandVariant(
                        trustProfile.band
                      )}
                    >
                      {trustProfile.band}
                    </Badge>
                  )}
                </div>

                <p className="mt-1 text-sm text-[#64748B]">
                  TrustID Customer Profile
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
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
                Decision Support
                <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-6 py-8 lg:px-8">
        {/* Customer information */}
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <Card className="p-5">
            <div className="flex items-start gap-3">
              <Mail
                size={18}
                className="mt-0.5 text-[#2563A0]"
              />

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[#94A3B8]">
                  Email
                </p>

                <p className="mt-1 break-all text-sm font-medium text-[#0D2D52]">
                  {customer.email}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-start gap-3">
              <Phone
                size={18}
                className="mt-0.5 text-[#2563A0]"
              />

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[#94A3B8]">
                  Phone
                </p>

                <p className="mt-1 text-sm font-medium text-[#0D2D52]">
                  {customer.phone}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-start gap-3">
              <Calendar
                size={18}
                className="mt-0.5 text-[#2563A0]"
              />

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[#94A3B8]">
                  Customer Since
                </p>

                <p className="mt-1 text-sm font-medium text-[#0D2D52]">
                  {formatDate(customer.createdAt)}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {!trustProfile ? (
          <Card className="p-8 text-center">
            <ShieldCheck
              size={40}
              className="mx-auto text-[#94A3B8]"
            />

            <h2 className="mt-4 text-lg font-bold text-[#0D2D52]">
              Trust Profile Not Available
            </h2>

            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#64748B]">
              This customer has not generated a TrustID
              financial behaviour profile yet.
            </p>

            <div className="mt-6">
              <Button
                variant="secondary"
                onClick={() =>
                  navigate("customer-overview")
                }
              >
                <ArrowLeft size={16} />
                Back to Customers
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            {/* Left */}
            <div className="space-y-6">
              <TrustSummary profile={trustProfile} />

              <Card className="p-6">
                <div className="mb-5">
                  <h2 className="text-lg font-bold text-[#0D2D52]">
                    Trust Factors
                  </h2>

                  <p className="mt-1 text-sm text-[#64748B]">
                    Breakdown of the customer's TrustID score.
                  </p>
                </div>

                <div className="divide-y divide-[#E2EAF2]">
                  <FactorRow
                    label="Income Consistency"
                    factor={
                      trustProfile.factors.incomeConsistency
                    }
                  />

                  <FactorRow
                    label="Savings Behaviour"
                    factor={
                      trustProfile.factors.savingsBehaviour
                    }
                  />

                  <FactorRow
                    label="Repayment Behaviour"
                    factor={
                      trustProfile.factors.repaymentBehaviour
                    }
                  />

                  <FactorRow
                    label="Cash-flow Stability"
                    factor={
                      trustProfile.factors.cashFlowStability
                    }
                  />

                  <FactorRow
                    label="Financial Discipline"
                    factor={
                      trustProfile.factors.financialDiscipline
                    }
                  />
                </div>
              </Card>
            </div>

            {/* Right */}
            <div className="space-y-6">
              <Card className="p-6">
                <h2 className="text-lg font-bold text-[#0D2D52]">
                  Financial Evidence
                </h2>

                <p className="mt-1 text-sm text-[#64748B]">
                  Key indicators supporting the TrustID profile.
                </p>

                {financialEvidence ? (
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center justify-between gap-4 border-b border-[#E2EAF2] pb-4">
                      <span className="text-sm text-[#64748B]">
                        Average monthly inflow
                      </span>

                      <span className="font-semibold text-[#0D2D52]">
                        {formatCurrency(
                          financialEvidence.averageMonthlyInflow
                        )}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4 border-b border-[#E2EAF2] pb-4">
                      <span className="text-sm text-[#64748B]">
                        Average monthly savings
                      </span>

                      <span className="font-semibold text-[#0D2D52]">
                        {formatCurrency(
                          financialEvidence.averageMonthlySavings
                        )}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4 border-b border-[#E2EAF2] pb-4">
                      <span className="text-sm text-[#64748B]">
                        Repayment on-time rate
                      </span>

                      <span className="font-semibold text-[#0D2D52]">
                        {financialEvidence.repaymentOnTimeRate}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4 border-b border-[#E2EAF2] pb-4">
                      <span className="text-sm text-[#64748B]">
                        Savings rate
                      </span>

                      <span className="font-semibold text-[#0D2D52]">
                        {financialEvidence.savingsRate}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm text-[#64748B]">
                        Cash-flow stability
                      </span>

                      <span className="font-semibold text-[#0D2D52]">
                        {financialEvidence.cashFlowStability}%
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="mt-6 text-sm text-[#64748B]">
                    Financial evidence is not available.
                  </p>
                )}
              </Card>

              <Card className="p-6">
                <h2 className="text-lg font-bold text-[#0D2D52]">
                  Profile Insights
                </h2>

                {trustProfile.strengths.length > 0 && (
                  <div className="mt-5">
                    <p className="text-sm font-semibold text-[#0D2D52]">
                      Strengths
                    </p>

                    <ul className="mt-3 space-y-2">
                      {trustProfile.strengths.map(
                        (strength) => (
                          <li
                            key={strength}
                            className="flex gap-2 text-sm leading-5 text-[#475569]"
                          >
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#10B981]" />
                            {strength}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}

                {trustProfile.opportunities.length > 0 && (
                  <div className="mt-6">
                    <p className="text-sm font-semibold text-[#0D2D52]">
                      Opportunities
                    </p>

                    <ul className="mt-3 space-y-2">
                      {trustProfile.opportunities.map(
                        (opportunity) => (
                          <li
                            key={opportunity}
                            className="flex gap-2 text-sm leading-5 text-[#475569]"
                          >
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#F59E0B]" />
                            {opportunity}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
              </Card>

              <Card className="border-[#D7E5F0] bg-[#F1F7FB] p-5">
                <div className="flex gap-3">
                  <ShieldCheck
                    size={20}
                    className="mt-0.5 shrink-0 text-[#2563A0]"
                  />

                  <p className="text-xs leading-5 text-[#475569]">
                    {decisionNotice}
                  </p>
                </div>
              </Card>
            </div>
          </div>
        )}
      </main>
      </div>
    </BankLayout>
  );
}