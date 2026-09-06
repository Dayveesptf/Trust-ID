import { CustomerLayout } from "../components/Layout";
import { Card, Badge, Button, ProgressBar, ScoreRing, getLevelVariant, getLevelColor } from "../components/ui";
import { currentUser, trustFactors } from "../data/mockData";

interface Props { navigate: (s: string) => void; }

export default function DashboardPage({ navigate }: Props) {
  const scorePct = currentUser.trustScore / currentUser.maxScore;

  return (
    <CustomerLayout current="dashboard" navigate={navigate}>
      <div className="max-w-4xl mx-auto px-5 sm:px-8 py-8">
        {/* Page header */}
        <div className="mb-8">
          <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-widest mb-1">Welcome back, Daniel</p>
          <h1 className="text-2xl font-bold text-[#0D1F35] tracking-tight">Your Trust Profile</h1>
        </div>

        {/* Hero score card */}
        <Card padding="none" className="mb-6 overflow-hidden">
          <div className="bg-[#0D2D52] px-6 pt-8 pb-0 sm:px-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
              {/* Score ring */}
              <div className="relative shrink-0">
                <ScoreRing score={currentUser.trustScore} max={currentUser.maxScore} size={180} color="#10B981" />
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <p className="text-4xl font-bold text-white font-['JetBrains_Mono',monospace] leading-none">
                    {currentUser.trustScore}
                  </p>
                  <p className="text-white/50 text-sm mt-1">of {currentUser.maxScore}</p>
                </div>
              </div>

              {/* Score info */}
              <div className="flex-1 sm:pt-4 text-center sm:text-left pb-6">
                <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-500/30 mb-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Strong Financial Profile
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Your TrustID Score</h2>
                <p className="text-white/60 text-sm leading-relaxed mb-5 max-w-sm">
                  Your score reflects patterns in your financial behaviour. Strong repayment behaviour and consistent savings are helping your profile.
                </p>
                <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                  <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5">
                    <p className="text-xs text-white/50 mb-0.5">Previous score</p>
                    <p className="text-white font-bold font-['JetBrains_Mono',monospace]">{currentUser.previousScore}</p>
                  </div>
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-2.5">
                    <p className="text-xs text-emerald-400/70 mb-0.5">Change</p>
                    <p className="text-emerald-400 font-bold font-['JetBrains_Mono',monospace]">{currentUser.trend}</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5">
                    <p className="text-xs text-white/50 mb-0.5">Last updated</p>
                    <p className="text-white font-bold text-sm">4 Sep 2026</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom actions */}
          <div className="px-6 sm:px-8 py-4 flex flex-wrap gap-3 border-t border-[#E2EAF2] bg-white">
            <button
              onClick={() => navigate("score-explanation")}
              className="text-sm font-semibold text-[#0D2D52] hover:text-[#163D6A] flex items-center gap-1.5 transition-colors"
            >
              <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="8" cy="8" r="6.5" />
                <path d="M8 7v5M8 5v.5" strokeLinecap="round" />
              </svg>
              How is my score calculated?
            </button>
            <div className="h-4 w-px bg-[#E2EAF2] self-center" />
            <button
              onClick={() => navigate("financial-growth")}
              className="text-sm font-semibold text-[#10B981] hover:text-emerald-600 flex items-center gap-1.5 transition-colors"
            >
              <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2 12l4-4 3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M11 6h3v3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Improve My Profile
            </button>
          </div>
        </Card>

        {/* Trust Factors */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-[#0D1F35]">Trust Factors</h3>
            <button
              onClick={() => navigate("score-explanation")}
              className="text-xs font-semibold text-[#0D2D52] hover:underline"
            >
              View breakdown →
            </button>
          </div>
          <div className="space-y-3">
            {trustFactors.map((f) => (
              <Card key={f.id} padding="sm" hover onClick={() => navigate("score-explanation")}>
                <div className="flex items-center gap-4">
                  <div
                    className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-xs font-['JetBrains_Mono',monospace]"
                    style={{ backgroundColor: f.color }}
                  >
                    {f.score}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-sm font-semibold text-[#0D1F35] truncate">{f.label}</p>
                      <Badge variant={getLevelVariant(f.level)} className="ml-2 shrink-0">{f.level}</Badge>
                    </div>
                    <ProgressBar value={f.score} color={getLevelColor(f.score)} size="sm" />
                  </div>
                  <p className="text-xs text-[#94A3B8] font-medium shrink-0 hidden sm:block">{f.score}/100</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Strengths & Improvements */}
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <Card>
            <p className="text-xs font-semibold text-[#64748B] uppercase tracking-widest mb-3">Key Strengths</p>
            <div className="space-y-2.5">
              {["Excellent repayment history", "Consistent monthly income", "Regular savings contributions"].map((s) => (
                <div key={s} className="flex items-center gap-2.5 text-sm text-[#374151]">
                  <div className="h-5 w-5 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                    <svg className="h-3 w-3 text-emerald-600" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2 2.5 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  {s}
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <p className="text-xs font-semibold text-[#64748B] uppercase tracking-widest mb-3">Areas to Improve</p>
            <div className="space-y-2.5">
              {["Cash-flow consistency", "More regular savings", "Reduce spending spikes"].map((s) => (
                <div key={s} className="flex items-center gap-2.5 text-sm text-[#374151]">
                  <div className="h-5 w-5 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
                    <svg className="h-3 w-3 text-amber-600" viewBox="0 0 10 10" fill="none">
                      <path d="M5 3v4M5 8v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                  {s}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Score trend mini */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-semibold text-[#64748B] uppercase tracking-widest mb-1">Score Trend</p>
              <p className="text-sm text-[#64748B]">Your TrustID score is improving</p>
            </div>
            <button onClick={() => navigate("score-history")} className="text-xs font-semibold text-[#0D2D52] hover:underline">
              Full history →
            </button>
          </div>
          <div className="flex items-end gap-2 h-16">
            {[651, 663, 658, 681, 697, 716, 742].map((v, i) => {
              const pct = ((v - 630) / (760 - 630)) * 100;
              const isLast = i === 6;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className={`w-full rounded-t-md transition-all ${isLast ? "bg-[#0D2D52]" : "bg-[#E2EAF2]"}`}
                    style={{ height: `${pct}%`, minHeight: 4 }}
                  />
                </div>
              );
            })}
          </div>
          <div className="flex justify-between mt-2">
            {["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr"].map((m) => (
              <p key={m} className="text-xs text-[#94A3B8] flex-1 text-center">{m}</p>
            ))}
          </div>
        </Card>
      </div>
    </CustomerLayout>
  );
}
