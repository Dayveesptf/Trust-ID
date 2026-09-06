import { useState } from "react";
import { CustomerLayout } from "../components/Layout";
import { Card } from "../components/ui";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { scoreHistory } from "../data/mockData";

interface Props { navigate: (s: string) => void; }

const filters = ["7 days", "30 days", "6 months", "1 year"];

const milestones = [
  { month: "Jan", score: 681, note: "Savings habit started" },
  { month: "Mar", score: 716, note: "On-time repayments consistent" },
  { month: "Apr", score: 742, note: "Cash flow improved" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-[#E2EAF2] rounded-xl px-4 py-3 shadow-lg">
        <p className="text-xs text-[#64748B] mb-1">{payload[0]?.payload?.date}</p>
        <p className="text-lg font-bold text-[#0D2D52] font-['JetBrains_Mono',monospace]">{payload[0].value}</p>
        <p className="text-xs text-[#94A3B8]">TrustID Score</p>
      </div>
    );
  }
  return null;
};

export default function ScoreHistoryPage({ navigate }: Props) {
  const [filter, setFilter] = useState("6 months");
  const change = scoreHistory[scoreHistory.length - 1].score - scoreHistory[scoreHistory.length - 2].score;

  return (
    <CustomerLayout current="score-history" navigate={navigate}>
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-widest mb-1">Score History</p>
          <h1 className="text-2xl font-bold text-[#0D1F35] tracking-tight">Your Score Over Time</h1>
          <p className="text-sm text-[#64748B] mt-2">Track how your TrustID Score has evolved with your financial behaviour.</p>
        </div>

        {/* Score summary */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="text-center">
            <p className="text-xs text-[#64748B] uppercase tracking-wide font-medium mb-1">Current</p>
            <p className="text-2xl font-bold text-[#0D1F35] font-['JetBrains_Mono',monospace]">742</p>
          </Card>
          <Card className="text-center">
            <p className="text-xs text-[#64748B] uppercase tracking-wide font-medium mb-1">Previous</p>
            <p className="text-2xl font-bold text-[#0D1F35] font-['JetBrains_Mono',monospace]">716</p>
          </Card>
          <Card className="text-center">
            <p className="text-xs text-[#64748B] uppercase tracking-wide font-medium mb-1">Change</p>
            <p className="text-2xl font-bold text-[#10B981] font-['JetBrains_Mono',monospace]">+{change}</p>
          </Card>
        </div>

        {/* Chart */}
        <Card className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm font-bold text-[#0D1F35]">Score Progression</p>
            <div className="flex gap-1.5">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    filter === f
                      ? "bg-[#0D2D52] text-white"
                      : "bg-[#F8FAFB] text-[#64748B] hover:bg-[#EFF4F9] border border-[#E2EAF2]"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={scoreHistory} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: "#94A3B8", fontFamily: "DM Sans" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[620, 780]}
                  tick={{ fontSize: 11, fill: "#94A3B8", fontFamily: "JetBrains Mono" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={700} stroke="#E2EAF2" strokeDasharray="4 4" />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#0D2D52"
                  strokeWidth={2.5}
                  dot={{ fill: "#0D2D52", r: 4, strokeWidth: 0 }}
                  activeDot={{ fill: "#10B981", r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-[#94A3B8] text-center mt-2">700 threshold line shown for reference</p>
        </Card>

        {/* Monthly breakdown */}
        <Card className="mb-6">
          <p className="text-sm font-bold text-[#0D1F35] mb-4">Monthly Breakdown</p>
          <div className="space-y-0">
            {scoreHistory.map((row, i) => {
              const prev = i > 0 ? scoreHistory[i - 1].score : row.score;
              const diff = row.score - prev;
              const milestone = milestones.find((m) => m.month === row.month);
              return (
                <div
                  key={row.month}
                  className={`flex items-center gap-4 py-3 ${i < scoreHistory.length - 1 ? "border-b border-[#F1F5F9]" : ""}`}
                >
                  <p className="text-sm font-semibold text-[#64748B] w-8">{row.month}</p>
                  <p className="text-sm font-bold text-[#0D1F35] font-['JetBrains_Mono',monospace] w-10">{row.score}</p>
                  <div className="flex-1">
                    {milestone && (
                      <span className="inline-flex items-center gap-1 text-xs bg-[#EFF4F9] text-[#0D2D52] border border-[#C8D9EC] px-2 py-0.5 rounded-full font-medium">
                        🏅 {milestone.note}
                      </span>
                    )}
                  </div>
                  {i > 0 && (
                    <span className={`text-xs font-bold font-['JetBrains_Mono',monospace] ${diff > 0 ? "text-[#10B981]" : diff < 0 ? "text-red-500" : "text-[#94A3B8]"}`}>
                      {diff > 0 ? "+" : ""}{diff}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Milestone callouts */}
        <Card>
          <p className="text-sm font-bold text-[#0D1F35] mb-4">Score Milestones</p>
          <div className="space-y-3">
            {milestones.map((m) => (
              <div key={m.month} className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-[#EFF4F9] flex items-center justify-center text-sm">🏅</div>
                <div>
                  <p className="text-sm font-semibold text-[#0D1F35]">{m.note}</p>
                  <p className="text-xs text-[#94A3B8]">{m.month} 2026 · Score reached {m.score}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </CustomerLayout>
  );
}
