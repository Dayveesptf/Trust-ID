import { useState } from "react";
import { Button, Checkbox } from "../components/ui";
import { useAuth } from "../context/AuthContext";
import { grantConsent } from "../services/onboardingService";

import logoNavLight from "../assets/logo-nav-light.png";

interface Props {
  navigate: (s: string) => void;
}

const categories = [
  {
    icon: "💰",
    label: "Income patterns",
    desc: "How regularly and consistently you receive income.",
  },
  {
    icon: "🏦",
    label: "Savings behaviour",
    desc: "How frequently and consistently you set money aside.",
  },
  {
    icon: "✅",
    label: "Repayment behaviour",
    desc: "Whether you meet financial commitments on time.",
  },
  {
    icon: "📊",
    label: "Cash-flow activity",
    desc: "The balance between money coming in and going out.",
  },
  {
    icon: "🎯",
    label: "Financial discipline",
    desc: "How well your spending aligns with your income.",
  },
];

export default function ConsentPage({ navigate }: Props) {
  const { refreshUser } = useAuth();

  const [consented, setConsented] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleConsent = async () => {
    if (!consented || saving) {
      return;
    }

    try {
      setSaving(true);
      setError("");

      await grantConsent();
      await refreshUser();

      navigate("connect");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save your consent."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFB] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-xl animate-fade-in-up">
        <div className="flex items-center gap-2 mb-8">
          <button
            type="button"
            onClick={() => navigate("landing")}
          >
            <img
              src={logoNavLight}
              alt="TrustID"
              className="h-7 w-auto"
            />
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2EAF2] shadow-sm overflow-hidden">
          <div className="bg-[#0D2D52] px-8 py-8">
            <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center mb-4">
              <svg
                className="h-6 w-6 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  d="M12 2L4 6v6c0 5 3.5 9.7 8 11 4.5-1.3 8-6 8-11V6L12 2z"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 12l2 2.5 4-4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <p className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-2">
              Your permission matters
            </p>

            <h1 className="text-2xl font-bold text-white">
              Give consent to analyse your financial behaviour
            </h1>

            <p className="text-sm text-white/65 leading-relaxed mt-3">
              TrustID uses financial behaviour to build an explainable
              financial credibility profile.
            </p>
          </div>

          <div className="p-8">
            <div className="mb-7">
              <p className="text-sm text-[#475569] leading-relaxed">
                By continuing, you agree that TrustID may analyse the
                financial behaviour described below to generate your
                TrustID Score and financial insights.
              </p>
            </div>

            <div className="space-y-3 mb-7">
              {categories.map((category) => (
                <div
                  key={category.label}
                  className="flex items-start gap-4 rounded-xl border border-[#E2EAF2] bg-[#F8FAFB] p-4"
                >
                  <div className="h-10 w-10 rounded-xl bg-white border border-[#E2EAF2] flex items-center justify-center shrink-0">
                    <span className="text-lg">
                      {category.icon}
                    </span>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-[#0D1F35]">
                      {category.label}
                    </p>

                    <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                      {category.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-[#D7E5F2] bg-[#F3F8FC] p-4 mb-6">
              <p className="text-xs text-[#475569] leading-relaxed">
                <span className="font-semibold text-[#0D2D52]">
                  Important:
                </span>{" "}
                TrustID is a competition prototype using simulated
                financial data. No real bank account is accessed
                during this demonstration.
              </p>
            </div>

            <div
              className={`rounded-xl border p-4 mb-5 transition-colors ${
                consented
                  ? "border-emerald-200 bg-emerald-50"
                  : "border-[#E2EAF2] bg-white"
              }`}
            >
              <Checkbox
                checked={consented}
                onChange={(checked: boolean) => {
                  setConsented(checked);

                  if (error) {
                    setError("");
                  }
                }}
                label="I understand and consent to TrustID analysing my financial behaviour for this prototype."
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 mb-5">
                <p className="text-xs font-medium text-red-700">
                  {error}
                </p>
              </div>
            )}

            <Button
              fullWidth
              size="lg"
              disabled={!consented || saving}
              onClick={handleConsent}
            >
              {saving
                ? "Saving Consent…"
                : "I Agree & Continue →"}
            </Button>

            <button
              type="button"
              onClick={() => navigate("onboarding")}
              className="w-full mt-4 text-sm font-medium text-[#64748B] hover:text-[#0D2D52] transition-colors"
            >
              ← Back to onboarding
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-[#94A3B8] mt-5">
          Your financial information remains under your control.
        </p>
      </div>
    </div>
  );
}
