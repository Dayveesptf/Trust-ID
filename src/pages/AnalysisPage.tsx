import { useState, useEffect } from "react";
import { Button } from "../components/ui";
import logotext from "../assets/logo-nav-dark.png";
import { generateTrustProfile } from "../services/financialProfileService";

interface Props {
  navigate: (s: string) => void;
}

const stages = [
  { id: 1, label: "Income consistency", duration: 1200 },
  { id: 2, label: "Savings behaviour", duration: 1800 },
  { id: 3, label: "Repayment behaviour", duration: 2600 },
  { id: 4, label: "Cash-flow stability", duration: 3400 },
  { id: 5, label: "Financial discipline", duration: 4200 },
];

export default function AnalysisPage({ navigate }: Props) {
  const [elapsed, setElapsed] = useState(0);
  const [done, setDone] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [band, setBand] = useState<string>("");
  const [error, setError] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed((current) => {
        const next = current + 100;

        if (next >= 5500) {
          clearInterval(interval);

          setTimeout(() => {
            setDone(true);
          }, 600);

          return 5500;
        }

        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!done || score !== null || generating) return;

    const createProfile = async () => {
      setGenerating(true);
      setError("");

      try {
        const response = await generateTrustProfile();

        setScore(response.profile.totalScore);
        setBand(response.profile.band);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "We couldn't generate your Trust Profile."
        );
      } finally {
        setGenerating(false);
      }
    };

    createProfile();
  }, [done, score, generating]);

  const completedStages = stages.filter(
    (stage) => elapsed >= stage.duration
  );

  const activeStage = stages.find((stage) => {
    const previousDuration =
      stages.find((item) => item.id === stage.id - 1)?.duration ?? 0;

    return (
      elapsed < stage.duration &&
      elapsed >= previousDuration
    );
  });

  const overallPct = Math.min((elapsed / 5200) * 100, 100);

  return (
    <div className="min-h-screen bg-[#0D2D52] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md text-center animate-fade-in">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-12">
          <img
            src={logotext}
            alt="TrustID"
            className="h-7 w-auto"
          />
        </div>

        {done ? (
          /* Completion state */
          <div className="animate-fade-in-up">
            {generating ? (
              <>
                <div className="h-20 w-20 rounded-full border-4 border-white/10 border-t-[#10B981] animate-spin mx-auto mb-6" />

                <h1 className="text-2xl font-bold text-white mb-3">
                  Calculating your TrustID Score
                </h1>

                <p className="text-white/60 text-sm leading-relaxed">
                  We're combining the five behavioural dimensions into your
                  Trust Profile.
                </p>
              </>
            ) : error ? (
              <>
                <div className="h-20 w-20 rounded-full bg-red-500/10 border border-red-400/20 flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="h-9 w-9 text-red-300"
                    viewBox="0 0 40 40"
                    fill="none"
                  >
                    <path
                      d="M20 11v11M20 27v2"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <circle
                      cx="20"
                      cy="20"
                      r="15"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                </div>

                <h1 className="text-2xl font-bold text-white mb-3">
                  We couldn't complete your analysis.
                </h1>

                <p className="text-white/60 text-sm mb-8 leading-relaxed">
                  {error}
                </p>

                <Button
                  onClick={() => navigate("connect")}
                  size="lg"
                  className="w-full !bg-white !text-[#0D2D52] hover:!bg-white/90"
                >
                  Try Again →
                </Button>
              </>
            ) : (
              <>
                <div className="h-20 w-20 rounded-full bg-[#10B981] flex items-center justify-center mx-auto mb-6 animate-check-in">
                  <svg
                    className="h-10 w-10 text-white"
                    viewBox="0 0 40 40"
                    fill="none"
                  >
                    <path
                      d="M10 20l8 9 14-16"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <h1 className="text-2xl font-bold text-white mb-3">
                  Your Trust Profile is ready.
                </h1>

                <p className="text-white/60 text-sm mb-8 leading-relaxed">
                  We've analysed 7 months of financial behaviour across five
                  key dimensions. Your TrustID Score has been calculated.
                </p>

                <div className="grid grid-cols-3 gap-3 mb-8">
                  {[
                    {
                      label: "Overall Score",
                      value: `${score ?? 0}/850`,
                    },
                    {
                      label: "Profile Level",
                      value: band || "—",
                    },
                    {
                      label: "Factors",
                      value: "5/5",
                    },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="bg-white/5 border border-white/10 rounded-xl p-3"
                    >
                      <p className="text-white font-bold text-sm font-['JetBrains_Mono',monospace]">
                        {value}
                      </p>

                      <p className="text-white/50 text-xs mt-0.5">
                        {label}
                      </p>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={() => navigate("dashboard")}
                  size="lg"
                  className="w-full !bg-white !text-[#0D2D52] hover:!bg-white/90"
                >
                  View My Trust Profile →
                </Button>
              </>
            )}
          </div>
        ) : (
          /* Analysis in progress */
          <div>
            {/* Score ring placeholder */}
            <div className="relative h-40 w-40 mx-auto mb-10">
              <svg
                viewBox="0 0 160 160"
                className="w-full h-full -rotate-90"
              >
                <circle
                  cx="80"
                  cy="80"
                  r="64"
                  fill="none"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="10"
                />

                <circle
                  cx="80"
                  cy="80"
                  r="64"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${(overallPct / 100) * 402} 402`}
                  style={{
                    transition: "stroke-dasharray 0.3s ease",
                  }}
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-3xl font-bold text-white font-['JetBrains_Mono',monospace]">
                  {Math.round(overallPct)}%
                </p>

                <p className="text-white/50 text-xs mt-1">
                  complete
                </p>
              </div>
            </div>

            <h1 className="text-2xl font-bold text-white mb-2">
              Building Your Trust Profile
            </h1>

            <p className="text-white/60 text-sm mb-10 leading-relaxed max-w-sm mx-auto">
              We're analysing your financial behaviour to understand your
              financial strengths and opportunities.
            </p>

            {/* Stages */}
            <div className="space-y-3 text-left mb-8">
              {stages.map((stage) => {
                const isComplete = completedStages.some(
                  (completed) => completed.id === stage.id
                );

                const isActive =
                  activeStage?.id === stage.id;

                return (
                  <div
                    key={stage.id}
                    className={`flex items-center gap-4 px-4 py-3 rounded-xl border transition-all duration-500 ${
                      isComplete
                        ? "border-emerald-500/30 bg-emerald-500/10"
                        : isActive
                        ? "border-white/20 bg-white/10"
                        : "border-white/5 bg-white/5"
                    }`}
                  >
                    <div
                      className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                        isComplete
                          ? "bg-[#10B981] animate-check-in"
                          : isActive
                          ? "bg-white/20 animate-pulse-slow"
                          : "bg-white/10"
                      }`}
                    >
                      {isComplete ? (
                        <svg
                          className="h-4 w-4 text-white"
                          viewBox="0 0 14 14"
                          fill="none"
                        >
                          <path
                            d="M2.5 7l3 3.5 6-6"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      ) : isActive ? (
                        <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
                      ) : (
                        <div className="h-2 w-2 rounded-full bg-white/20" />
                      )}
                    </div>

                    <span
                      className={`text-sm font-medium ${
                        isComplete
                          ? "text-white"
                          : isActive
                          ? "text-white"
                          : "text-white/40"
                      }`}
                    >
                      {stage.label.charAt(0).toUpperCase() +
                        stage.label.slice(1)}
                    </span>

                    {isActive && (
                      <span className="ml-auto text-xs text-white/40 animate-pulse-slow">
                        Analysing…
                      </span>
                    )}

                    {isComplete && (
                      <span className="ml-auto text-xs text-emerald-400 font-semibold">
                        Done
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Overall progress bar */}
            <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#10B981] rounded-full transition-all duration-300"
                style={{ width: `${overallPct}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}