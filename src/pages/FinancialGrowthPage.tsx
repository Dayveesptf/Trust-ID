import { CustomerLayout } from "../components/Layout";
import { Card, Badge, Button } from "../components/ui";
import { growthRecommendations } from "../data/mockData";

interface Props { navigate: (s: string) => void; }

export default function FinancialGrowthPage({ navigate }: Props) {
  return (
    <CustomerLayout current="financial-growth" navigate={navigate}>
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-widest mb-1">Financial Growth</p>
          <h1 className="text-2xl font-bold text-[#0D1F35] tracking-tight">Strengthen Your Financial Profile</h1>
          <p className="text-sm text-[#64748B] mt-2 leading-relaxed max-w-lg">
            Based on your Trust Profile, here are personalised recommendations to help you build stronger financial habits. These are opportunities, not criticisms.
          </p>
        </div>

        {/* Progress summary */}
        <Card className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#64748B] uppercase tracking-widest mb-1">Profile Progress</p>
              <p className="text-2xl font-bold text-[#0D1F35] font-['JetBrains_Mono',monospace]">742<span className="text-sm text-[#94A3B8] font-normal font-sans ml-1">/ 850</span></p>
            </div>
            <div className="text-right">
              <p className="text-xs text-[#64748B] mb-1">Potential reach</p>
              <p className="text-2xl font-bold text-[#10B981] font-['JetBrains_Mono',monospace]">810+</p>
              <p className="text-xs text-[#94A3B8]">with improvements</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="relative h-3 bg-[#E2EAF2] rounded-full overflow-hidden">
              <div className="absolute top-0 left-0 h-full rounded-full bg-[#0D2D52]" style={{ width: `${(742/850)*100}%` }} />
              <div className="absolute top-0 h-full rounded-full bg-[#10B981]/30 border-r-2 border-[#10B981]" style={{ left: `${(742/850)*100}%`, width: `${((810-742)/850)*100}%` }} />
            </div>
            <div className="flex justify-between mt-1.5">
              <p className="text-xs text-[#64748B]">Current: 742</p>
              <p className="text-xs text-[#10B981] font-medium">Potential: 810+</p>
            </div>
          </div>
        </Card>

        {/* Recommendations */}
        <div className="space-y-4 mb-8">
          {growthRecommendations.map((rec, i) => (
            <div key={rec.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` } as React.CSSProperties}>
            <Card>
              <div className="flex items-start gap-4 mb-4">
                <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 text-xl"
                  style={{ backgroundColor: `${rec.color}15` }}
                >
                  {rec.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-sm font-bold text-[#0D1F35] leading-snug">{rec.title}</h3>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                      rec.impact === "High" ? "bg-red-50 text-red-600 border border-red-100" :
                      rec.impact === "Medium" ? "bg-amber-50 text-amber-700 border border-amber-100" :
                      "bg-[#EFF4F9] text-[#0D2D52] border border-[#C8D9EC]"
                    }`}>
                      {rec.impact} impact
                    </span>
                  </div>
                  <p className="text-xs text-[#94A3B8] font-medium">{rec.factor}</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                <div className="bg-[#F8FAFB] rounded-xl p-3.5 border border-[#E2EAF2]">
                  <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-1.5">Current behaviour</p>
                  <p className="text-xs text-[#374151] leading-relaxed">{rec.currentBehaviour}</p>
                </div>
                <div className="bg-[#EFF4F9] rounded-xl p-3.5 border border-[#C8D9EC]">
                  <p className="text-xs font-semibold text-[#0D2D52] uppercase tracking-wide mb-1.5">Recommended action</p>
                  <p className="text-xs text-[#0D2D52] leading-relaxed">{rec.recommendedAction}</p>
                </div>
                <div className="bg-emerald-50 rounded-xl p-3.5 border border-emerald-100">
                  <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-1.5">Potential benefit</p>
                  <p className="text-xs text-emerald-800 leading-relaxed">{rec.potentialBenefit}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {rec.id === 1 && (
                  <Button size="sm" variant="secondary">
                    Set a Savings Goal
                  </Button>
                )}
                <Button size="sm" variant="ghost" onClick={() => navigate("score-history")}>
                  View My Progress
                </Button>
              </div>
            </Card>
            </div>
          ))}
        </div>

        {/* Supportive note */}
        <Card className="bg-[#EFF4F9] border-[#C8D9EC]">
          <div className="flex gap-3">
            <span className="text-xl">💡</span>
            <div>
              <p className="text-sm font-bold text-[#0D2D52] mb-1">Building financial credibility takes time</p>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Small, consistent improvements compound over time. Focus on one area at a time, and your Trust Profile will strengthen naturally. TrustID is here to support you, not judge you.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </CustomerLayout>
  );
}
