import { useState } from "react";
import { CustomerLayout } from "../components/Layout";
import { Card, Badge, ProgressBar, ScoreRing, getLevelVariant, getLevelColor } from "../components/ui";
import { currentUser, trustFactors } from "../data/mockData";

interface Props { navigate: (s: string) => void; }

export default function ScoreExplanationPage({ navigate }: Props) {
  const [expanded, setExpanded] = useState<string | null>("repayment");

  return (
    <CustomerLayout current="score-explanation" navigate={navigate}>
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-widest mb-1">Score Breakdown</p>
          <h1 className="text-2xl font-bold text-[#0D1F35] tracking-tight">
            Why is my TrustID Score <span className="text-[#0D2D52] font-['JetBrains_Mono',monospace]">742</span>?
          </h1>
          <p className="text-sm text-[#64748B] mt-2">
            Your score is built from five measurable dimensions of financial behaviour. Here's exactly how each one contributes.
          </p>
        </div>

        {/* Total breakdown card */}
        <Card className="mb-6">
          <div className="flex items-center gap-6">
            <div className="relative shrink-0">
              <ScoreRing score={currentUser.trustScore} max={currentUser.maxScore} size={120} color="#10B981" />
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <p className="text-2xl font-bold text-[#0D1F35] font-['JetBrains_Mono',monospace]">{currentUser.trustScore}</p>
                <p className="text-xs text-[#94A3B8]">/ {currentUser.maxScore}</p>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="success" size="md">Strong Financial Profile</Badge>
              </div>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Your score is the sum of five factor scores, each weighted by importance. The maximum total is <span className="font-semibold text-[#0D1F35]">850 points</span>.
              </p>
            </div>
          </div>

          {/* Contribution bars */}
          <div className="mt-5 pt-5 border-t border-[#E2EAF2]">
            <p className="text-xs font-semibold text-[#64748B] uppercase tracking-widest mb-3">Score Composition</p>
            <div className="space-y-2.5">
              {trustFactors.map((f) => (
                <div key={f.id} className="flex items-center gap-3">
                  <p className="text-xs font-medium text-[#64748B] w-36 shrink-0 truncate">{f.label}</p>
                  <div className="flex-1">
                    <ProgressBar value={f.currentPoints} max={f.maxPoints} color={f.color} size="sm" />
                  </div>
                  <p className="text-xs font-bold text-[#0D1F35] font-['JetBrains_Mono',monospace] w-16 text-right shrink-0">
                    {f.currentPoints}/{f.maxPoints}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-[#E2EAF2] flex justify-between">
              <p className="text-xs font-semibold text-[#64748B]">Total</p>
              <p className="text-sm font-bold text-[#0D1F35] font-['JetBrains_Mono',monospace]">
                {trustFactors.reduce((a, f) => a + f.currentPoints, 0)}/{currentUser.maxScore}
              </p>
            </div>
          </div>
        </Card>

        {/* Factor detail cards */}
        <div className="space-y-3">
          {trustFactors.map((f) => {
            const isOpen = expanded === f.id;
            return (
              <Card key={f.id} padding="none" className="overflow-hidden">
                <button
                  onClick={() => setExpanded(isOpen ? null : f.id)}
                  className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-[#F8FAFB] transition-colors"
                >
                  <div
                    className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-xs font-['JetBrains_Mono',monospace]"
                    style={{ backgroundColor: f.color }}
                  >
                    {f.score}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-bold text-[#0D1F35]">{f.label}</p>
                      <Badge variant={getLevelVariant(f.level)} size="sm">{f.level}</Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 max-w-[140px]">
                        <ProgressBar value={f.score} color={getLevelColor(f.score)} size="sm" />
                      </div>
                      <p className="text-xs text-[#94A3B8]">{f.score}/100 · {f.currentPoints}/{f.maxPoints} pts</p>
                    </div>
                  </div>
                  <svg
                    className={`h-4 w-4 text-[#94A3B8] transition-transform shrink-0 ${isOpen ? "rotate-180" : ""}`}
                    viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"
                  >
                    <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 border-t border-[#E2EAF2] animate-fade-in">
                    <p className="text-sm text-[#64748B] mt-4 mb-5 leading-relaxed">{f.description}</p>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center">
                            <svg className="h-3 w-3 text-emerald-700" viewBox="0 0 10 10" fill="none">
                              <path d="M2 5l2 2.5 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                          <p className="text-xs font-bold text-emerald-800">What helped</p>
                        </div>
                        <p className="text-sm text-emerald-900 leading-relaxed">{f.whatHelped}</p>
                      </div>
                      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-5 w-5 rounded-full bg-amber-100 flex items-center justify-center">
                            <svg className="h-3 w-3 text-amber-700" viewBox="0 0 10 10" fill="none">
                              <path d="M5 3v4M5 8v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                          </div>
                          <p className="text-xs font-bold text-amber-800">What could improve</p>
                        </div>
                        <p className="text-sm text-amber-900 leading-relaxed">{f.whatCouldImprove}</p>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Scoring philosophy */}
        <Card className="mt-6">
          <div className="flex gap-4">
            <div className="h-10 w-10 rounded-xl bg-[#EFF4F9] flex items-center justify-center shrink-0">
              <svg className="h-5 w-5 text-[#0D2D52]" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="10" cy="10" r="8.5" />
                <path d="M10 9v6M10 7v.5" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-[#0D1F35] mb-1">About TrustID Scoring</p>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Your TrustID Score is calculated from observable financial behaviour patterns — not from traditional credit history. Each dimension is analysed independently and transparently. TrustID never approves or rejects financial products; it provides additional context to support informed decision-making by financial institutions.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </CustomerLayout>
  );
}
