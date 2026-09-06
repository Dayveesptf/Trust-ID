import { BankLayout } from "../components/Layout";
import { Card, Badge, Button, ScoreRing, ProgressBar, getLevelVariant, getLevelColor } from "../components/ui";
import { currentUser, trustFactors } from "../data/mockData";

interface Props { navigate: (s: string) => void; }

export default function DecisionSupportPage({ navigate }: Props) {
  return (
    <BankLayout current="decision-support" navigate={navigate}>
      <div className="px-6 sm:px-8 py-8 max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#94A3B8] mb-6">
          <button onClick={() => navigate("customer-overview")} className="hover:text-[#0D2D52] font-medium">Customers</button>
          <span>›</span>
          <button onClick={() => navigate("customer-detail")} className="hover:text-[#0D2D52] font-medium">Daniel Okafor</button>
          <span>›</span>
          <span className="text-[#374151] font-medium">Decision Support</span>
        </div>

        {/* IMPORTANT disclaimer banner - top prominence */}
        <div className="bg-[#0D2D52] text-white rounded-2xl p-5 mb-8 flex items-start gap-4">
          <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
            <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="10" cy="10" r="8.5" />
              <path d="M10 9v6M10 7v.5" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">Important: Decision Responsibility</p>
            <p className="text-sm text-white/70 leading-relaxed">
              TrustID provides additional information for decision support. <span className="text-white font-semibold">Ecobank retains full responsibility for the final lending decision.</span> TrustID does not approve or reject any financial product on behalf of Ecobank.
            </p>
          </div>
        </div>

        <div className="mb-8">
          <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-widest mb-1">Decision Support</p>
          <h1 className="text-2xl font-bold text-[#0D1F35] tracking-tight">Review Summary — Daniel Okafor</h1>
          <p className="text-sm text-[#64748B] mt-2">A consolidated view of all TrustID behavioural insights for this customer.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-5">
            {/* Customer TrustID score */}
            <Card>
              <div className="flex items-center gap-5">
                <div className="relative shrink-0">
                  <ScoreRing score={currentUser.trustScore} max={currentUser.maxScore} size={100} color="#10B981" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-xl font-bold text-[#0D1F35] font-['JetBrains_Mono',monospace]">{currentUser.trustScore}</p>
                    <p className="text-xs text-[#94A3B8]">/ 850</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#64748B] uppercase tracking-widest mb-1">TrustID Score</p>
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-xl font-bold text-[#0D1F35]">{currentUser.trustScore}</p>
                    <Badge variant="success" size="md">Strong</Badge>
                  </div>
                  <p className="text-xs text-[#64748B]">Score trend: +{currentUser.trend} from previous period</p>
                </div>
              </div>
            </Card>

            {/* Behavioural summary */}
            <Card>
              <p className="text-xs font-semibold text-[#64748B] uppercase tracking-widest mb-4">Behavioural Summary</p>
              <div className="space-y-2.5">
                {trustFactors.map((f) => (
                  <div key={f.id} className="flex items-center gap-3">
                    <p className="text-xs text-[#64748B] w-36 shrink-0">{f.label}</p>
                    <div className="flex-1">
                      <ProgressBar value={f.score} color={getLevelColor(f.score)} size="sm" />
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-bold font-['JetBrains_Mono',monospace] text-[#0D1F35]">{f.score}</span>
                      <Badge variant={getLevelVariant(f.level)} size="sm">{f.level}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Supporting evidence summary */}
            <Card>
              <p className="text-xs font-semibold text-[#64748B] uppercase tracking-widest mb-4">Supporting Evidence Summary</p>
              <div className="space-y-2">
                {[
                  { icon: "✅", label: "Income", detail: "7/7 months consistent salary deposits, avg ₦188,000/month" },
                  { icon: "💰", label: "Savings", detail: "6/7 months with contributions, avg ₦21,600/month" },
                  { icon: "🔄", label: "Repayments", detail: "100% on-time rate over 7 months — zero missed payments" },
                  { icon: "📊", label: "Cash Flow", detail: "Positive in 6/7 months. December deficit of ₦17,000 noted" },
                  { icon: "🎯", label: "Discipline", detail: "Spending generally within income with occasional seasonal spikes" },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3 p-3 rounded-xl bg-[#F8FAFB] border border-[#E2EAF2]">
                    <span className="text-base shrink-0">{item.icon}</span>
                    <div>
                      <p className="text-xs font-semibold text-[#0D1F35]">{item.label}</p>
                      <p className="text-xs text-[#64748B] mt-0.5">{item.detail}</p>
                    </div>
                    <button onClick={() => navigate("supporting-evidence")} className="ml-auto text-xs text-[#0D2D52] font-semibold hover:underline whitespace-nowrap shrink-0">
                      Detail →
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Assessment */}
            <Card className="border-2 border-[#0D2D52]">
              <p className="text-xs font-semibold text-[#64748B] uppercase tracking-widest mb-3">TrustID Assessment</p>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-3 w-3 rounded-full bg-[#10B981]" />
                <p className="text-sm font-bold text-[#0D1F35]">Strong Financial Credibility</p>
              </div>
              <div className="space-y-2 mb-4">
                <p className="text-xs font-bold text-emerald-700">Strengths</p>
                {["Consistent income", "Excellent repayments", "Regular savings"].map((s) => (
                  <p key={s} className="text-xs text-[#374151] flex items-center gap-1.5">
                    <span className="h-1 w-1 rounded-full bg-emerald-500 shrink-0" />{s}
                  </p>
                ))}
              </div>
              <div className="space-y-2">
                <p className="text-xs font-bold text-amber-700">Considerations</p>
                {["Cash-flow volatility", "Dec spending spike"].map((s) => (
                  <p key={s} className="text-xs text-[#374151] flex items-center gap-1.5">
                    <span className="h-1 w-1 rounded-full bg-amber-400 shrink-0" />{s}
                  </p>
                ))}
              </div>
            </Card>

            {/* Data period */}
            <Card>
              <p className="text-xs font-semibold text-[#64748B] uppercase tracking-widest mb-3">Analysis Period</p>
              <div className="space-y-2 text-xs text-[#374151]">
                <div className="flex justify-between"><span className="text-[#94A3B8]">From</span><span className="font-medium">Oct 2025</span></div>
                <div className="flex justify-between"><span className="text-[#94A3B8]">To</span><span className="font-medium">Apr 2026</span></div>
                <div className="flex justify-between"><span className="text-[#94A3B8]">Duration</span><span className="font-medium">7 months</span></div>
                <div className="flex justify-between"><span className="text-[#94A3B8]">Data source</span><span className="font-medium">Simulated</span></div>
              </div>
            </Card>
          </div>
        </div>

        {/* Bottom disclaimer — repeated for clarity */}
        <div className="border-2 border-[#E2EAF2] rounded-2xl p-5 mb-6">
          <p className="text-sm text-[#374151] leading-relaxed text-center">
            <span className="font-bold text-[#0D2D52]">TrustID provides additional information for decision support.</span> Ecobank retains responsibility for the final lending decision. TrustID behavioural insights are one input among many in a holistic credit review process.
          </p>
        </div>

        {/* Action buttons — NO approve/reject */}
        <div className="flex flex-wrap gap-3 justify-center">
          <Button variant="secondary" onClick={() => navigate("customer-detail")}>
            ← Return to Customer
          </Button>
          <Button onClick={() => navigate("customer-overview")}>
            Continue Review
          </Button>
        </div>

        <p className="text-center text-xs text-[#94A3B8] mt-4">
          © 2026 TrustID · Ecobank Decision Support · Competition Prototype · Simulated data only
        </p>
      </div>
    </BankLayout>
  );
}
