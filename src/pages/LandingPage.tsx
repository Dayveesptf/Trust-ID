interface Props { navigate: (s: string) => void; }
import logotext from "../assets/logo-nav-light.png"


const steps = [
  { step: "01", label: "Financial Behaviour", desc: "Your everyday transactions, savings and payments", icon: "💳" },
  { step: "02", label: "TrustID Analysis", desc: "We analyse five key financial behaviour dimensions", icon: "🔍" },
  { step: "03", label: "Trust Profile", desc: "A transparent, explainable credibility score", icon: "🛡" },
  { step: "04", label: "Financial Growth", desc: "Personalised recommendations to strengthen your profile", icon: "📈" },
  { step: "05", label: "Better Lending Insight", desc: "Richer context to support financial institutions", icon: "🏦" },
];

const features = [
  { title: "What TrustID Does", body: "TrustID analyses your existing financial behaviour — how you earn, save, repay and manage money — and transforms it into a clear, explainable credibility profile. No guesswork. No black box." },
  { title: "Why Behaviour Matters", body: "Traditional credit history isn't always available for young people. TrustID fills that gap by looking at how you actually manage money, not just whether you've had a loan before." },
  { title: "How You Can Improve", body: "TrustID shows you exactly what drives your score and provides practical, supportive recommendations to help you build stronger financial habits over time." },
  { title: "Supporting Finance Institutions", body: "TrustID provides Ecobank with additional behavioural insights to help analysts make more informed decisions. TrustID does not make lending decisions — Ecobank does." },
];

