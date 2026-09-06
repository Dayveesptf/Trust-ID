import { useState } from "react";
import { Button, Input } from "../components/ui";

interface Props { navigate: (s: string) => void; }

export default function EcobankLoginPage({ navigate }: Props) {
  const [form, setForm] = useState({ email: "", password: "" });
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="min-h-screen bg-[#F0F4F9] flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] bg-[#0D2D52] p-10 shrink-0 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="absolute rounded-full border border-white"
              style={{ width: `${(i + 1) * 120}px`, height: `${(i + 1) * 120}px`, top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}
            />
          ))}
        </div>

        <div className="relative">
          <div className="flex items-center gap-2.5 mb-12">
            <div className="h-9 w-9 rounded-xl bg-white flex items-center justify-center">
              <span className="text-[#0D2D52] text-sm font-bold">E</span>
            </div>
            <div>
              <p className="font-bold text-white text-base tracking-tight leading-none">Ecobank</p>
              <p className="text-white/50 text-xs">TrustID Decision Platform</p>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3 tracking-tight">Customer Behaviour Insights</h2>
          <p className="text-white/60 text-sm leading-relaxed">
            Access financial behaviour profiles to support informed lending review and decision-making.
          </p>
        </div>

        <div className="relative space-y-4">
          {[
            { icon: "📊", label: "Behavioural analysis", body: "Five-dimension financial credibility profiles" },
            { icon: "🔍", label: "Explainable insights", body: "Transparent scoring with supporting evidence" },
            { icon: "🏦", label: "Decision support", body: "Additional context to complement your review" },
          ].map((item) => (
            <div key={item.label} className="flex gap-3">
              <div className="h-9 w-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-base">{item.icon}</div>
              <div>
                <p className="text-white text-sm font-semibold">{item.label}</p>
                <p className="text-white/50 text-xs mt-0.5">{item.body}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="relative text-white/20 text-xs">
          © 2026 TrustID · Ecobank Prototype · Not a production system
        </p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md animate-fade-in-up">
          {/* Mobile header */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-lg bg-[#0D2D52] flex items-center justify-center">
                <span className="text-white text-sm font-bold">E</span>
              </div>
              <span className="font-bold text-[#0D2D52] text-lg">Ecobank TrustID</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#E2EAF2] shadow-sm p-8">
            <div className="mb-7">
              <h1 className="text-xl font-bold text-[#0D1F35] tracking-tight mb-1">Ecobank TrustID</h1>
              <p className="text-sm text-[#64748B]">Sign in to access the decision support platform.</p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); navigate("customer-overview"); }} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="analyst@ecobank.com"
                value={form.email}
                onChange={set("email")}
              />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={set("password")}
              />

              <div className="flex justify-end">
                <button type="button" className="text-xs text-[#0D2D52] font-semibold hover:underline">
                  Forgot password?
                </button>
              </div>

              <Button type="submit" fullWidth size="lg">
                Sign In
              </Button>
            </form>

            <div className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="text-xs text-amber-800 text-center">
                <span className="font-bold">Demo mode</span> — any credentials will sign you in
              </p>
            </div>
          </div>

          <p className="text-center text-xs text-[#94A3B8] mt-5">
            Authorised Ecobank personnel only · Competition Prototype
          </p>

          <div className="mt-4 text-center">
            <button onClick={() => navigate("landing")} className="text-xs text-[#64748B] hover:text-[#0D2D52] font-medium transition-colors">
              ← Back to TrustID customer site
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
