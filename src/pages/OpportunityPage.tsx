import { CustomerLayout } from "../components/Layout";
import { Card, Button, ScoreRing } from "../components/ui";
import { currentUser } from "../data/mockData";

interface Props { navigate: (s: string) => void; }

export default function OpportunityPage({ navigate }: Props) {
  return (
    <CustomerLayout current="opportunity" navigate={navigate}>
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-widest mb-1">Opportunities</p>
          <h1 className="text-2xl font-bold text-[#0D1F35] tracking-tight">Your Financial Profile Can Tell a Bigger Story</h1>
          <p className="text-sm text-[#64748B] mt-2 leading-relaxed max-w-xl">
            TrustID can provide additional financial behaviour insights that may help eligible financial institutions better understand customers with limited traditional credit history.
          </p>
        </div>

        {/* Main value prop card */}
        <Card className="mb-6 bg-[#0D2D52] text-white overflow-hidden" padding="none">
          <div className="px-7 py-8">
            <div className="flex flex-col sm:flex-row items-center gap-8">
              <div className="relative shrink-0">
                <ScoreRing score={currentUser.trustScore} max={currentUser.maxScore} size={120} color="#10B981" />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-2xl font-bold text-white font-['JetBrains_Mono',monospace]">{currentUser.trustScore}</p>
                  <p className="text-white/50 text-xs">/ 850</p>
                </div>
              </div>
              <div className="text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-500/30 mb-3">
                  Strong Financial Profile
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Your profile demonstrates financial credibility</h2>
                <p className="text-white/70 text-sm leading-relaxed">
                  TrustID provides additional information that may support financial product eligibility and lending review.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* How it works equation */}
        <Card className="mb-6">
          <p className="text-xs font-semibold text-[#64748B] uppercase tracking-widest mb-5">How TrustID supports financial institutions</p>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex-1 bg-[#F8FAFB] border border-[#E2EAF2] rounded-2xl p-4 text-center w-full">
              <p className="text-xs text-[#94A3B8] mb-2 font-medium uppercase tracking-wide">Traditional information</p>
              <div className="space-y-1.5">
                {["Bank account history", "Identity verification", "Employment status"].map((t) => (
                  <div key={t} className="flex items-center gap-2 text-xs text-[#374151]">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#94A3B8]" />
                    {t}
                  </div>
                ))}
              </div>
            </div>

            <div className="text-2xl font-bold text-[#0D2D52] shrink-0">+</div>

            <div className="flex-1 bg-[#EFF4F9] border border-[#C8D9EC] rounded-2xl p-4 text-center w-full">
              <p className="text-xs text-[#0D2D52] mb-2 font-semibold uppercase tracking-wide">TrustID behavioural insights</p>
              <div className="space-y-1.5">
                {["Income consistency", "Savings behaviour", "Repayment patterns", "Cash-flow stability", "Financial discipline"].map((t) => (
                  <div key={t} className="flex items-center gap-2 text-xs text-[#0D2D52]">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
                    {t}
                  </div>
                ))}
              </div>
            </div>

            <div className="text-2xl font-bold text-[#10B981] shrink-0">=</div>

            <div className="flex-1 bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center w-full">
              <p className="text-xs text-emerald-700 mb-2 font-semibold uppercase tracking-wide">More complete context</p>
              <p className="text-xs text-emerald-800 leading-relaxed">
                A richer, more accurate picture of a customer's financial behaviour to support informed decision-making.
              </p>
            </div>
          </div>
        </Card>

        {/* What this means */}
        <Card className="mb-6">
          <p className="text-sm font-bold text-[#0D1F35] mb-4">What this means for you</p>
          <div className="space-y-3">
            {[
              { icon: "📋", title: "Richer financial context", body: "Your TrustID profile gives Ecobank analysts additional behavioural context when reviewing your financial position." },
              { icon: "🔍", title: "Transparent and explainable", body: "Every insight in your profile is clearly explained — no hidden calculations, no black boxes." },
              { icon: "🤝", title: "Supporting the review process", body: "TrustID helps provide a more complete picture, particularly for customers who may have limited traditional credit history." },
            ].map((item) => (
              <div key={item.title} className="flex gap-4 p-4 rounded-xl bg-[#F8FAFB] border border-[#E2EAF2]">
                <span className="text-xl shrink-0">{item.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-[#0D1F35] mb-1">{item.title}</p>
                  <p className="text-xs text-[#64748B] leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Important disclaimer */}
        <div className="bg-[#EFF4F9] border border-[#C8D9EC] rounded-2xl p-5 mb-6">
          <div className="flex gap-3">
            <svg className="h-5 w-5 text-[#0D2D52] shrink-0 mt-0.5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="10" cy="10" r="8.5" />
              <path d="M10 9v6M10 7v.5" strokeLinecap="round" />
            </svg>
            <div>
              <p className="text-sm font-bold text-[#0D2D52] mb-1">Important to understand</p>
              <p className="text-sm text-[#374151] leading-relaxed">
                TrustID provides additional information that <span className="font-semibold">may support</span> financial product eligibility and lending review. TrustID does not guarantee any financial product or lending outcome. Ecobank retains full responsibility for all final decisions.
              </p>
            </div>
          </div>
        </div>

        <Button onClick={() => navigate("dashboard")} size="lg">
          Continue Exploring →
        </Button>
      </div>
    </CustomerLayout>
  );
}
