import { useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Clock3,
  FileSearch,
  Info,
  Save,
  ShieldCheck,
} from "lucide-react";
import { BankLayout } from "../components/Layout";
import { Badge, Button, Card, ProgressBar } from "../components/ui";
import {
  getEcobankCustomer,
  saveEcobankCustomerReview,
  type EcobankCustomerDetail,
  type ReviewStatus,
} from "../services/ecobankService";

interface Props {
  navigate: (page: string, params?: { customerId?: string }) => void;
  customerId?: string;
}

type EditableReviewStatus = Exclude<ReviewStatus, "NOT_REVIEWED">;

const reviewOptions: { value: EditableReviewStatus; label: string; helper: string }[] = [
  { value: "IN_REVIEW", label: "Review in progress", helper: "Continue examining this profile alongside the existing lending checks." },
  { value: "NEEDS_MORE_INFORMATION", label: "More information needed", helper: "Record what supporting information the existing process should request." },
  { value: "REFERRED_TO_CREDIT_TEAM", label: "Refer to existing credit team", helper: "Send the case through Ecobank's existing credit-review route." },
  { value: "REVIEW_COMPLETED", label: "TrustID review completed", helper: "Mark the TrustID review as completed; normal lending assessment still applies." },
];

function labelForFactor(key: string): string {
  const labels: Record<string, string> = {
    incomeConsistency: "Income consistency",
    savingsBehaviour: "Savings behaviour",
    repaymentBehaviour: "Repayment behaviour",
    cashFlowStability: "Cash-flow stability",
    financialDiscipline: "Financial discipline",
  };
  return labels[key] || key;
}

function bandVariant(band: string): "success" | "good" | "fair" | "warning" | "info" | "neutral" {
  if (band === "Excellent") return "success";
  if (band === "Strong" || band === "Good") return "good";
  if (band === "Fair") return "fair";
  if (band === "Developing") return "warning";
  return "neutral";
}

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

function money(value?: number): string {
  if (value === undefined || value === null || Number.isNaN(Number(value))) return "—";
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
}

function dateLabel(value?: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" });
}

