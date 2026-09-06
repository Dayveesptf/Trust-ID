import { BankLayout } from "../components/Layout";
import { Card, Badge, Button, ProgressBar, ScoreRing, Avatar, getLevelVariant, getLevelColor } from "../components/ui";
import { currentUser, trustFactors } from "../data/mockData";

interface Props { navigate: (s: string) => void; }

export default function CustomerDetailPage({ navigate }: Props) {
  return (
    <BankLayout current="customer-detail" navigate={navigate}>
      <div className="px-6 sm:px-8 py-8 max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#94A3B8] mb-6">
          <button onClick={() => navigate("customer-overview")} className="hover:text-[#0D2D52] font-medium transition-colors">
            Customer Insights
          </button>
          <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4.5 3l3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-[#374151] font-medium">{currentUser.name}</span>
        </div>

        {/* Customer header */}
        <Card className="mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <Avatar initials={currentUser.avatar} size="lg" />
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-xl font-bold text-[#0D1F35] mb-1">{currentUser.name}</h1>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start mb-3">
                <Badge variant="success" size="md">Strong Financial Profile</Badge>
                <Badge variant="info" size="md">Active Customer</Badge>
              </div>
              <p className="text-xs text-[#94A3B8]">Profile last updated · {currentUser.lastUpdated}</p>
            </div>
            <div className="relative shrink-0">
              <ScoreRing score={currentUser.trustScore} max={currentUser.maxScore} size={110} color="#10B981" />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-2xl font-bold text-[#0D1F35] font-['JetBrains_Mono',monospace]">{currentUser.trustScore}</p>
                <p className="text-xs text-[#94A3B8]">/ 850</p>
              </div>
            </div>
          </div>
          <div className="mt-5 pt-5 border-t border-[#E2EAF2] flex flex-wrap gap-3">
            <Button size="sm" onClick={() => navigate("supporting-evidence")}>View Evidence</Button>
            <Button size="sm" variant="secondary" onClick={() => navigate("recommendation")}>TrustID Assessment</Button>
            <Button size="sm" variant="ghost" onClick={() => navigate("decision-support")}>Decision Support</Button>
          </div>
        </Card>

        {/* Trust Factors */}
        <div className="mb-6">
          <h2 className="text-base font-bold text-[#0D1F35] mb-4">Trust Factor Breakdown</h2>
          <div className="space-y-3">
            {trustFactors.map((f) => (
              <Card key={f.id} padding="sm">
                <div className="flex items-center gap-4">
                  <div
                    className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 text-white text-xs font-bold font-['JetBrains_Mono',monospace]"
                    style={{ backgroundColor: f.color }}
                  >
                    {f.score}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-[#0D1F35]">{f.label}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#94A3B8] font-['JetBrains_Mono',monospace]">{f.score}/100</span>
                        <Badge variant={getLevelVariant(f.level)} size="sm">{f.level}</Badge>
                      </div>
                    </div>
                    <ProgressBar value={f.score} color={getLevelColor(f.score)} size="sm" />
                  </div>
                </div>
                <div className="mt-3 grid sm:grid-cols-2 gap-2 ml-14">
                  <div className="text-xs text-[#374151] leading-relaxed">
                    <span className="font-semibold text-[#10B981]">↑ </span>{f.whatHelped}
                  </div>
                  <div className="text-xs text-[#374151] leading-relaxed">
                    <span className="font-semibold text-[#F59E0B]">→ </span>{f.whatCouldImprove}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick summary */}
        <div className="grid sm:grid-cols-2 gap-4">
          <Card>
            <p className="text-xs font-semibold text-[#64748B] uppercase tracking-widest mb-3">Key Strengths</p>
            <div className="space-y-2">
              {["Excellent repayment behaviour (94/100)", "Consistent monthly income", "Regular savings contributions"].map((s) => (
                <div key={s} className="flex items-start gap-2 text-xs text-[#374151]">
                  <div className="h-4 w-4 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="h-2.5 w-2.5 text-emerald-600" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2 2.5 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  {s}
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <p className="text-xs font-semibold text-[#64748B] uppercase tracking-widest mb-3">Risk Considerations</p>
            <div className="space-y-2">
              {["Moderate cash-flow volatility (Dec spike)", "Savings missed in December 2025", "Spending spikes in recent months"].map((s) => (
                <div key={s} className="flex items-start gap-2 text-xs text-[#374151]">
                  <div className="h-4 w-4 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="h-2.5 w-2.5 text-amber-600" viewBox="0 0 10 10" fill="none">
                      <path d="M5 3v4M5 8v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                  {s}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </BankLayout>
  );
}
