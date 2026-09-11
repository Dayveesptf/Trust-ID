import { ReactNode, useState } from "react";
import { Avatar } from "./ui";
import { useAuth } from "../context/AuthContext";
import logotext from "../assets/logo-nav-light.png";

type NavProps = {
  current: string;
  navigate: (
    screen: string,
    params?: { customerId?: string }
  ) => void;
};

const customerNav = [
  {
    id: "dashboard",
    label: "Overview",
    icon: HomeIcon,
  },
  {
    id: "score-explanation",
    label: "My Trust Profile",
    icon: ShieldIcon,
  },
  {
    id: "financial-growth",
    label: "Financial Growth",
    icon: TrendIcon,
  },
  {
    id: "score-history",
    label: "Score History",
    icon: ChartIcon,
  },
  {
    id: "opportunity",
    label: "Opportunities",
    icon: StarIcon,
  },
];

const bankNav = [
  {
    id: "customer-overview",
    label: "Customer Insights",
    icon: UsersIcon,
  },
];

// ─────────────────────────────────────────────────────────────
// Customer Sidebar
// ─────────────────────────────────────────────────────────────

export function CustomerSidebar({
  current,
  navigate,
}: NavProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    setMenuOpen(false);
    navigate("landing");
  }

  const initials =
    user?.firstName && user?.lastName
      ? `${user.firstName[0]}${user.lastName[0]}`
      : "U";

  const displayName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : "TrustID User";

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 shrink-0 bg-white border-r border-[#E2EAF2] min-h-screen">
        <div className="px-6 py-5 border-b border-[#E2EAF2]">
          <button
            type="button"
            onClick={() => navigate("landing")}
            className="flex items-center gap-2.5 group"
          >
            <img
              src={logotext}
              alt="TrustID"
              className="h-8 w-auto"
            />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
          {customerNav.map(
            ({ id, label, icon: Icon }) => {
              const active = current === id;

              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => navigate(id)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5
                    rounded-xl text-sm font-medium transition-all
                    duration-150 text-left
                    ${
                      active
                        ? "bg-[#EFF4F9] text-[#0D2D52] font-semibold"
                        : "text-[#64748B] hover:text-[#0D2D52] hover:bg-[#F8FAFB]"
                    }
                  `}
                >
                  <Icon
                    className={`
                      h-4 w-4 shrink-0
                      ${
                        active
                          ? "text-[#0D2D52]"
                          : "text-[#94A3B8]"
                      }
                    `}
                  />

                  {label}

                  {active && (
                    <div className="ml-auto h-1.5 w-1.5 rounded-full bg-[#0D2D52]" />
                  )}
                </button>
              );
            }
          )}
        </nav>

        <div className="p-4 border-t border-[#E2EAF2]">
          <button
            type="button"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#64748B] hover:text-[#0D2D52] hover:bg-[#F8FAFB] transition-all"
          >
            <SettingsIcon className="h-4 w-4 text-[#94A3B8]" />
            Settings
          </button>

          <div className="mt-3 flex items-center gap-3 px-3 py-2">
            <Avatar
              initials={initials}
              size="sm"
            />

            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#0D1F35] truncate">
                {displayName}
              </p>

              <p className="text-xs text-[#94A3B8] truncate">
                TrustID Customer
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-3 w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-50 transition-all"
          >
            <LogoutIcon className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-[#E2EAF2] px-4 h-14 flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate("landing")}
          className="flex items-center gap-2"
        >
          <img
            src={logotext}
            alt="TrustID"
            className="h-7 w-auto"
          />
        </button>

        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 rounded-lg hover:bg-[#F8FAFB]"
        >
          <MenuIcon className="h-5 w-5 text-[#0D2D52]" />
        </button>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden fixed top-14 left-0 right-0 z-30 bg-white border-b border-[#E2EAF2] shadow-lg animate-fade-in">
          <nav className="p-3 flex flex-col gap-0.5">
            {customerNav.map(
              ({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    navigate(id);
                    setMenuOpen(false);
                  }}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-xl
                    text-sm font-medium transition-all
                    ${
                      current === id
                        ? "bg-[#EFF4F9] text-[#0D2D52] font-semibold"
                        : "text-[#64748B] hover:bg-[#F8FAFB]"
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              )
            )}

            <button
              type="button"
              onClick={handleLogout}
              className="mt-2 flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
            >
              <LogoutIcon className="h-4 w-4" />
              Logout
            </button>
          </nav>
        </div>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// Bank Sidebar
// ─────────────────────────────────────────────────────────────

export function BankSidebar({
  current,
  navigate,
}: NavProps) {
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    navigate("landing");
  }

  const initials =
    user?.firstName && user?.lastName
      ? `${user.firstName[0]}${user.lastName[0]}`
      : "AO";

  const displayName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : "Ecobank Analyst";

  return (
    <aside className="hidden lg:flex flex-col w-60 shrink-0 bg-[#0D2D52] min-h-screen">
      {/* Logo / Home */}
      <div className="px-6 py-5 border-b border-[#163D6A]">
        <button
          type="button"
          onClick={() => navigate("landing")}
          className="flex items-center gap-3 w-full text-left group"
        >
          <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition">
            <span className="text-white text-xs font-bold">
              E
            </span>
          </div>

          <div>
            <p className="font-bold text-white text-sm tracking-tight">
              Ecobank
            </p>

            <p className="text-[#7EA8D4] text-xs">
              TrustID Platform
            </p>
          </div>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
        {/* Home */}
        <button
          type="button"
          onClick={() => navigate("landing")}
          className={`
            w-full flex items-center gap-3 px-3 py-2.5
            rounded-xl text-sm font-medium transition-all
            text-left mb-2
            ${
              current === "landing"
                ? "bg-white/10 text-white"
                : "text-[#7EA8D4] hover:text-white hover:bg-white/5"
            }
          `}
        >
          <HomeIcon className="h-4 w-4 shrink-0" />
          Home
        </button>

        <div className="h-px bg-[#163D6A] mb-2" />

        {bankNav.map(
          ({ id, label, icon: Icon }) => {
            const active = current === id;

            return (
              <button
                key={id}
                type="button"
                onClick={() => navigate(id)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5
                  rounded-xl text-sm font-medium transition-all
                  duration-150 text-left
                  ${
                    active
                      ? "bg-white/10 text-white"
                      : "text-[#7EA8D4] hover:text-white hover:bg-white/5"
                  }
                `}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </button>
            );
          }
        )}
      </nav>

      {/* User / Logout */}
      <div className="p-4 border-t border-[#163D6A]">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-semibold text-white">
            {initials}
          </div>

          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              {displayName}
            </p>

            <p className="text-xs text-[#7EA8D4] truncate">
              Credit Analyst
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-3 w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#9DB9D5] hover:text-white hover:bg-white/10 transition-all"
        >
          <LogoutIcon className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}

