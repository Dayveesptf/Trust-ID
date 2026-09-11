import { useState } from "react";
import { Button, Input } from "../components/ui";
import { useAuth } from "../context/AuthContext";

interface Props {
  navigate: (s: string) => void;
}

export default function EcobankLoginPage({ navigate }: Props) {
  const { login, logout } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set =
    (key: string) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((current) => ({
        ...current,
        [key]: e.target.value,
      }));

      if (error) {
        setError("");
      }
    };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError("");

    if (!form.email || !form.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const user = await login({
        email: form.email.trim(),
        password: form.password,
      });

      /*
       * Only Ecobank officers and administrators
       * can access the Ecobank decision platform.
       */
      if (
        user.role !== "ECOBANK_OFFICER" &&
        user.role !== "ADMIN"
      ) {
        logout();

        throw new Error(
          "This account does not have Ecobank access."
        );
      }

      navigate("customer-overview");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to sign in. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F0F4F9] flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] bg-[#0D2D52] p-10 shrink-0 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full border border-white"
              style={{
                width: `${(i + 1) * 120}px`,
                height: `${(i + 1) * 120}px`,
                top: "50%",
                left: "50%",
                transform: "translate(-50%,-50%)",
              }}
            />
          ))}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => navigate("landing")}
            className="flex items-center gap-2.5 mb-12 text-left"
          >
            <div className="h-9 w-9 rounded-xl bg-white flex items-center justify-center">
              <span className="text-[#0D2D52] text-sm font-bold">
                E
              </span>
            </div>

            <div>
              <p className="font-bold text-white text-base tracking-tight leading-none">
                Ecobank
              </p>

              <p className="text-white/50 text-xs">
                TrustID Decision Platform
              </p>
            </div>
          </button>

          <h2 className="text-2xl font-bold text-white mb-3 tracking-tight">
            Customer Behaviour Insights
          </h2>

          <p className="text-white/60 text-sm leading-relaxed">
            Access financial behaviour profiles to support informed
            lending review and decision-making.
          </p>
        </div>

        <div className="relative space-y-4">
          {[
            {
              icon: "📊",
              label: "Behavioural analysis",
              body: "Five-dimension financial credibility profiles",
            },
            {
              icon: "🔍",
              label: "Explainable insights",
              body: "Transparent scoring with supporting evidence",
            },
            {
              icon: "🏦",
              label: "Decision support",
              body: "Additional context to complement your review",
            },
          ].map((item) => (
            <div key={item.label} className="flex gap-3">
              <div className="h-9 w-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-base">
                {item.icon}
              </div>

              <div>
                <p className="text-white text-sm font-semibold">
                  {item.label}
                </p>

                <p className="text-white/50 text-xs mt-0.5">
                  {item.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="relative text-white/20 text-xs">
          © 2026 TrustID · Ecobank Prototype · Not a production
          system
        </p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md animate-fade-in-up">
          {/* Mobile header */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-lg bg-[#0D2D52] flex items-center justify-center">
                <span className="text-white text-xs font-bold">
                  E
                </span>
              </div>

              <div className="text-left">
                <p className="font-bold text-[#0D2D52] text-sm leading-none">
                  Ecobank
                </p>

                <p className="text-[#94A3B8] text-[10px] mt-0.5">
                  TrustID Decision Platform
                </p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#E8EEF5] px-3 py-1.5 mb-4">
              <div className="h-1.5 w-1.5 rounded-full bg-[#0D2D52]" />

              <span className="text-xs font-semibold text-[#0D2D52]">
                Ecobank Officer Access
              </span>
            </div>

            <h1 className="text-2xl font-bold text-[#0D1F35] tracking-tight mb-1.5">
              Welcome back
            </h1>

            <p className="text-sm text-[#64748B]">
              Sign in to access the TrustID customer decision
              platform.
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm text-red-600 leading-relaxed">
                {error}
              </p>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <Input
              label="Work Email"
              type="email"
              placeholder="analyst@ecobank.com"
              value={form.email}
              onChange={set("email")}
              autoComplete="email"
              disabled={loading}
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={set("password")}
              autoComplete="current-password"
              disabled={loading}
            />

            <Button
              type="submit"
              fullWidth
              size="lg"
              disabled={loading}
              className="mt-2"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <button
            type="button"
            onClick={() => navigate("landing")}
            className="w-full mt-5 text-sm text-[#64748B] hover:text-[#0D2D52] transition"
          >
            ← Back to TrustID
          </button>

          <div className="mt-8 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#E2EAF2]" />

            <p className="text-xs text-[#94A3B8]">
              Authorised access only
            </p>

            <div className="h-px flex-1 bg-[#E2EAF2]" />
          </div>

          <p className="text-center text-xs text-[#94A3B8] mt-4 leading-relaxed">
            TrustID provides decision-support information.
            Ecobank retains full responsibility for lending
            decisions.
          </p>
        </div>
      </div>
    </div>
  );
}
