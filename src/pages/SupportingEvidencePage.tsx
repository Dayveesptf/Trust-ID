import { useState } from "react";
import { BankLayout } from "../components/Layout";
import { Card, Button, Badge } from "../components/ui";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Cell
} from "recharts";
import { incomeData, savingsData, cashflowData, repaymentData } from "../data/mockData";

interface Props { navigate: (s: string) => void; }

const tabs = ["Income", "Savings", "Repayments", "Cash Flow"];

const ChartTooltip = ({ active, payload, label, prefix = "₦" }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-[#E2EAF2] rounded-xl px-3 py-2.5 shadow-lg text-xs">
        <p className="text-[#64748B] mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} className="font-bold" style={{ color: p.color }}>
            {p.name}: {prefix}{p.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function SupportingEvidencePage({ navigate }: Props) {
  const [tab, setTab] = useState("Income");

  return (
    <BankLayout current="supporting-evidence" navigate={navigate}>
      <div className="px-6 sm:px-8 py-8 max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#94A3B8] mb-6">
          <button onClick={() => navigate("customer-overview")} className="hover:text-[#0D2D52] font-medium">Customer Insights</button>
          <span>›</span>
          <button onClick={() => navigate("customer-detail")} className="hover:text-[#0D2D52] font-medium">Daniel Okafor</button>
          <span>›</span>
          <span className="text-[#374151] font-medium">Supporting Evidence</span>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-widest mb-1">Supporting Evidence</p>
            <h1 className="text-2xl font-bold text-[#0D1F35] tracking-tight">Daniel Okafor — Financial Behaviour</h1>
            <p className="text-sm text-[#64748B] mt-1">7 months of simulated financial activity · Oct 2025 – Apr 2026</p>
          </div>
          <Button size="sm" onClick={() => navigate("recommendation")}>View Assessment →</Button>
        </div>

        {/* Tab nav */}
        <div className="flex gap-1 bg-[#F0F4F9] p-1 rounded-xl mb-6 w-fit">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                tab === t ? "bg-white text-[#0D2D52] shadow-sm" : "text-[#64748B] hover:text-[#0D2D52]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Income tab */}
        {tab === "Income" && (
          <div className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-3 gap-4">
              <Card className="text-center">
                <p className="text-xs text-[#64748B] font-medium mb-1">Avg Monthly</p>
                <p className="text-lg font-bold text-[#0D1F35] font-['JetBrains_Mono',monospace]">₦188k</p>
              </Card>
              <Card className="text-center">
                <p className="text-xs text-[#64748B] font-medium mb-1">Consistency</p>
                <p className="text-lg font-bold text-[#10B981]">7/7</p>
              </Card>
              <Card className="text-center">
                <p className="text-xs text-[#64748B] font-medium mb-1">Factor Score</p>
                <p className="text-lg font-bold text-[#0D2D52] font-['JetBrains_Mono',monospace]">82/100</p>
              </Card>
            </div>
            <Card>
              <p className="text-sm font-bold text-[#0D1F35] mb-1">Monthly Income Trend</p>
              <p className="text-xs text-[#64748B] mb-4">Income received regularly each month with no gaps detected.</p>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={incomeData} margin={{ top: 0, right: 8, left: -15, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`} />
                    <Tooltip content={<ChartTooltip />} />
                    <Bar dataKey="amount" name="Income" fill="#0D2D52" radius={[4, 4, 0, 0]}>
                      {incomeData.map((_, i) => <Cell key={i} fill={i === 6 ? "#10B981" : "#0D2D52"} opacity={i === 6 ? 1 : 0.7} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[#10B981]" />
                <p className="text-xs text-[#64748B]">Most recent month highlighted</p>
              </div>
            </Card>
            <Card>
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                  <svg className="h-4 w-4 text-emerald-600" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 12l4-4 3 3 5-5" strokeLinecap="round" strokeLinejoin="round" /><path d="M11 6h3v3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-[#0D1F35] mb-1">Insight: Strong Income Consistency</p>
                  <p className="text-sm text-[#64748B] leading-relaxed">Income received every month with minimal variance (±3.7%). Salary deposits are regular and arrive within the same 3-day window each month, indicating stable employment.</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Savings tab */}
        {tab === "Savings" && (
          <div className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-3 gap-4">
              <Card className="text-center">
                <p className="text-xs text-[#64748B] font-medium mb-1">Avg Monthly</p>
                <p className="text-lg font-bold text-[#0D1F35] font-['JetBrains_Mono',monospace]">₦21.6k</p>
              </Card>
              <Card className="text-center">
                <p className="text-xs text-[#64748B] font-medium mb-1">Months Saved</p>
                <p className="text-lg font-bold text-[#F59E0B]">6/7</p>
              </Card>
              <Card className="text-center">
                <p className="text-xs text-[#64748B] font-medium mb-1">Factor Score</p>
                <p className="text-lg font-bold text-[#0D2D52] font-['JetBrains_Mono',monospace]">76/100</p>
              </Card>
            </div>
            <Card>
              <p className="text-sm font-bold text-[#0D1F35] mb-1">Savings Trend</p>
              <p className="text-xs text-[#64748B] mb-4">Savings missed in December. Overall trend is positive.</p>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={savingsData} margin={{ top: 0, right: 8, left: -15, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`} />
                    <Tooltip content={<ChartTooltip />} />
                    <Bar dataKey="amount" name="Savings" radius={[4, 4, 0, 0]}>
                      {savingsData.map((d, i) => <Cell key={i} fill={d.amount === 0 ? "#FCA5A5" : "#2563A0"} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-3 flex items-center gap-4">
                <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-[#2563A0]" /><p className="text-xs text-[#64748B]">Savings contribution</p></div>
                <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-red-300" /><p className="text-xs text-[#64748B]">No contribution</p></div>
              </div>
            </Card>
          </div>
        )}

        {/* Repayments tab */}
        {tab === "Repayments" && (
          <div className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-3 gap-4">
              <Card className="text-center">
                <p className="text-xs text-[#64748B] font-medium mb-1">On-Time Rate</p>
                <p className="text-lg font-bold text-[#10B981]">100%</p>
              </Card>
              <Card className="text-center">
                <p className="text-xs text-[#64748B] font-medium mb-1">Months Tracked</p>
                <p className="text-lg font-bold text-[#0D2D52]">7/7</p>
              </Card>
              <Card className="text-center">
                <p className="text-xs text-[#64748B] font-medium mb-1">Factor Score</p>
                <p className="text-lg font-bold text-[#10B981] font-['JetBrains_Mono',monospace]">94/100</p>
              </Card>
            </div>
            <Card>
              <p className="text-sm font-bold text-[#0D1F35] mb-4">Repayment Consistency</p>
              <div className="space-y-2.5">
                {repaymentData.map((r) => (
                  <div key={r.month} className="flex items-center gap-4 p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                    <div className="h-6 w-6 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                      <svg className="h-3.5 w-3.5 text-white" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3.5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-[#0D1F35]">{r.month} 2026</p>
                    <Badge variant="success" className="ml-auto">On Time</Badge>
                    <p className="text-sm font-semibold text-[#0D1F35] font-['JetBrains_Mono',monospace]">₦{r.amount.toLocaleString()}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-[#64748B] mt-4 italic">All tracked repayments completed on time. No missed or late payments detected.</p>
            </Card>
          </div>
        )}

        {/* Cash Flow tab */}
        {tab === "Cash Flow" && (
          <div className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-3 gap-4">
              <Card className="text-center">
                <p className="text-xs text-[#64748B] font-medium mb-1">Positive Months</p>
                <p className="text-lg font-bold text-[#0D2D52]">6/7</p>
              </Card>
              <Card className="text-center">
                <p className="text-xs text-[#64748B] font-medium mb-1">Avg Net Flow</p>
                <p className="text-lg font-bold text-[#10B981] font-['JetBrains_Mono',monospace]">+₦18k</p>
              </Card>
              <Card className="text-center">
                <p className="text-xs text-[#64748B] font-medium mb-1">Factor Score</p>
                <p className="text-lg font-bold text-[#F59E0B] font-['JetBrains_Mono',monospace]">71/100</p>
              </Card>
            </div>
            <Card>
              <p className="text-sm font-bold text-[#0D1F35] mb-1">Cash-Flow Activity</p>
              <p className="text-xs text-[#64748B] mb-4">December showed a negative net position — spending exceeded income by ₦17,000.</p>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={cashflowData} margin={{ top: 0, right: 8, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`} />
                    <Tooltip content={<ChartTooltip />} />
                    <ReferenceLine y={0} stroke="#E2EAF2" />
                    <Line type="monotone" dataKey="net" name="Net Cash Flow" stroke="#0D2D52" strokeWidth={2} dot={{ fill: "#0D2D52", r: 4 }} activeDot={{ r: 6, fill: "#10B981" }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <Button onClick={() => navigate("recommendation")}>View Assessment →</Button>
          <Button variant="secondary" onClick={() => navigate("customer-detail")}>← Customer Profile</Button>
        </div>
      </div>
    </BankLayout>
  );
}