export default function LandingPage({ navigate }: Props) {
  return (
    <div className="min-h-screen bg-white font-['DM_Sans',sans-serif]">
      {/* Nav */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-sm border-b border-[#E2EAF2]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src={logotext} alt="TrustID" className="h-8 w-auto" />
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("ecobank-login")}
              className="text-sm text-[#64748B] hover:text-[#0D2D52] font-medium transition-colors px-3 py-2"
            >
              Ecobank Portal
            </button>
            <button
              onClick={() => navigate("signup")}
              className="bg-[#0D2D52] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#163D6A] transition-all shadow-sm"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-24 grid lg:grid-cols-2 gap-16 items-center">
        <div className="animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-[#EFF4F9] text-[#0D2D52] text-xs font-semibold px-3 py-1.5 rounded-full mb-6 border border-[#C8D9EC]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] animate-pulse" />
            Built for the next generation of savers
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#0D1F35] leading-tight tracking-tight mb-6">
            Build Financial Credibility.{" "}
            <span className="text-[#0D2D52]">Unlock More</span>{" "}
            Possibilities.
          </h1>
          <p className="text-lg text-[#64748B] leading-relaxed mb-8 max-w-lg">
            TrustID turns your everyday financial behaviour into an explainable financial credibility profile — helping you and your financial institution see the full picture.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate("signup")}
              className="bg-[#0D2D52] text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-[#163D6A] transition-all shadow-sm hover:shadow-md text-base"
            >
              Build My Trust Profile
            </button>
            <a
              href="#how-it-works"
              className="border border-[#E2EAF2] text-[#0D2D52] font-semibold px-7 py-3.5 rounded-xl hover:bg-[#F8FAFB] transition-all text-base text-center"
            >
              How TrustID Works
            </a>
          </div>
          <p className="mt-5 text-xs text-[#94A3B8] flex items-center gap-2">
            <svg className="h-3.5 w-3.5 text-[#10B981]" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 6l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            No credit history required · Transparent scoring · Your data, your control
          </p>
        </div>

        {/* Score card preview */}
        <div className="animate-fade-in-up delay-200 hidden sm:flex justify-center">
          <div className="bg-white rounded-3xl border border-[#E2EAF2] shadow-xl p-8 w-80">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">TrustID Score</p>
                <p className="text-4xl font-bold text-[#0D1F35] font-['JetBrains_Mono',monospace] mt-1">742</p>
                <p className="text-xs text-[#64748B] mt-0.5">out of 850</p>
              </div>
              <div className="h-16 w-16 rounded-2xl bg-emerald-50 flex items-center justify-center">
                <span className="text-2xl">🛡</span>
              </div>
            </div>
            <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-200 mb-5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Strong Financial Profile
            </div>
            <div className="space-y-3">
              {[
                { label: "Income Consistency", val: 82, color: "#0D2D52" },
                { label: "Repayment Behaviour", val: 94, color: "#10B981" },
                { label: "Savings Behaviour", val: 76, color: "#2563A0" },
              ].map(({ label, val, color }) => (
                <div key={label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#64748B] font-medium">{label}</span>
                    <span className="text-[#0D1F35] font-semibold">{val}/100</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-[#E2EAF2] overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${val}%`, backgroundColor: color }} />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-5 text-xs text-[#94A3B8] text-center">Last updated 4 Sep 2026</p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-[#F8FAFB] border-y border-[#E2EAF2] py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-[#0D1F35] tracking-tight mb-3">How TrustID Works</h2>
            <p className="text-[#64748B] max-w-lg mx-auto">Five simple steps from financial behaviour to richer insight</p>
          </div>
          <div className="relative">
            {/* Connector line */}
            <div className="hidden lg:block absolute top-9 left-[10%] right-[10%] h-px bg-[#E2EAF2]" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {steps.map((s, i) => (
                <div key={i} className="relative flex flex-col items-center text-center group">
                  <div className="h-18 w-18 rounded-2xl bg-white border-2 border-[#E2EAF2] group-hover:border-[#0D2D52] transition-colors flex flex-col items-center justify-center mb-4 shadow-sm z-10 p-3">
                    <span className="text-2xl mb-1">{s.icon}</span>
                    <span className="text-xs font-bold text-[#0D2D52] font-['JetBrains_Mono',monospace]">{s.step}</span>
                  </div>
                  <p className="text-sm font-bold text-[#0D1F35] mb-1.5">{s.label}</p>
                  <p className="text-xs text-[#64748B] leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-[#0D1F35] tracking-tight mb-3">Why TrustID Matters</h2>
          <p className="text-[#64748B] max-w-lg mx-auto">A fairer, more transparent way to demonstrate financial credibility</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          {features.map((f, i) => (
            <div key={i} className="bg-white rounded-2xl border border-[#E2EAF2] p-6 hover:shadow-md hover:border-[#C8D9EC] transition-all">
              <div className="h-8 w-8 rounded-xl bg-[#EFF4F9] flex items-center justify-center mb-4">
                <div className="h-2.5 w-2.5 rounded-full bg-[#0D2D52]" />
              </div>
              <h3 className="text-base font-bold text-[#0D1F35] mb-2">{f.title}</h3>
              <p className="text-sm text-[#64748B] leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <section className="bg-[#EFF4F9] border-y border-[#C8D9EC] py-8">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-sm text-[#0D2D52] font-medium">
            <span className="font-bold">Important:</span> TrustID provides additional financial behaviour insights to support decision-making. TrustID does not approve or reject loans. Ecobank retains full responsibility for all final lending decisions.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center max-w-2xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-[#0D1F35] tracking-tight mb-4">Ready to build your Trust Profile?</h2>
        <p className="text-[#64748B] mb-8">Get started in minutes. Your financial behaviour tells a story — let TrustID help tell it clearly.</p>
        <button
          onClick={() => navigate("signup")}
          className="bg-[#0D2D52] text-white font-semibold px-8 py-4 rounded-xl hover:bg-[#163D6A] transition-all shadow-sm hover:shadow-md text-base"
        >
          Build Trust Profile
        </button>
        <p className="mt-4 text-xs text-[#94A3B8]">Free to use · No credit history needed · Transparent and explainable</p>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E2EAF2] py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src={logotext} alt="TrustID" className="h-6 w-auto" />
          </div>
          <p className="text-xs text-[#94A3B8]">© 2026 TrustID · Competition Prototype · Simulated data only</p>
          <button onClick={() => navigate("ecobank-login")} className="text-xs text-[#64748B] hover:text-[#0D2D52] font-medium">
            Ecobank Portal →
          </button>
        </div>
      </footer>
    </div>
  );
}
