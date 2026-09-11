import { useState } from "react";
import { Button, Input } from "../components/ui";
import { useAuth } from "../context/AuthContext";

import logoHeroDark from "../assets/logo-hero-dark.png";
import logoNavLight from "../assets/logo-nav-light.png";

interface Props {
  navigate: (s: string) => void;
}

export default function LoginPage({ navigate }: Props) {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const user = await login({
        email: email.trim(),
        password,
      });

      if (!user.onboardingCompleted) {
        navigate("onboarding");
      } else if (!user.consent?.granted) {
        navigate("consent");
      } else {
        navigate("dashboard");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to sign you in."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFB] flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] bg-[#0D2D52] p-10 shrink-0">
        <button
          type="button"
          onClick={() => navigate("landing")}
          className="flex items-center"
        >
          <img
            src={logoHeroDark}
            alt="TrustID — Your Financial Behaviour. Your Credibility."
            className="h-20 w-auto"
          />
        </button>

        <div>
          <p className="text-white/50 text-sm font-medium uppercase tracking-widest mb-6">
            Welcome back
          </p>

          <div className="space-y-5">
            <div className="flex gap-4">
              <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-lg shrink-0">
                🛡
              </div>

              <div>
                <p className="text-white font-semibold text-sm">
                  Your financial story
                </p>

                <p className="text-white/60 text-xs mt-0.5 leading-relaxed">
                  Pick up where you left off and continue building
                  your financial credibility.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-lg shrink-0">
                📈
              </div>

              <div>
                <p className="text-white font-semibold text-sm">
                  Track your progress
                </p>

                <p className="text-white/60 text-xs mt-0.5 leading-relaxed">
                  Understand your TrustID score and discover ways
                  to strengthen your profile.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-lg shrink-0">
                🔒
              </div>

              <div>
                <p className="text-white font-semibold text-sm">
                  Your data, your control
                </p>

                <p className="text-white/60 text-xs mt-0.5 leading-relaxed">
                  Your financial information is analysed only with
                  your consent.
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-white/30 text-xs">
          © 2026 TrustID · Competition Prototype
        </p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md animate-fade-in-up">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <button
              type="button"
              onClick={() => navigate("landing")}
            >
              <img
                src={logoNavLight}
                alt="TrustID"
                className="h-7 w-auto"
              />
            </button>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#0D1F35] tracking-tight mb-1.5">
              Welcome back
            </h1>

            <p className="text-sm text-[#64748B]">
              Sign in to continue to your TrustID profile.
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm text-red-600 leading-relaxed">
                {error}
              </p>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <Input
              label="Email Address"
              type="email"
              placeholder="daniel@email.com"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setError("");
              }}
              autoComplete="email"
              leftIcon={<MailIcon />}
              disabled={loading}
            />

            <Input
              label="Password"
              type={showPass ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setError("");
              }}
              autoComplete="current-password"
              leftIcon={<LockIcon />}
              disabled={loading}
              rightIcon={
                <button
                  type="button"
                  onClick={() =>
                    setShowPass((value) => !value)
                  }
                  className="text-[#94A3B8] hover:text-[#64748B]"
                >
                  {showPass ? (
                    <EyeOffIcon />
                  ) : (
                    <EyeIcon />
                  )}
                </button>
              }
            />

            <div className="flex justify-end">
              <button
                type="button"
                className="text-xs font-semibold text-[#0D2D52] hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              fullWidth
              size="lg"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="text-center text-sm text-[#64748B] mt-6">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("signup")}
              className="text-[#0D2D52] font-semibold hover:underline"
            >
              Create one
            </button>
          </p>

          <div className="mt-8 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#E2EAF2]" />

            <p className="text-xs text-[#94A3B8]">
              Secure · Encrypted · Private
            </p>

            <div className="h-px flex-1 bg-[#E2EAF2]" />
          </div>
        </div>
      </div>
    </div>
  );
}

function MailIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect
        x="1.5"
        y="3.5"
        width="13"
        height="9"
        rx="1.5"
      />

      <path d="M1.5 5.5l6.5 4.5 6.5-4.5" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect
        x="3"
        y="7"
        width="10"
        height="7.5"
        rx="1.5"
      />

      <path
        d="M5.5 7V5a2.5 2.5 0 015 0v2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M1 8c1.5-3.5 4-5.5 7-5.5S13.5 4.5 15 8c-1.5 3.5-4 5.5-7 5.5S2.5 11.5 1 8z" />

      <circle
        cx="8"
        cy="8"
        r="2"
      />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        d="M2 2l12 12M6.5 6.6A2 2 0 0010 9.5M4 4.4C2.6 5.5 1.7 6.7 1 8c1.5 3.5 4 5.5 7 5.5a7.7 7.7 0 003.6-.9M7 2.6A7.7 7.7 0 0115 8c-.5 1.1-1.2 2.1-2 2.9"
        strokeLinecap="round"
      />
    </svg>
  );
}
