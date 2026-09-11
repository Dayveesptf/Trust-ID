import { useState } from "react";
import { Button } from "../components/ui";
import logotext from "../assets/logo-nav-light.png";
import { saveFinancialProfile } from "../services/financialProfileService";

interface Props {
  navigate: (s: string) => void;
}

/**
 * Competition prototype data.
 *
 * These are normalized behavioural metrics rather than real bank data.
 * They are intentionally fixed for the demo so every participant sees
 * a deterministic TrustID calculation.
 *
 * Expected score:
 * 742 / 850 — Strong
 */
const simulatedFinancialProfile = {
  incomeConsistency: 90,
  savingsRate: 88,
  savingsStreakMonths: 4,
  repaymentOnTimeRate: 95,
  missedPayments: 2,
  cashFlowStability: 90,
  lowBalanceDays: 3,
  budgetingDiscipline: 90,
  recurringPaymentConsistency: 90,

  averageMonthlyInflow: 450000,
  averageMonthlySavings: 90000,
  monthlyExpenses: 320000,
};

export default function ConnectPage({ navigate }: Props) {
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState("");

  const handleStartAnalysis = async () => {
    setError("");
    setConnecting(true);

    try {
      await saveFinancialProfile(simulatedFinancialProfile);
      navigate("analysis");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to prepare your financial profile."
      );
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFB] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg animate-fade-in-up">
        <div className="flex items-center gap-2 mb-8">
          <img src={logotext} alt="TrustID" className="h-7 w-auto" />
        </div>

        {/* Demo disclaimer banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6 flex items-center gap-3">
          <svg
            className="h-4 w-4 text-amber-600 shrink-0"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path
              d="M8 1.5L1 14.5h14L8 1.5z"
              strokeLinejoin="round"
            />
            <path d="M8 6v4M8 11.5v.5" strokeLinecap="round" />
          </svg>

          <p className="text-xs font-medium text-amber-800">
            <span className="font-bold">Demo environment</span> — no real
            financial data is being accessed.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2EAF2] shadow-sm p-8 mb-6">
          <h1 className="text-2xl font-bold text-[#0D1F35] tracking-tight mb-2">
            Connect Your Financial Profile
          </h1>

          <p className="text-sm text-[#64748B] leading-relaxed mb-8">
            For this prototype, we're using simulated financial activity to
            demonstrate how TrustID works. In production, TrustID would analyse
            your real financial behaviour with your explicit consent.
          </p>

          {/* Connected account card */}
          <div className="border-2 border-emerald-200 bg-emerald-50 rounded-2xl p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[#0D2D52] flex items-center justify-center">
                  <span className="text-white text-xs font-bold">EC</span>
                </div>

                <div>
                  <p className="text-sm font-bold text-[#0D1F35]">
                    Ecobank Nigeria
                  </p>
                  <p className="text-xs text-[#64748B]">
                    Current Account · ****4521
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Connected
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "7 months", desc: "Activity data" },
                { label: "Simulated", desc: "Data source" },
                { label: "Ready", desc: "Status" },
              ].map(({ label, desc }) => (
                <div
                  key={desc}
                  className="bg-white rounded-xl p-3 border border-emerald-100"
                >
                  <p className="text-sm font-bold text-[#0D1F35]">
                    {label}
                  </p>
                  <p className="text-xs text-[#64748B]">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Ready to analyse */}
          <div className="flex items-center gap-3 bg-[#F8FAFB] rounded-xl p-4 border border-[#E2EAF2] mb-2">
            <div className="h-9 w-9 rounded-xl bg-[#EFF4F9] flex items-center justify-center shrink-0">
              <svg
                className="h-4.5 w-4.5 text-[#0D2D52]"
                viewBox="0 0 18 18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <circle cx="9" cy="9" r="7.5" />
                <path
                  d="M9 5v4l3 2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div>
              <p className="text-sm font-semibold text-[#0D1F35]">
                Ready to analyse
              </p>
              <p className="text-xs text-[#64748B]">
                7 months of simulated financial activity prepared
              </p>
            </div>

            <div className="ml-auto">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-xs font-medium text-red-700">
                {error}
              </p>
            </div>
          )}
        </div>

        {/* What will be analysed */}
        <div className="bg-white rounded-2xl border border-[#E2EAF2] p-5 mb-6">
          <p className="text-xs font-semibold text-[#64748B] uppercase tracking-widest mb-3">
            What TrustID will analyse
          </p>

          <div className="grid grid-cols-2 gap-2">
            {[
              "Income patterns",
              "Savings behaviour",
              "Repayment history",
              "Cash-flow activity",
              "Financial discipline",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 text-xs text-[#374151]"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <Button
          onClick={handleStartAnalysis}
          fullWidth
          size="lg"
          disabled={connecting}
        >
          {connecting ? "Preparing Analysis…" : "Start Analysis →"}
        </Button>

        <p className="text-center text-xs text-[#94A3B8] mt-4">
          Analysis takes approximately 10 seconds · Demo prototype only
        </p>
      </div>
    </div>
  );
}