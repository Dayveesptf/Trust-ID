import { useState } from "react";
import { Button, RadioOption } from "../components/ui";
import logotext from "../assets/logo-nav-light.png"


interface Props { navigate: (s: string) => void; }

const steps = [
  {
    step: 1,
    title: "What is your primary source of income?",
    subtitle: "This helps us understand your income pattern and regularity.",
    field: "income",
    options: ["Salary", "Business", "Freelancing", "Contract Work", "Other"],
  },
  {
    step: 2,
    title: "How frequently do you receive income?",
    subtitle: "Knowing your payment cycle helps us interpret your cash-flow behaviour accurately.",
    field: "frequency",
    options: ["Daily", "Weekly", "Monthly", "Irregularly"],
  },
  {
    step: 3,
    title: "What are your financial goals?",
    subtitle: "Your goals help us tailor recommendations to what matters most to you.",
    field: "goals",
    options: [
      "Save more",
      "Manage spending",
      "Build financial credibility",
      "Access financial products",
      "Improve financial discipline",
    ],
    multi: true,
  },
];

export default function OnboardingPage({ navigate }: Props) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({
    income: "",
    frequency: "",
    goals: [],
  });

  const current = steps[step];
  const value = answers[current.field];
  const isMulti = current.multi;

  const canAdvance = isMulti
    ? (value as string[]).length > 0
    : (value as string).length > 0;

  const select = (opt: string) => {
    if (isMulti) {
      const arr = value as string[];
      setAnswers((a) => ({
        ...a,
        [current.field]: arr.includes(opt) ? arr.filter((x) => x !== opt) : [...arr, opt],
      }));
    } else {
      setAnswers((a) => ({ ...a, [current.field]: opt }));
    }
  };

  const next = () => {
    if (step < steps.length - 1) setStep((s) => s + 1);
    else navigate("consent");
  };

  const progressPct = ((step + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-[#F8FAFB] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <img src={logotext} alt="TrustID" className="h-7 w-auto" />
          </div>
          <span className="text-xs font-semibold text-[#64748B] bg-white border border-[#E2EAF2] px-3 py-1.5 rounded-full">
            Step {step + 1} of {steps.length}
          </span>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="h-1.5 w-full bg-[#E2EAF2] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#0D2D52] rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="flex mt-3 gap-2">
            {steps.map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full transition-colors ${i <= step ? "bg-[#0D2D52]" : "bg-[#E2EAF2]"}`} />
                {i < steps.length - 1 && <div className="h-px w-6 bg-[#E2EAF2]" />}
              </div>
            ))}
          </div>
        </div>

        {/* Question card */}
        <div className="bg-white rounded-2xl border border-[#E2EAF2] p-7 shadow-sm mb-6 animate-fade-in-up">
          <div className="h-10 w-10 rounded-xl bg-[#EFF4F9] flex items-center justify-center mb-5">
            <span className="text-[#0D2D52] font-bold text-sm font-['JetBrains_Mono',monospace]">0{step + 1}</span>
          </div>
          <h2 className="text-xl font-bold text-[#0D1F35] mb-2 tracking-tight">{current.title}</h2>
          <p className="text-sm text-[#64748B] mb-6 leading-relaxed">{current.subtitle}</p>

          {isMulti && (
            <p className="text-xs text-[#94A3B8] mb-3 font-medium">Select all that apply</p>
          )}

          <div className="flex flex-col gap-2.5">
            {current.options.map((opt) => {
              const selected = isMulti
                ? (value as string[]).includes(opt)
                : value === opt;
              return (
                <button
                  key={opt}
                  onClick={() => select(opt)}
                  className={`
                    w-full text-left px-4 py-3.5 rounded-xl border-2 transition-all duration-150 text-sm font-medium flex items-center gap-3
                    ${selected
                      ? "border-[#0D2D52] bg-[#EFF4F9] text-[#0D2D52]"
                      : "border-[#E2EAF2] bg-[#F8FAFB] text-[#374151] hover:border-[#A9C0DC] hover:bg-white"}
                  `}
                >
                  <div className={`h-5 w-5 rounded-${isMulti ? "md" : "full"} border-2 flex items-center justify-center shrink-0 transition-all ${selected ? "border-[#0D2D52] bg-[#0D2D52]" : "border-[#CBD5E1]"}`}>
                    {selected && (
                      <svg className="w-3 h-3 text-white" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5l2 2.5 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-3">
          {step > 0 && (
            <Button variant="secondary" onClick={() => setStep((s) => s - 1)} className="flex-1">
              Back
            </Button>
          )}
          <Button onClick={next} disabled={!canAdvance} className={step > 0 ? "flex-1" : "w-full"} size="lg">
            {step < steps.length - 1 ? "Continue" : "Finish Setup →"}
          </Button>
        </div>

        <p className="text-center text-xs text-[#94A3B8] mt-4">
          Your answers help personalise your experience. They don't affect your score.
        </p>
      </div>
    </div>
  );
}
