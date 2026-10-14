import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileSearch,
  RefreshCw,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";
import { BankLayout } from "../components/Layout";
import { Avatar, Badge, Button, Card } from "../components/ui";
import {
  getEcobankCustomers,
  getEcobankDashboardSummary,
  type EcobankCustomer,
  type EcobankDashboardSummary,
  type ReviewStatus,
} from "../services/ecobankService";

interface Props {
  navigate: (screen: string, params?: { customerId?: string }) => void;
}

type ReviewFilter = "ALL" | ReviewStatus;

const FILTERS: { value: ReviewFilter; label: string }[] = [
  { value: "ALL", label: "All shared profiles" },
  { value: "NOT_REVIEWED", label: "Awaiting review" },
  { value: "IN_REVIEW", label: "In review" },
  { value: "NEEDS_MORE_INFORMATION", label: "More information" },
  { value: "REFERRED_TO_CREDIT_TEAM", label: "Referred to credit team" },
  { value: "REVIEW_COMPLETED", label: "TrustID review completed" },
];

function reviewLabel(status?: ReviewStatus): string {
  switch (status) {
    case "IN_REVIEW": return "In review";
    case "NEEDS_MORE_INFORMATION": return "More information needed";
    case "REFERRED_TO_CREDIT_TEAM": return "Referred to credit team";
    case "REVIEW_COMPLETED": return "TrustID review completed";
    default: return "Awaiting review";
  }
}

function reviewVariant(status?: ReviewStatus): "success" | "good" | "fair" | "warning" | "info" | "neutral" {
  switch (status) {
    case "IN_REVIEW": return "info";
    case "NEEDS_MORE_INFORMATION": return "warning";
    case "REFERRED_TO_CREDIT_TEAM": return "fair";
    case "REVIEW_COMPLETED": return "success";
    default: return "neutral";
  }
}

function bandVariant(band?: string): "success" | "good" | "fair" | "warning" | "info" | "neutral" {
  switch (band) {
    case "Excellent": return "success";
    case "Strong":
    case "Good": return "good";
    case "Fair": return "fair";
    case "Developing": return "warning";
    default: return "neutral";
  }
}

function formatDate(value?: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
}

function initials(customer: EcobankCustomer): string {
  return `${customer.firstName?.[0] || ""}${customer.lastName?.[0] || ""}`.toUpperCase();
}