export default function DecisionSupportPage({ navigate, customerId }: Props) {
  const [data, setData] = useState<EcobankCustomerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const [reviewStatus, setReviewStatus] = useState<EditableReviewStatus>("IN_REVIEW");
  const [reviewNote, setReviewNote] = useState("");

  useEffect(() => {
    if (!customerId) {
      setError("No customer was selected.");
      setLoading(false);
      return;
    }

    let cancelled = false;
    async function loadCustomer() {
      try {
        setLoading(true);
        setError("");
        const result = await getEcobankCustomer(customerId as string);
        if (cancelled) return;
        setData(result);
        setReviewNote(result.review?.note || "");
        if (result.review?.status && result.review.status !== "NOT_REVIEWED") {
          setReviewStatus(result.review.status);
        } else {
          setReviewStatus("IN_REVIEW");
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Unable to load customer profile.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void loadCustomer();
    return () => { cancelled = true; };
  }, [customerId]);

  async function handleSaveReview() {
    if (!customerId) return;
    if (["NEEDS_MORE_INFORMATION", "REFERRED_TO_CREDIT_TEAM"].includes(reviewStatus) && !reviewNote.trim()) {
      setSaveMessage("Add a short note explaining the follow-up step before saving.");
      return;
    }

    setSaving(true);
    setError("");
    setSaveMessage("");
    try {
      const review = await saveEcobankCustomerReview(customerId, {
        status: reviewStatus,
        note: reviewNote.trim(),
      });
      setData((current) => current ? { ...current, review } : current);
      setSaveMessage("Review status and audit note saved.");
    } catch (err) {
      setSaveMessage(err instanceof Error ? err.message : "Unable to save this review.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="min-h-screen bg-[#F8FAFB] p-6 lg:p-10"><div className="mx-auto max-w-5xl animate-pulse space-y-5"><div className="h-8 w-72 rounded bg-slate-200" /><div className="h-36 rounded-2xl bg-slate-200" /><div className="h-64 rounded-2xl bg-slate-200" /></div></div>;
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#F8FAFB] p-6 lg:p-10">
        <div className="mx-auto max-w-3xl">
          <Card className="p-8 text-center">
            <AlertTriangle size={38} className="mx-auto text-amber-600" />
            <h1 className="mt-4 text-xl font-bold text-[#0D2D52]">Decision support unavailable</h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">{error || "The selected customer could not be loaded."}</p>
            <Button className="mt-5" onClick={() => navigate("customer-overview")}>Back to shared profiles</Button>
          </Card>
        </div>
      </div>
    );
  }

  const customer = data.customer;
  const profile = data.trustProfile;
  const evidence = data.financialEvidence;
  const review = data.review;

  return (
    <BankLayout current="customer-overview" navigate={navigate}>
      <div className="mx-auto max-w-6xl px-5 py-7 sm:px-8">
        <button
          type="button"
          onClick={() => navigate("customer-detail", { customerId: customer._id })}
          className="mb-5 flex items-center gap-2 text-sm font-medium text-[#64748B] hover:text-[#0D2D52]"
        >
          <ArrowLeft size={16} /> Back to customer profile
        </button>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#64748B]">Ecobank · TrustID review</p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#0D2D52]">{customer.firstName} {customer.lastName}</h1>
            <p className="mt-1 text-sm text-[#64748B]">Additional financial credibility information for the existing lending review.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant={reviewVariant(review?.status)}>{reviewLabel(review?.status)}</Badge>
            {profile?.dataSource === "SIMULATED_DEMO" && <Badge variant="neutral">Simulated demo data</Badge>}
          </div>
        </div>

        <div className="mb-6 flex items-start gap-3 rounded-2xl bg-[#0D2D52] p-5 text-white">
          <Info size={22} className="mt-0.5 shrink-0 text-[#9FC8F2]" />
          <div>
            <p className="font-semibold">Ecobank keeps the lending decision</p>
            <p className="mt-1 text-sm leading-6 text-white/75">
              TrustID does not approve or reject a loan, set a credit limit, or replace KYC, affordability checks, credit-bureau checks or existing underwriting. This page records an officer's TrustID review status and next step only.
            </p>
          </div>
        </div>

        {!profile ? (
          <Card className="mb-6 p-8 text-center">
            <ShieldCheck size={38} className="mx-auto text-slate-300" />
            <h2 className="mt-4 font-bold text-[#0D2D52]">No TrustID score available</h2>
            <p className="mt-2 text-sm text-[#64748B]">The customer has shared a profile, but no generated TrustID score is available yet. Do not interpret missing evidence as poor financial behaviour.</p>
          </Card>
        ) : (
          <>
            <div className="mb-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
              <Card className="p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">TrustID financial credibility score</p>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-5xl font-bold tracking-tight text-[#0D2D52]">{profile.totalScore}</span>
                      <span className="text-sm text-[#94A3B8]">/ 850</span>
                    </div>
                    <div className="mt-3"><Badge variant={bandVariant(profile.band)}>{profile.band}</Badge></div>
                  </div>
                  <div className="rounded-xl border border-[#E2EAF2] bg-[#F8FAFB] p-4 sm:max-w-[210px]">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">Evidence source</p>
                    <p className="mt-2 text-sm font-semibold text-[#0D2D52]">{profile.dataSource === "SIMULATED_DEMO" ? "Simulated prototype data" : profile.dataSource === "STATEMENT_UPLOAD" ? "Statement upload" : "Authorised bank connection"}</p>
                    <p className="mt-1 text-xs leading-5 text-[#64748B]">Period represented: {profile.evidencePeriodMonths} months</p>
                    <p className="mt-1 text-xs text-[#94A3B8]">Model: {profile.scoreModelVersion || "prototype-v1"}</p>
                  </div>
                </div>
                <div className="mt-6"><ProgressBar value={profile.totalScore} max={850} /></div>
                <p className="mt-3 text-xs leading-5 text-[#94A3B8]">The band describes the TrustID prototype score only. It is not a probability of repayment or a bank credit rating.</p>
              </Card>

              <Card className="p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">Supporting evidence snapshot</p>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center justify-between gap-3 border-b border-[#EEF2F6] pb-3"><span className="text-sm text-[#64748B]">Average monthly inflow</span><strong className="text-sm text-[#0D2D52]">{money(evidence?.averageMonthlyInflow)}</strong></div>
                  <div className="flex items-center justify-between gap-3 border-b border-[#EEF2F6] pb-3"><span className="text-sm text-[#64748B]">Average monthly savings</span><strong className="text-sm text-[#0D2D52]">{money(evidence?.averageMonthlySavings)}</strong></div>
                  <div className="flex items-center justify-between gap-3 border-b border-[#EEF2F6] pb-3"><span className="text-sm text-[#64748B]">On-time repayment rate</span><strong className="text-sm text-[#0D2D52]">{evidence?.repaymentOnTimeRate ?? "—"}%</strong></div>
                  <div className="flex items-center justify-between gap-3"><span className="text-sm text-[#64748B]">Savings rate</span><strong className="text-sm text-[#0D2D52]">{evidence?.savingsRate ?? "—"}%</strong></div>
                </div>
                <Button variant="secondary" className="mt-5 w-full" onClick={() => navigate("supporting-evidence", { customerId: customer._id })}>View all evidence <FileSearch size={16} /></Button>
              </Card>
            </div>

            <Card className="mb-6 p-6">
              <div className="mb-5">
                <h2 className="font-bold text-[#0D2D52]">Behavioural factor breakdown</h2>
                <p className="mt-1 text-sm leading-6 text-[#64748B]">Each factor gives context behind the score. Review the underlying evidence before drawing conclusions.</p>
              </div>
              <div className="grid gap-x-8 gap-y-5 md:grid-cols-2">
                {Object.entries(profile.factors || {}).map(([key, factor]) => {
                  const percentage = factor.max > 0 ? Math.round((factor.score / factor.max) * 100) : 0;
                  return (
                    <div key={key}>
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <span className="text-sm font-semibold text-[#0D2D52]">{labelForFactor(key)}</span>
                        <span className="text-sm tabular-nums text-[#64748B]">{factor.score}/{factor.max}</span>
                      </div>
                      <ProgressBar value={factor.score} max={factor.max} />
                      <p className="mt-1 text-right text-xs text-[#94A3B8]">{percentage}% of available points</p>
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card className="mb-6 p-6">
              <div className="mb-4 flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EFF4F9] text-[#0D2D52]"><FileSearch size={19} /></div>
                <div>
                  <h2 className="font-bold text-[#0D2D52]">TrustID suggestions for further review</h2>
                  <p className="mt-1 text-sm leading-6 text-[#64748B]">These are explainable suggestions generated from the demo's behaviour metrics. They support an officer's review and are not a credit decision.</p>
                </div>
              </div>
              {profile.recommendations?.length ? (
                <ul className="space-y-3">
                  {profile.recommendations.map((item) => <li key={item} className="flex gap-3 rounded-xl border border-[#E2EAF2] bg-[#FBFCFE] p-3 text-sm leading-6 text-[#475569]"><span className="font-bold text-[#2563A0]">→</span><span>{item}</span></li>)}
                </ul>
              ) : (
                <p className="text-sm leading-6 text-[#64748B]">No additional suggestions were saved for this profile. Check the supporting evidence and scoring model version.</p>
              )}
            </Card>

            <div className="mb-6 grid gap-4 lg:grid-cols-2">
              <Card className="p-6">
                <div className="mb-4 flex items-center gap-2"><CheckCircle2 size={20} className="text-emerald-600" /><h2 className="font-bold text-[#0D2D52]">Positive signals</h2></div>
                {profile.strengths?.length ? <ul className="space-y-3">{profile.strengths.map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-[#475569]"><span className="font-bold text-emerald-600">✓</span><span>{item}</span></li>)}</ul> : <p className="text-sm text-[#64748B]">No positive signals were recorded. Check the source evidence.</p>}
              </Card>
              <Card className="p-6">
                <div className="mb-4 flex items-center gap-2"><AlertTriangle size={20} className="text-amber-600" /><h2 className="font-bold text-[#0D2D52]">Areas to examine</h2></div>
                {profile.opportunities?.length ? <ul className="space-y-3">{profile.opportunities.map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-[#475569]"><span className="font-bold text-amber-600">•</span><span>{item}</span></li>)}</ul> : <p className="text-sm text-[#64748B]">No specific areas were flagged. This is not, by itself, evidence of lending suitability.</p>}
              </Card>
            </div>
          </>
        )}

        <Card className="mb-6 p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EFF4F9] text-[#0D2D52]"><FileSearch size={20} /></div>
            <div>
              <h2 className="font-bold text-[#0D2D52]">Record the TrustID review</h2>
              <p className="mt-1 text-sm leading-6 text-[#64748B]">This records how the TrustID information should move through the existing process. It is not a loan outcome.</p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <label htmlFor="review-status" className="mb-2 block text-sm font-semibold text-[#0D2D52]">Review status / next step</label>
              <select id="review-status" value={reviewStatus} onChange={(event) => setReviewStatus(event.target.value as EditableReviewStatus)} className="w-full rounded-xl border border-[#D7E1EA] bg-white px-4 py-3 text-sm text-[#0D2D52] outline-none focus:border-[#2563A0] focus:ring-2 focus:ring-[#2563A0]/10">
                {reviewOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
              <p className="mt-2 text-xs leading-5 text-[#64748B]">{reviewOptions.find((option) => option.value === reviewStatus)?.helper}</p>
            </div>
            <div>
              <label htmlFor="review-note" className="mb-2 block text-sm font-semibold text-[#0D2D52]">Officer note</label>
              <textarea id="review-note" value={reviewNote} onChange={(event) => setReviewNote(event.target.value)} rows={4} maxLength={1500} placeholder="Record what you observed or what information should be checked through the existing process…" className="w-full resize-y rounded-xl border border-[#D7E1EA] bg-white px-4 py-3 text-sm leading-6 text-[#0D2D52] outline-none focus:border-[#2563A0] focus:ring-2 focus:ring-[#2563A0]/10" />
              <p className="mt-1 text-right text-xs text-[#94A3B8]">{reviewNote.length}/1500</p>
            </div>
          </div>
          {saveMessage && <p className={`mt-3 text-sm ${saveMessage.toLowerCase().includes("unable") || saveMessage.startsWith("Add a short") ? "text-red-600" : "text-emerald-700"}`}>{saveMessage}</p>}
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-5 text-[#94A3B8]">Saved reviews include a timestamp, officer name, status and note.</p>
            <Button onClick={() => void handleSaveReview()} disabled={saving}>
              <Save size={16} /> {saving ? "Saving review…" : "Save review update"}
            </Button>
          </div>
        </Card>

        <Card className="mb-6 p-6">
          <div className="mb-4 flex items-center gap-2"><Clock3 size={19} className="text-[#2563A0]" /><h2 className="font-bold text-[#0D2D52]">Review history</h2></div>
          {review?.history?.length ? (
            <div className="space-y-4">
              {[...review.history].reverse().map((event, index) => (
                <div key={`${event.occurredAt}-${index}`} className="flex gap-3 border-l-2 border-[#D7E5F2] pl-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2"><p className="text-sm font-semibold text-[#0D2D52]">{reviewLabel(event.status)}</p><span className="text-xs text-[#94A3B8]">{dateLabel(event.occurredAt)}</span></div>
                    <p className="mt-1 text-xs text-[#64748B]">By {event.officerName}</p>
                    {event.note && <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#475569]">{event.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          ) : <p className="text-sm leading-6 text-[#64748B]">No officer review has been recorded yet.</p>}
          {review?.lastReviewedAt && <p className="mt-4 border-t border-[#EEF2F6] pt-3 text-xs text-[#94A3B8]">Last updated by {review.lastReviewedByName || "Ecobank officer"} · {dateLabel(review.lastReviewedAt)}</p>}
        </Card>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button variant="secondary" onClick={() => navigate("customer-detail", { customerId: customer._id })}>Customer profile</Button>
          <Button variant="secondary" onClick={() => navigate("recommendation", { customerId: customer._id })}>Assessment summary</Button>
          <Button onClick={() => navigate("customer-overview")}>Back to review queue</Button>
        </div>

        <div className="mt-6 flex items-start gap-2 text-xs leading-5 text-[#94A3B8]">
          <ShieldCheck size={15} className="mt-0.5 shrink-0" />
          <p>Competition prototype: the current score is based on simulated behaviour data. Production use would require authorised data access, validated scoring, security, privacy and bank integration.</p>
        </div>
      </div>
    </BankLayout>
  );
}
