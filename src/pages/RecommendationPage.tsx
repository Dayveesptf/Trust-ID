import { BankLayout } from "../components/Layout";
import { Card, Badge, Button, ScoreRing, ProgressBar, getLevelVariant, getLevelColor } from "../components/ui";
import { currentUser, trustFactors } from "../data/mockData";

interface Props { navigate: (s: string) => void; }

export default function RecommendationPage({ navigate }: Props) {
  return (
    <BankLayout current="recommendation" navigate={navigate}>
      <div className="px-6 sm:px-8 py-8 max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#94A3B8] mb-6">
          <button onClick={() => navigate("customer-overview")} className="hover:text-[#0D2D52] font-medium">Customers</button>
          <span>›</span>
          <button onClick={() => navigate("customer-detail")} className="hover:text-[#0D2D52] font-medium">Daniel Okafor</button>
          <span>›</span>
          <span className="text-[#374151] font-medium">TrustID Assessment</span>
        </div>

        <div className="mb-8">
          <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-widest mb-1">TrustID Assessment</p>
          <h1 className="text-2xl font-bold text-[#0D1F35] tracking-tight">Financial Behaviour Summary</h1>
          <p className="text-sm text-[#64748B] mt-2">
            Behavioural insights to inform your review. This does not constitute a lending recommendation.
          </p>
        </div>

        {/* Score & credibility header */}
        <Card className="mb-6 border-2 border-[#0D2D52]">
          <div className="flex items-center gap-5">
            <div className="relative shrink-0">
              <ScoreRing score={currentUser.trustScore} max={currentUser.maxScore} size={110} color="#10B981" />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-2xl font-bold text-[#0D1F35] font-['JetBrains_Mono',monospace]">{currentUser.trustScore}</p>
                <p className="text-xs text-[#94A3B8]">/ 850</p>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <p className="text-xs font-semibold text-[#64748B] uppercase tracking-widest">Financial Credibility</p>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl font-bold text-[#0D1F35]">Strong</span>
                <Badge variant="success" size="md">Strong</Badge>
              </div>
              <p className="text-sm text-[#64748B] leading-relaxed">
                This customer demonstrates strong financial behaviour across multiple key dimensions, with excellent repayment consistency and stable income patterns.
              </p>
            </div>
          </div>
        </Card>

        {/* Factor scores */}
        <Card className="mb-6">
          <p className="text-xs font-semibold text-[#64748B] uppercase tracking-widest mb-4">Dimension Analysis</p>
          <div className="space-y-3">
            {trustFactors.map((f) => (
              <div key={f.id} className="flex items-center gap-4">
                <p className="text-xs font-medium text-[#64748B] w-40 shrink-0">{f.label}</p>
                <div className="flex-1">
                  <ProgressBar value={f.score} color={getLevelColor(f.score)} size="sm" />
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-bold text-[#0D1F35] font-['JetBrains_Mono',monospace] w-12 text-right">{f.score}/100</span>
                  <Badge variant={getLevelVariant(f.level)} size="sm">{f.level}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Strengths and risks */}
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <Card>
            <p className="text-xs font-semibold text-emerald-700 uppercase tracking-widest mb-3">Key Strengths</p>
            <div className="space-y-2.5">
              {[
                "Consistent income — salary deposited monthly without gaps",
                "Excellent repayment behaviour — 100% on-time rate over 7 months",
                "Regular savings contributions in 6 of 7 months",
                "Positive net cash flow in 6 of 7 months",
              ].map((s) => (
                <div key={s} className="flex items-start gap-2 text-xs text-[#374151] leading-relaxed">
                  <div className="h-4 w-4 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="h-2.5 w-2.5 text-emerald-700" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2 2.5 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  {s}
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <p className="text-xs font-semibold text-amber-700 uppercase tracking-widest mb-3">Risk Considerations</p>
            <div className="space-y-2.5">
              {[
                "Moderate cash-flow volatility — December showed a ₦17,000 deficit",
                "Savings contribution missed in December 2025",
                "Spending spikes noted in December, may be seasonal",
                "Single income source — no secondary income diversification",
              ].map((s) => (
                <div key={s} className="flex items-start gap-2 text-xs text-[#374151] leading-relaxed">
                  <div className="h-4 w-4 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="h-2.5 w-2.5 text-amber-700" viewBox="0 0 10 10" fill="none">
                      <path d="M5 3v4M5 8v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                  {s}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Disclaimer */}
        <div className="bg-[#EFF4F9] border border-[#C8D9EC] rounded-2xl p-5 mb-6">
          <div className="flex gap-3">
            <svg className="h-5 w-5 text-[#0D2D52] shrink-0 mt-0.5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="10" cy="10" r="8.5" />
              <path d="M10 9v6M10 7v.5" strokeLinecap="round" />
            </svg>
            <p className="text-sm text-[#0D2D52] leading-relaxed">
              <span className="font-bold">TrustID Assessment Disclaimer:</span> TrustID provides behavioural insights to support review. It does not make the final lending decision. Ecobank analysts retain full responsibility for all credit and lending determinations.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button onClick={() => navigate("decision-support")}>Proceed to Decision Support →</Button>
          <Button variant="secondary" onClick={() => navigate("supporting-evidence")}>← View Evidence</Button>
        </div>
      </div>
    </BankLayout>
  );
}
