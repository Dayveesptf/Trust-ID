import { useEffect, useState } from "react";

import { Button } from "../components/ui";
import logotext from "../assets/logo-nav-dark.png";

import { generateTrustProfile } from "../services/financialProfileService";

interface Props {
  navigate: (screen: string) => void;
}

const stages = [
  {
    id: 1,
    label: "Income consistency",
    duration: 1200,
  },
  {
    id: 2,
    label: "Savings behaviour",
    duration: 1800,
  },
  {
    id: 3,
    label: "Repayment behaviour",
    duration: 2600,
  },
  {
    id: 4,
    label: "Cash-flow stability",
    duration: 3400,
  },
  {
    id: 5,
    label: "Financial discipline",
    duration: 4200,
  },
];

const ANALYSIS_DURATION = 5200;

export default function AnalysisPage({
  navigate,
}: Props) {
  const [elapsed, setElapsed] = useState(0);
  const [done, setDone] = useState(false);

  const [generating, setGenerating] = useState(false);

  const [score, setScore] = useState<number | null>(
    null
  );

  const [band, setBand] = useState("");

  const [error, setError] = useState("");

  /* ------------------------------------------------------------------------ */
  /* Simulated analysis progress                                             */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined;

    const interval = setInterval(() => {
      setElapsed((current) => {
        const next = current + 100;

        if (next >= ANALYSIS_DURATION) {
          clearInterval(interval);

          timeout = setTimeout(() => {
            setDone(true);
          }, 500);

          return ANALYSIS_DURATION;
        }

        return next;
      });
    }, 100);

    return () => {
      clearInterval(interval);

      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, []);

  /* ------------------------------------------------------------------------ */
  /* Generate actual TrustID score                                           */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (!done || generating || score !== null) {
      return;
    }

    let mounted = true;

    const createTrustProfile = async () => {
      setGenerating(true);
      setError("");

      try {
        const response = await generateTrustProfile();

        if (!mounted) {
          return;
        }

        setScore(response.profile.totalScore);
        setBand(response.profile.band);
      } catch (err) {
        if (!mounted) {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "We couldn't generate your Trust Profile."
        );
      } finally {
        if (mounted) {
          setGenerating(false);
        }
      }
    };

    createTrustProfile();

    return () => {
      mounted = false;
    };
  }, [done, generating, score]);

  /* ------------------------------------------------------------------------ */
  /* Retry                                                                    */
  /* ------------------------------------------------------------------------ */

  const handleRetry = () => {
    setElapsed(0);
    setDone(false);
    setGenerating(false);
    setScore(null);
    setBand("");
    setError("");
  };

  /* ------------------------------------------------------------------------ */
  /* Analysis progress                                                        */
  /* ------------------------------------------------------------------------ */

  const completedStages = stages.filter(
    (stage) => elapsed >= stage.duration
  );

  const activeStage = stages.find((stage) => {
    const previousDuration =
      stages.find(
        (item) => item.id === stage.id - 1
      )?.duration ?? 0;

    return (
      elapsed < stage.duration &&
      elapsed >= previousDuration
    );
  });

  const overallPct = Math.min(
    (elapsed / ANALYSIS_DURATION) * 100,
    100
  );

  /* ------------------------------------------------------------------------ */
  /* Render                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <div className="min-h-screen bg-[#0D2D52] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md text-center animate-fade-in">

        {/* Logo */}
        <div className="flex items-center justify-center mb-12">
          <img
            src={logotext}
            alt="TrustID"
            className="h-7 w-auto"
          />
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* COMPLETE                                                           */}
        {/* ---------------------------------------------------------------- */}

        {done ? (
          <div className="animate-fade-in-up">

            {/* Generating score */}
            {generating ? (
              <>
                <div className="h-20 w-20 rounded-full border-4 border-white/10 border-t-[#10B981] animate-spin mx-auto mb-6" />

                <h1 className="text-2xl font-bold text-white mb-3">
                  Calculating your TrustID Score
                </h1>

                <p className="text-white/60 text-sm leading-relaxed">
                  We're combining the five behavioural
                  dimensions into your Trust Profile.
                </p>
              </>
            ) : error ? (
              <>
                {/* Error icon */}
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
                  onClick={handleRetry}
                  size="lg"
                  className="w-full !bg-white !text-[#0D2D52] hover:!bg-white/90"
                >
                  Try Again
                </Button>

                <button
                  type="button"
                  onClick={() => navigate("connect")}
                  className="mt-4 text-sm text-white/50 hover:text-white transition-colors"
                >
                  Back to financial profile
                </button>
              </>
            ) : (
              <>
                {/* Success icon */}
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
                  We've analysed your financial behaviour
                  across five key dimensions. Your TrustID
                  Score has been calculated.
                </p>

                {/* Result cards */}
                <div className="grid grid-cols-3 gap-3 mb-8">
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                    <p className="text-white font-bold text-sm font-['JetBrains_Mono',monospace]">
                      {score ?? 0}/850
                    </p>

                    <p className="text-white/50 text-xs mt-0.5">
                      Overall Score
                    </p>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                    <p className="text-white font-bold text-sm">
                      {band || "—"}
                    </p>

                    <p className="text-white/50 text-xs mt-0.5">
                      Profile Level
                    </p>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                    <p className="text-white font-bold text-sm font-['JetBrains_Mono',monospace]">
                      5/5
                    </p>

                    <p className="text-white/50 text-xs mt-0.5">
                      Factors
                    </p>
                  </div>
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
          /* ---------------------------------------------------------------- */
          /* ANALYSIS IN PROGRESS                                             */
          /* ---------------------------------------------------------------- */

          <div>

            {/* Progress ring */}
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
                  strokeDasharray={`${
                    (overallPct / 100) * 402
                  } 402`}
                  style={{
                    transition:
                      "stroke-dasharray 0.3s ease",
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
              We're analysing your financial behaviour to
              understand your financial strengths and
              opportunities.
            </p>

            {/* Analysis stages */}
            <div className="space-y-3 text-left mb-8">
              {stages.map((stage) => {
                const isComplete =
                  completedStages.some(
                    (completed) =>
                      completed.id === stage.id
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
                          ? "bg-[#10B981]"
                          : isActive
                          ? "border-2 border-[#10B981]"
                          : "border border-white/20"
                      }`}
                    >
                      {isComplete ? (
                        <svg
                          className="h-3.5 w-3.5 text-white"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path
                            d="M3 8l3 3 7-7"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      ) : isActive ? (
                        <div className="h-2 w-2 rounded-full bg-[#10B981] animate-pulse" />
                      ) : (
                        <span className="text-[10px] text-white/30">
                          {stage.id}
                        </span>
                      )}
                    </div>

                    <p
                      className={`text-sm font-medium ${
                        isComplete
                          ? "text-white"
                          : isActive
                          ? "text-white"
                          : "text-white/40"
                      }`}
                    >
                      {stage.label}
                    </p>

                    {isComplete && (
                      <span className="ml-auto text-xs text-emerald-300">
                        Complete
                      </span>
                    )}

                    {isActive && (
                      <span className="ml-auto text-xs text-white/50">
                        Analysing…
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <p className="text-white/30 text-xs">
              This is a simulated analysis for the
              competition prototype.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}