import { useState } from "react";
import { Button, Input } from "../components/ui";
import logoHeroDark from "../assets/logo-hero-dark.png"
import logoNavLight from "../assets/logo-nav-light.png"

interface Props { navigate: (s: string) => void; }

export default function SignUpPage({ navigate }: Props) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [showPass, setShowPass] = useState(false);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="min-h-screen bg-[#F8FAFB] flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] bg-[#0D2D52] p-10 shrink-0">
        <button onClick={() => navigate("landing")} className="flex items-center">
            <img src={logoHeroDark} alt="TrustID — Your Financial Behaviour. Your Credibility." className="h-20 w-auto" />
        </button>

        <div>
          <p className="text-white/50 text-sm font-medium uppercase tracking-widest mb-6">Why TrustID?</p>
          <div className="space-y-5">
            {[
              { icon: "🛡", title: "Transparent Scoring", body: "Understand exactly what drives your profile — no black boxes." },
              { icon: "📈", title: "Build Credibility", body: "Your everyday financial behaviour tells a richer story." },
              { icon: "🔒", title: "Your Data, Your Control", body: "You decide what to share and when." },
            ].map((item) => (
              <div key={item.title} className="flex gap-4">
                <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-lg shrink-0">{item.icon}</div>
                <div>
                  <p className="text-white font-semibold text-sm">{item.title}</p>
                  <p className="text-white/60 text-xs mt-0.5 leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-white/30 text-xs">© 2026 TrustID · Competition Prototype</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md animate-fade-in-up">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <img src={logoNavLight} alt="TrustID" className="h-7 w-auto" />
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#0D1F35] tracking-tight mb-1.5">Create your TrustID</h1>
            <p className="text-sm text-[#64748B]">Build your financial credibility profile in minutes.</p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); navigate("onboarding"); }} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="e.g. Daniel Okafor"
              value={form.name}
              onChange={set("name")}
              leftIcon={<PersonIcon />}
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="daniel@email.com"
              value={form.email}
              onChange={set("email")}
              leftIcon={<MailIcon />}
            />
            <Input
              label="Phone Number"
              type="tel"
              placeholder="+234 801 234 5678"
              value={form.phone}
              onChange={set("phone")}
              leftIcon={<PhoneIcon />}
            />
            <Input
              label="Password"
              type={showPass ? "text" : "password"}
              placeholder="At least 8 characters"
              value={form.password}
              onChange={set("password")}
              leftIcon={<LockIcon />}
              rightIcon={
                <button type="button" onClick={() => setShowPass((v) => !v)} className="text-[#94A3B8] hover:text-[#64748B]">
                  {showPass ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              }
            />
            <Input
              label="Confirm Password"
              type="password"
              placeholder="Re-enter your password"
              value={form.confirm}
              onChange={set("confirm")}
              leftIcon={<LockIcon />}
            />

            <div className="flex items-start gap-3 mt-2">
              <div className="mt-0.5 h-4 w-4 rounded border-2 border-[#0D2D52] bg-[#0D2D52] flex items-center justify-center shrink-0">
                <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5l2 2.5 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-xs text-[#64748B] leading-relaxed">
                I agree to TrustID's{" "}
                <span className="text-[#0D2D52] font-medium underline-offset-2 underline cursor-pointer">Terms of Service</span> and{" "}
                <span className="text-[#0D2D52] font-medium underline-offset-2 underline cursor-pointer">Privacy Policy</span>.
              </p>
            </div>

            <Button type="submit" fullWidth size="lg" className="mt-2">
              Create My TrustID
            </Button>
          </form>

          <p className="text-center text-sm text-[#64748B] mt-6">
            Already have an account?{" "}
            <button onClick={() => navigate("dashboard")} className="text-[#0D2D52] font-semibold hover:underline">
              Sign in
            </button>
          </p>

          <div className="mt-8 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#E2EAF2]" />
            <p className="text-xs text-[#94A3B8]">Secure · Encrypted · Private</p>
            <div className="h-px flex-1 bg-[#E2EAF2]" />
          </div>
          <div className="mt-4 flex justify-center gap-6">
            {["🔐 SSL Encrypted", "🇳🇬 Nigeria · 2026", "🛡 Data Protected"].map((t) => (
              <span key={t} className="text-xs text-[#94A3B8]">{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PersonIcon() {
  return <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="5.5" r="3" /><path d="M2 15c0-3.3 2.7-6 6-6s6 2.7 6 6" strokeLinecap="round" /></svg>;
}
function MailIcon() {
  return <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1.5" y="3.5" width="13" height="9" rx="1.5" /><path d="M1.5 5.5l6.5 4.5 6.5-4.5" /></svg>;
}
function PhoneIcon() {
  return <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 1.5h3l1.5 3.5-2 1c.7 2 2 3.3 4 4l1-2L15 9.5v3c0 1-1 1.5-2 1-6-1-10-5-11-11C1.5 1.5 3 1 4 1.5z" strokeLinejoin="round" /></svg>;
}
function LockIcon() {
  return <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="7" width="10" height="7.5" rx="1.5" /><path d="M5.5 7V5a2.5 2.5 0 015 0v2" strokeLinecap="round" /></svg>;
}
function EyeIcon() {
  return <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 8c1.5-3.5 4-5.5 7-5.5S13.5 4.5 15 8c-1.5 3.5-4 5.5-7 5.5S2.5 11.5 1 8z" /><circle cx="8" cy="8" r="2" /></svg>;
}
function EyeOffIcon() {
  return <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 2l12 12M6.5 6.6A2 2 0 0010 9.5M4 4.4C2.6 5.5 1.7 6.7 1 8c1.5 3.5 4 5.5 7 5.5a7.7 7.7 0 003.6-.9M7 2.6A7.7 7.7 0 0115 8c-.5 1.1-1.2 2.1-2 2.9" strokeLinecap="round" /></svg>;
}