export default function CustomerOverviewPage({ navigate }: Props) {
  const [customers, setCustomers] = useState<EcobankCustomer[]>([]);
  const [summary, setSummary] = useState<EcobankDashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<ReviewFilter>("ALL");

  async function loadWorkspace() {
    setLoading(true);
    setError("");
    try {
      const [customerData, summaryData] = await Promise.all([
        getEcobankCustomers(),
        getEcobankDashboardSummary(),
      ]);
      setCustomers(Array.isArray(customerData) ? customerData : []);
      setSummary(summaryData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load the Ecobank review workspace.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadWorkspace();
  }, []);

  const visibleCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();
    return customers.filter((customer) => {
      const matchesQuery = !query || [
        `${customer.firstName} ${customer.lastName}`,
        customer.email,
        customer.phone,
        customer._id,
      ].some((value) => (value || "").toLowerCase().includes(query));
      const matchesFilter = filter === "ALL" || (customer.review?.status || "NOT_REVIEWED") === filter;
      return matchesQuery && matchesFilter;
    });
  }, [customers, search, filter]);

  const followUpCount = (summary?.reviews?.NEEDS_MORE_INFORMATION || 0)
    + (summary?.reviews?.REFERRED_TO_CREDIT_TEAM || 0);

  return (
    <BankLayout current="customer-overview" navigate={navigate}>
      <div className="min-h-screen bg-[#F8FAFB]">
        <header className="border-b border-[#E2EAF2] bg-white">
          <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold text-[#2563A0]">Ecobank · TrustID decision support</p>
                <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#0D2D52]">Shared customer profiles</h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#64748B]">
                  Review explainable financial-behaviour signals that customers have chosen to share. TrustID adds context to Ecobank's existing lending workflow; it does not approve or reject loans.
                </p>
              </div>
              <Button variant="secondary" onClick={() => void loadWorkspace()} disabled={loading}>
                <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                {loading ? "Refreshing…" : "Refresh workspace"}
              </Button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-5 py-7 sm:px-8">
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-[#C8D9EC] bg-[#EFF5FB] p-4 sm:p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#0D2D52]">
              <ShieldCheck size={21} />
            </div>
            <div>
              <p className="font-semibold text-[#0D2D52]">An additional credibility layer, not a replacement system</p>
              <p className="mt-1 text-sm leading-6 text-[#526579]">
                Use the profile to understand income consistency, savings, repayment behaviour, cash-flow stability and financial discipline alongside KYC, credit checks, documents and Ecobank's normal underwriting process.
              </p>
            </div>
          </div>

          <div className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Card className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#64748B]">Profiles shared</p>
                <Users size={19} className="text-[#2563A0]" />
              </div>
              <p className="mt-2 text-3xl font-bold text-[#0D2D52]">{loading ? "—" : summary?.sharedProfiles ?? customers.length}</p>
              <p className="mt-1 text-xs leading-5 text-[#94A3B8]">Customer-controlled sharing</p>
            </Card>
            <Card className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#64748B]">Awaiting review</p>
                <Clock3 size={19} className="text-amber-600" />
              </div>
              <p className="mt-2 text-3xl font-bold text-[#0D2D52]">{loading ? "—" : summary?.reviews?.NOT_REVIEWED ?? 0}</p>
              <p className="mt-1 text-xs leading-5 text-[#94A3B8]">Shared profiles not yet reviewed</p>
            </Card>
            <Card className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#64748B]">Review in progress</p>
                <FileSearch size={19} className="text-[#2563A0]" />
              </div>
              <p className="mt-2 text-3xl font-bold text-[#0D2D52]">{loading ? "—" : summary?.reviews?.IN_REVIEW ?? 0}</p>
              <p className="mt-1 text-xs leading-5 text-[#94A3B8]">Officer workflow status</p>
            </Card>
            <Card className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#64748B]">Follow-up / referral</p>
                <AlertCircle size={19} className="text-orange-600" />
              </div>
              <p className="mt-2 text-3xl font-bold text-[#0D2D52]">{loading ? "—" : followUpCount}</p>
              <p className="mt-1 text-xs leading-5 text-[#94A3B8]">Needs context or existing credit-team review</p>
            </Card>
          </div>

          <div className="mb-6 grid gap-4 lg:grid-cols-[1fr_300px]">
            <Card className="p-4">
              <label className="relative block">
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search shared profiles by name, email, phone or ID…"
                  className="w-full rounded-xl border border-[#D7E1EA] bg-white py-3 pl-10 pr-4 text-sm text-[#0D2D52] outline-none focus:border-[#2563A0] focus:ring-2 focus:ring-[#2563A0]/10"
                />
              </label>
              <div className="mt-3 flex flex-wrap gap-2">
                {FILTERS.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setFilter(item.value)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${filter === item.value ? "border-[#0D2D52] bg-[#0D2D52] text-white" : "border-[#D7E1EA] bg-white text-[#64748B] hover:border-[#A8BED5] hover:text-[#0D2D52]"}`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </Card>

            <Card className="p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">Workspace snapshot</p>
              <div className="mt-3 flex items-center justify-between gap-4">
                <span className="text-sm text-[#64748B]">Average TrustID score</span>
                <strong className="text-lg text-[#0D2D52]">{loading ? "—" : `${summary?.averageScore || 0}/850`}</strong>
              </div>
              <p className="mt-2 text-xs leading-5 text-[#94A3B8]">Based on profiles with an available score. A score is not a lending decision.</p>
            </Card>
          </div>

          {error && (
            <Card className="mb-6 border-red-200 bg-red-50 p-5">
              <div className="flex items-start gap-3">
                <AlertCircle size={20} className="mt-0.5 text-red-600" />
                <div>
                  <p className="font-semibold text-red-800">Workspace could not be loaded</p>
                  <p className="mt-1 text-sm leading-6 text-red-700">{error}</p>
                  <Button variant="secondary" className="mt-3" onClick={() => void loadWorkspace()}>Try again</Button>
                </div>
              </div>
            </Card>
          )}

          {loading && (
            <div className="space-y-3">
              {[1, 2, 3].map((item) => <Card key={item} className="animate-pulse p-6"><div className="h-5 w-48 rounded bg-[#E2EAF2]" /><div className="mt-3 h-4 w-72 rounded bg-[#F1F5F9]" /></Card>)}
            </div>
          )}

          {!loading && !error && visibleCustomers.length === 0 && (
            <Card className="p-10 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EFF4F9] text-[#0D2D52]"><Users size={23} /></div>
              <h2 className="mt-4 font-semibold text-[#0D2D52]">{customers.length === 0 ? "No profiles have been shared yet" : "No profiles match this view"}</h2>
              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#64748B]">
                {customers.length === 0
                  ? "A customer first checks their own TrustID profile and then chooses Share with Ecobank. For the competition walkthrough, run the demo seed script described in the setup notes."
                  : "Try another search term or review status filter."}
              </p>
              {(search || filter !== "ALL") && <Button variant="secondary" className="mt-4" onClick={() => { setSearch(""); setFilter("ALL"); }}>Clear filters</Button>}
            </Card>
          )}

          {!loading && visibleCustomers.length > 0 && (
            <Card padding="none" className="overflow-hidden">
              <div className="flex flex-col gap-1 border-b border-[#E2EAF2] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div>
                  <h2 className="font-bold text-[#0D2D52]">Customer review queue</h2>
                  <p className="mt-1 text-xs text-[#94A3B8]">{visibleCustomers.length} profile{visibleCustomers.length === 1 ? "" : "s"} shown</p>
                </div>
                <p className="text-xs text-[#94A3B8]">Demo data is labelled on each profile</p>
              </div>
              <div className="divide-y divide-[#EEF2F6]">
                {visibleCustomers.map((customer) => (
                  <div key={customer._id} className="flex flex-col gap-4 px-5 py-5 transition hover:bg-[#FBFCFE] sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar initials={initials(customer)} size="md" />
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-[#0D2D52]">{customer.firstName} {customer.lastName}</p>
                        <p className="mt-1 truncate text-sm text-[#64748B]">{customer.email}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <Badge variant={reviewVariant(customer.review?.status)}>{reviewLabel(customer.review?.status)}</Badge>
                          {customer.trustProfile?.dataSource === "SIMULATED_DEMO" && <Badge variant="neutral">Simulated data</Badge>}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 items-center gap-4 sm:min-w-[310px] sm:grid-cols-[1fr_1fr_auto]">
                      <div>
                        <p className="text-xs text-[#94A3B8]">TrustID score</p>
                        {customer.trustProfile ? (
                          <div className="mt-1 flex items-center gap-2">
                            <strong className="text-lg text-[#0D2D52]">{customer.trustProfile.score}<span className="text-xs font-medium text-[#94A3B8]">/850</span></strong>
                            <Badge variant={bandVariant(customer.trustProfile.band)}>{customer.trustProfile.band}</Badge>
                          </div>
                        ) : <p className="mt-1 text-sm font-semibold text-[#64748B]">Not generated</p>}
                        <p className="mt-1 text-xs text-[#94A3B8]">Updated {formatDate(customer.trustProfile?.generatedAt)}</p>
                      </div>
                      <div className="hidden sm:block">
                        <p className="text-xs text-[#94A3B8]">Shared on</p>
                        <p className="mt-1 text-sm font-medium text-[#475569]">{formatDate(customer.sharingConsent?.grantedAt)}</p>
                      </div>
                      <Button size="sm" onClick={() => navigate("customer-detail", { customerId: customer._id })}>
                        Open <ArrowRight size={15} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <div className="mt-6 flex items-start gap-2 text-xs leading-5 text-[#94A3B8]">
            <CheckCircle2 size={15} className="mt-0.5 shrink-0" />
            <p>Use TrustID as supporting information only. Ecobank's existing KYC, credit checks, affordability review and final lending decision remain in place.</p>
          </div>
        </main>
      </div>
    </BankLayout>
  );
}
