import { useState } from "react";
import { BankLayout } from "../components/Layout";
import { Card, Badge, Avatar, StatCard, getScoreBadgeVariant, getScoreLevel } from "../components/ui";
import { ecobankCustomers } from "../data/mockData";

interface Props { navigate: (s: string) => void; }

export default function CustomerOverviewPage({ navigate }: Props) {
  const [search, setSearch] = useState("");
  const [filterLevel, setFilterLevel] = useState("All");

  const filtered = ecobankCustomers.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchLevel = filterLevel === "All" || getScoreLevel(c.score) === filterLevel;
    return matchSearch && matchLevel;
  });

  const avgScore = Math.round(ecobankCustomers.reduce((a, c) => a + c.score, 0) / ecobankCustomers.length);

  const factorBar = (val: number) => (
    <div className="flex items-center gap-2">
      <div className="w-12 h-1.5 bg-[#E8EEF4] rounded-full overflow-hidden">
        <div className="h-full rounded-full bg-[#2563A0]" style={{ width: `${val}%` }} />
      </div>
      <span className="text-xs font-medium text-[#374151]">{val}</span>
    </div>
  );

  return (
    <BankLayout current="customer-overview" navigate={navigate}>
      <div className="px-6 sm:px-8 py-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-widest mb-1">Ecobank TrustID</p>
            <h1 className="text-2xl font-bold text-[#0D1F35] tracking-tight">TrustID Customer Insights</h1>
            <p className="text-sm text-[#64748B] mt-1">Financial behaviour profiles to support decision-making</p>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-xs text-[#94A3B8]">Last synced</p>
            <p className="text-sm font-semibold text-[#374151]">4 Sep 2026, 08:42</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Customers" value="1,248" sub="With TrustID profiles" />
          <StatCard label="Strong Profiles" value="684" sub="Score 720+" color="#0D2D52" />
          <StatCard label="Developing Profiles" value="231" sub="Score below 600" color="#F59E0B" />
          <StatCard label="Average Score" value={avgScore} sub="Out of 850" color="#10B981" />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="7" cy="7" r="5" />
              <path d="M11 11l3 3" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Search customers…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E2EAF2] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0D2D52] text-[#0D1F35] placeholder:text-[#94A3B8]"
            />
          </div>
          <div className="flex gap-2">
            {["All", "Strong", "Good", "Fair"].map((level) => (
              <button
                key={level}
                onClick={() => setFilterLevel(level)}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                  filterLevel === level
                    ? "bg-[#0D2D52] text-white border-[#0D2D52]"
                    : "bg-white text-[#64748B] border-[#E2EAF2] hover:border-[#0D2D52] hover:text-[#0D2D52]"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <Card padding="none" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F8FAFB] border-b border-[#E2EAF2]">
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-[#64748B] uppercase tracking-wider">Customer</th>
                  <th className="text-left px-4 py-3.5 text-xs font-bold text-[#64748B] uppercase tracking-wider">Score</th>
                  <th className="text-left px-4 py-3.5 text-xs font-bold text-[#64748B] uppercase tracking-wider">Profile</th>
                  <th className="text-left px-4 py-3.5 text-xs font-bold text-[#64748B] uppercase tracking-wider hidden md:table-cell">Income</th>
                  <th className="text-left px-4 py-3.5 text-xs font-bold text-[#64748B] uppercase tracking-wider hidden md:table-cell">Savings</th>
                  <th className="text-left px-4 py-3.5 text-xs font-bold text-[#64748B] uppercase tracking-wider hidden lg:table-cell">Repayment</th>
                  <th className="text-left px-4 py-3.5 text-xs font-bold text-[#64748B] uppercase tracking-wider hidden lg:table-cell">Cash Flow</th>
                  <th className="text-left px-4 py-3.5 text-xs font-bold text-[#64748B] uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {filtered.map((c) => (
                  <tr
                    key={c.id}
                    className="hover:bg-[#F8FAFB] transition-colors cursor-pointer"
                    onClick={() => navigate("customer-detail")}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar initials={c.avatar} size="sm" color={c.score >= 720 ? "#0D2D52" : c.score >= 650 ? "#2563A0" : "#F59E0B"} />
                        <div>
                          <p className="text-sm font-semibold text-[#0D1F35]">{c.name}</p>
                          <p className="text-xs text-[#94A3B8]">Updated {c.lastUpdated}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm font-bold text-[#0D1F35] font-['JetBrains_Mono',monospace]">{c.score}</p>
                      <p className="text-xs text-[#94A3B8]">/ 850</p>
                    </td>
                    <td className="px-4 py-4">
                      <Badge variant={getScoreBadgeVariant(c.score)}>{getScoreLevel(c.score)}</Badge>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">{factorBar(c.income)}</td>
                    <td className="px-4 py-4 hidden md:table-cell">{factorBar(c.savings)}</td>
                    <td className="px-4 py-4 hidden lg:table-cell">{factorBar(c.repayment)}</td>
                    <td className="px-4 py-4 hidden lg:table-cell">{factorBar(c.cashflow)}</td>
                    <td className="px-4 py-4">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        c.status === "Active" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate("customer-detail"); }}
                        className="text-xs font-semibold text-[#0D2D52] hover:underline whitespace-nowrap"
                      >
                        View →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-[#E2EAF2] bg-[#F8FAFB] flex items-center justify-between">
            <p className="text-xs text-[#94A3B8]">Showing {filtered.length} of 1,248 customers</p>
            <div className="flex gap-2">
              <button className="text-xs font-semibold text-[#64748B] border border-[#E2EAF2] bg-white px-3 py-1.5 rounded-lg hover:border-[#0D2D52]">Previous</button>
              <button className="text-xs font-semibold text-white bg-[#0D2D52] px-3 py-1.5 rounded-lg">Next</button>
            </div>
          </div>
        </Card>
      </div>
    </BankLayout>
  );
}
