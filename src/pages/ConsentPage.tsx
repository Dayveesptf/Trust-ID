import { useState } from "react";

import { Button, Checkbox } from "../components/ui";
import { useAuth } from "../context/AuthContext";
import { grantConsent } from "../services/onboardingService";

import logotext from "../assets/logo-nav-light.png";

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

      /*
       * Refresh the authenticated user so that the
       * in-memory auth state immediately knows consent
       * has been granted.
       */
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
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <button
            type="button"
            onClick={() => navigate("landing")}
            className="flex items-center"
          >
            <img
              src={logotext}
              alt="TrustID"
              className="h-7 w-auto"
            />
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2EAF2] shadow-sm overflow-hidden">
          {/* Header */}
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

            <h1 className="text-2xl font-bold text-white tracking-tight mb-2">
              Your data. Your choice.
            </h1>

            <p className="text-white/70 text-sm leading-relaxed">
              TrustID needs your permission to analyse relevant
              financial behaviour to generate your Trust Profile.
              You remain in control.
            </p>
          </div>

          <div className="px-8 py-7">
            {/* What we analyse */}
            <p className="text-xs font-semibold text-[#64748B] uppercase tracking-widest mb-4">
              What we analyse
            </p>

            <div className="space-y-3 mb-8">
              {categories.map((c) => (
                <div
                  key={c.label}
                  className="flex items-start gap-4 p-3.5 rounded-xl bg-[#F8FAFB] border border-[#E2EAF2]"
                >
                  <span className="text-xl shrink-0 mt-0.5">
                    {c.icon}
                  </span>

                  <div>
                    <p className="text-sm font-semibold text-[#0D1F35]">
                      {c.label}
                    </p>

                    <p className="text-xs text-[#64748B] mt-0.5">
                      {c.desc}
                    </p>
                  </div>

                  <div className="ml-auto shrink-0">
                    <div className="h-5 w-5 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                      <svg
                        className="h-3 w-3 text-emerald-600"
                        viewBox="0 0 10 10"
                        fill="none"
                      >
                        <path
                          d="M2 5l2 2.5 4-4"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Privacy note */}
            <div className="bg-[#EFF4F9] border border-[#C8D9EC] rounded-xl p-4 mb-6">
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center shrink-0">
                  <svg
                    className="h-4 w-4 text-[#0D2D52]"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <rect
                      x="3"
                      y="7"
                      width="10"
                      height="7"
                      rx="1.5"
                    />

                    <path
                      d="M5 7V5a3 3 0 016 0v2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <div>
                  <p className="text-xs font-semibold text-[#0D2D52] mb-1">
                    Your privacy matters
                  </p>

                  <p className="text-xs text-[#64748B] leading-relaxed">
                    TrustID only analyses the financial information
                    required to generate your Trust Profile. Your
                    information is not used without your permission.
                  </p>
                </div>
              </div>
            </div>

            {/* Consent checkbox */}
            <div className="mb-6">
              <Checkbox
                checked={consented}
                onChange={(checked) => {
                  setConsented(checked);
                  setError("");
                }}
                label={
                  <span>
                    I agree to let TrustID analyse my financial
                    behaviour to generate my Trust Profile.
                  </span>
                }
              />
            </div>

            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-sm text-red-600 leading-relaxed">
                  {error}
                </p>
              </div>
            )}

            <Button
              type="button"
              fullWidth
              size="lg"
              disabled={!consented || saving}
              onClick={handleConsent}
            >
              {saving
                ? "Saving your consent..."
                : "I Agree & Continue"}
            </Button>

            <p className="text-center text-xs text-[#94A3B8] mt-4 leading-relaxed">
              You can review your consent and financial profile
              information through your TrustID account.
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-[#94A3B8] mt-6">
          © 2026 TrustID · Competition Prototype
        </p>
      </div>
    </div>
  );
}