// ─────────────────────────────────────────────────────────────
// Customer Layout
// ─────────────────────────────────────────────────────────────

export function CustomerLayout({
  children,
  current,
  navigate,
}: NavProps & { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#F8FAFB]">
      <CustomerSidebar
        current={current}
        navigate={navigate}
      />

      <main className="flex-1 min-w-0 pt-14 lg:pt-0">
        {children}
      </main>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Bank Layout
// ─────────────────────────────────────────────────────────────

export function BankLayout({
  children,
  current,
  navigate,
}: NavProps & { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#F0F4F9]">
      <BankSidebar
        current={current}
        navigate={navigate}
      />

      <main className="flex-1 min-w-0">
        {children}
      </main>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Icons
// ─────────────────────────────────────────────────────────────

function HomeIcon({
  className,
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        d="M2 6.5L8 2l6 4.5V14H2V6.5z"
        strokeLinejoin="round"
      />
      <path
        d="M5.5 14v-4h5v4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ShieldIcon({
  className,
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        d="M8 1.5L2 4v4c0 3.3 2.6 5.7 6 6 3.4-.3 6-2.7 6-6V4L8 1.5z"
        strokeLinejoin="round"
      />
      <path
        d="M5.5 8l2 2 3-3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TrendIcon({
  className,
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        d="M2 12l4-4 3 3 5-5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11 6h3v3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChartIcon({
  className,
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect
        x="2"
        y="9"
        width="3"
        height="5"
        rx="0.5"
      />

      <rect
        x="6.5"
        y="6"
        width="3"
        height="8"
        rx="0.5"
      />

      <rect
        x="11"
        y="3"
        width="3"
        height="11"
        rx="0.5"
      />
    </svg>
  );
}

function StarIcon({
  className,
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        d="M8 1.5l1.8 3.7 4.2.6-3 2.9.7 4.1L8 10.7l-3.7 2.1.7-4.1-3-2.9 4.2-.6L8 1.5z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SettingsIcon({
  className,
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="8" cy="8" r="2" />

      <path
        d="M8 1v2M8 13v2M1 8h2M13 8h2M3.1 3.1l1.4 1.4M11.5 11.5l1.4 1.4M3.1 12.9l1.4-1.4M11.5 4.5l1.4-1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LogoutIcon({
  className,
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        d="M6.5 2H3.5A1.5 1.5 0 002 3.5v9A1.5 1.5 0 003.5 14h3"
        strokeLinecap="round"
      />

      <path
        d="M9 5l3 3-3 3M5.5 8H12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MenuIcon({
  className,
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        d="M3 5h14M3 10h14M3 15h14"
        strokeLinecap="round"
      />
    </svg>
  );
}

function UsersIcon({
  className,
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="6" cy="5" r="2.5" />

      <path
        d="M1 14c0-2.8 2.2-5 5-5s5 2.2 5 5"
        strokeLinecap="round"
      />

      <path
        d="M11 7.5c1.4 0 2.5 1.1 2.5 2.5s-1.1 2.5-2.5 2.5M13 14h2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function UserIcon({
  className,
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="8" cy="5.5" r="3" />

      <path
        d="M2 15c0-3.3 2.7-6 6-6s6 2.7 6 6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DocIcon({
  className,
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect
        x="3"
        y="1"
        width="10"
        height="14"
        rx="1.5"
      />

      <path
        d="M5.5 5.5h5M5.5 8h5M5.5 10.5h3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ClipboardIcon({
  className,
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect
        x="3"
        y="2"
        width="10"
        height="13"
        rx="1.5"
      />

      <path d="M6 2a2 2 0 004 0" />

      <path
        d="M5.5 7.5l2 2 3-3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon({
  className,
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="8" cy="8" r="6.5" />

      <path
        d="M5 8l2 2.5 4-4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
