import { ReactNode, InputHTMLAttributes, SelectHTMLAttributes, useState } from "react";

// ── Button ─────────────────────────────────────────────────────────────────

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit";
  fullWidth?: boolean;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  onClick,
  disabled,
  className = "",
  type = "button",
  fullWidth,
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-[#0D2D52] text-white hover:bg-[#163D6A] active:bg-[#0A2240] focus:ring-[#0D2D52] shadow-sm hover:shadow-md",
    secondary:
      "bg-[#EFF4F9] text-[#0D2D52] hover:bg-[#DDE8F4] active:bg-[#CCD9ED] border border-[#C8D9EC] focus:ring-[#0D2D52]",
    ghost:
      "bg-transparent text-[#0D2D52] hover:bg-[#EFF4F9] active:bg-[#DDE8F4] focus:ring-[#0D2D52]",
    danger:
      "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus:ring-red-500 shadow-sm",
  };

  const sizes = {
    sm: "text-sm px-3.5 py-2 gap-1.5",
    md: "text-sm px-5 py-2.5 gap-2",
    lg: "text-base px-7 py-3.5 gap-2.5",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? "w-full" : ""} ${className}`}
    >
      {children}
    </button>
  );
}

// ── Input ──────────────────────────────────────────────────────────────────

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export function Input({ label, error, hint, leftIcon, rightIcon, className = "", ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-[#0D1F35]">{label}</label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]">
            {leftIcon}
          </div>
        )}
        <input
          {...props}
          className={`
            w-full rounded-xl border border-[#E2EAF2] bg-white px-4 py-3 text-sm text-[#0D1F35]
            placeholder:text-[#94A3B8] transition-colors duration-150
            focus:outline-none focus:ring-2 focus:ring-[#0D2D52] focus:border-transparent
            disabled:bg-[#F8FAFB] disabled:text-[#94A3B8]
            ${error ? "border-red-400 focus:ring-red-400" : ""}
            ${leftIcon ? "pl-10" : ""}
            ${rightIcon ? "pr-10" : ""}
            ${className}
          `}
        />
        {rightIcon && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#64748B]">
            {rightIcon}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="text-xs text-[#64748B]">{hint}</p>}
    </div>
  );
}

// ── Select ─────────────────────────────────────────────────────────────────

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, options, className = "", ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-[#0D1F35]">{label}</label>}
      <select
        {...props}
        className={`
          w-full rounded-xl border border-[#E2EAF2] bg-white px-4 py-3 text-sm text-[#0D1F35]
          focus:outline-none focus:ring-2 focus:ring-[#0D2D52] focus:border-transparent
          appearance-none bg-no-repeat cursor-pointer
          ${className}
        `}
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2364748B' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`, backgroundPosition: "right 14px center" }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

// ── Checkbox ───────────────────────────────────────────────────────────────

interface CheckboxProps {
  label?: ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

export function Checkbox({ label, checked, onChange, className = "" }: CheckboxProps) {
  return (
    <label className={`flex items-start gap-3 cursor-pointer ${className}`}>
      <div
        onClick={() => onChange(!checked)}
        className={`
          mt-0.5 h-5 w-5 flex-shrink-0 rounded-md border-2 transition-all duration-200 flex items-center justify-center
          ${checked ? "bg-[#0D2D52] border-[#0D2D52]" : "bg-white border-[#CBD5E1] hover:border-[#0D2D52]"}
        `}
      >
        {checked && (
          <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      {label && <span className="text-sm text-[#374151] leading-relaxed">{label}</span>}
    </label>
  );
}

// ── Toggle ─────────────────────────────────────────────────────────────────

interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}

export function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <div
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition-colors duration-200 ${checked ? "bg-[#10B981]" : "bg-[#CBD5E1]"}`}
      >
        <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-all duration-200 ${checked ? "left-5" : "left-0.5"}`} />
      </div>
      {label && <span className="text-sm font-medium text-[#374151]">{label}</span>}
    </label>
  );
}

// ── Badge ──────────────────────────────────────────────────────────────────

interface BadgeProps {
  children: ReactNode;
  variant?: "success" | "good" | "fair" | "warning" | "info" | "neutral";
  size?: "sm" | "md";
  className?: string;
}

export function Badge({ children, variant = "neutral", size = "sm", className = "" }: BadgeProps) {
  const variants = {
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    good: "bg-blue-50 text-blue-700 border border-blue-200",
    fair: "bg-amber-50 text-amber-700 border border-amber-200",
    warning: "bg-orange-50 text-orange-700 border border-orange-200",
    info: "bg-[#EFF4F9] text-[#0D2D52] border border-[#C8D9EC]",
    neutral: "bg-gray-100 text-gray-600 border border-gray-200",
  };
  const sizes = {
    sm: "text-xs px-2.5 py-0.5 font-medium rounded-full",
    md: "text-sm px-3 py-1 font-semibold rounded-full",
  };
  return (
    <span className={`inline-flex items-center ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
}

// ── Card ───────────────────────────────────────────────────────────────────

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

export function Card({ children, className = "", onClick, hover, padding = "md" }: CardProps) {
  const pads = { none: "", sm: "p-4", md: "p-5 sm:p-6", lg: "p-7 sm:p-8" };
  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-2xl border border-[#E2EAF2] shadow-sm
        ${hover ? "hover:shadow-md hover:border-[#C8D9EC] transition-all duration-200 cursor-pointer" : ""}
        ${pads[padding]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

// ── Progress Bar ───────────────────────────────────────────────────────────

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  size?: "sm" | "md";
  animated?: boolean;
}

export function ProgressBar({ value, max = 100, color = "#0D2D52", size = "md", animated }: ProgressBarProps) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className={`w-full rounded-full bg-[#E2EAF2] overflow-hidden ${size === "sm" ? "h-1.5" : "h-2.5"}`}>
      <div
        className={`h-full rounded-full transition-all duration-1000 ${animated ? "animate-pulse-slow" : ""}`}
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </div>
  );
}

// ── Score Ring (SVG arc) ───────────────────────────────────────────────────

interface ScoreRingProps {
  score: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}

export function ScoreRing({ score, max, size = 200, strokeWidth = 14, color = "#0D2D52" }: ScoreRingProps) {
  const r = (size - strokeWidth * 2) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const startAngle = -220;
  const totalAngle = 260;
  const pct = score / max;
  const angle = totalAngle * pct;

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleDeg: number) => {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: centerX + radius * Math.cos(rad), y: centerY + radius * Math.sin(rad) };
  };

  const describeArc = (cx: number, cy: number, r: number, startAngle: number, endAngle: number) => {
    const s = polarToCartesian(cx, cy, r, endAngle);
    const e = polarToCartesian(cx, cy, r, startAngle);
    const largeArc = endAngle - startAngle <= 180 ? "0" : "1";
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${largeArc} 0 ${e.x} ${e.y}`;
  };

  const trackPath = describeArc(cx, cy, r, startAngle, startAngle + totalAngle);
  const fillPath = describeArc(cx, cy, r, startAngle, startAngle + angle);

  const levelColor =
    pct >= 0.85 ? "#10B981" : pct >= 0.7 ? "#0D2D52" : pct >= 0.55 ? "#F59E0B" : "#EF4444";

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <path
        d={trackPath}
        fill="none"
        stroke="#E2EAF2"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <path
        d={fillPath}
        fill="none"
        stroke={color || levelColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        style={{ filter: "drop-shadow(0 2px 6px rgba(13,45,82,0.25))" }}
      />
    </svg>
  );
}

// ── Avatar ─────────────────────────────────────────────────────────────────

export function Avatar({ initials, size = "md", color = "#0D2D52" }: { initials: string; size?: "sm" | "md" | "lg"; color?: string }) {
  const sizes = { sm: "h-8 w-8 text-xs", md: "h-10 w-10 text-sm", lg: "h-12 w-12 text-base" };
  return (
    <div
      className={`flex items-center justify-center rounded-full font-semibold text-white ${sizes[size]}`}
      style={{ backgroundColor: color }}
    >
      {initials}
    </div>
  );
}

// ── Toast ──────────────────────────────────────────────────────────────────

export function Toast({ message, type = "success" }: { message: string; type?: "success" | "error" | "info" }) {
  const colors = {
    success: "bg-emerald-50 border-emerald-200 text-emerald-800",
    error: "bg-red-50 border-red-200 text-red-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  };
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border px-4 py-3 shadow-lg animate-fade-in ${colors[type]}`}>
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
}

// ── Section Heading ────────────────────────────────────────────────────────

export function SectionHeading({ title, subtitle, className = "" }: { title: string; subtitle?: string; className?: string }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <h2 className="text-xl font-bold text-[#0D1F35] tracking-tight">{title}</h2>
      {subtitle && <p className="text-sm text-[#64748B]">{subtitle}</p>}
    </div>
  );
}

// ── Divider ────────────────────────────────────────────────────────────────

export function Divider({ className = "" }: { className?: string }) {
  return <div className={`h-px bg-[#E2EAF2] ${className}`} />;
}

// ── Stat Card ─────────────────────────────────────────────────────────────

export function StatCard({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <Card className="flex flex-col gap-1">
      <p className="text-xs font-medium text-[#64748B] uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-bold" style={{ color: color || "#0D1F35" }}>{value}</p>
      {sub && <p className="text-xs text-[#94A3B8]">{sub}</p>}
    </Card>
  );
}

// ── Radio Option ──────────────────────────────────────────────────────────

interface RadioOptionProps {
  label: string;
  value: string;
  selected: boolean;
  onSelect: (v: string) => void;
}

export function RadioOption({ label, value, selected, onSelect }: RadioOptionProps) {
  return (
    <button
      onClick={() => onSelect(value)}
      className={`
        w-full text-left px-4 py-3.5 rounded-xl border-2 transition-all duration-200 text-sm font-medium
        ${selected
          ? "border-[#0D2D52] bg-[#EFF4F9] text-[#0D2D52]"
          : "border-[#E2EAF2] bg-white text-[#374151] hover:border-[#A9C0DC] hover:bg-[#F8FAFB]"}
      `}
    >
      <div className="flex items-center gap-3">
        <div className={`h-4 w-4 rounded-full border-2 flex-shrink-0 transition-all ${selected ? "border-[#0D2D52] bg-[#0D2D52]" : "border-[#CBD5E1]"}`}>
          {selected && <div className="h-2 w-2 rounded-full bg-white m-auto mt-0.5" />}
        </div>
        {label}
      </div>
    </button>
  );
}

// ── Factor Level helpers ──────────────────────────────────────────────────

export function getLevelVariant(level: string): BadgeProps["variant"] {
  if (level === "Excellent") return "success";
  if (level === "Strong") return "good";
  if (level === "Good") return "info";
  if (level === "Fair") return "fair";
  return "neutral";
}

export function getLevelColor(score: number): string {
  if (score >= 90) return "#10B981";
  if (score >= 75) return "#0D2D52";
  if (score >= 60) return "#F59E0B";
  return "#EF4444";
}

export function getScoreLevelColor(score: number): string {
  if (score >= 720) return "#10B981";
  if (score >= 650) return "#0D2D52";
  if (score >= 550) return "#F59E0B";
  return "#EF4444";
}

export function getScoreLevel(score: number): string {
  if (score >= 720) return "Strong";
  if (score >= 650) return "Good";
  if (score >= 550) return "Fair";
  return "Developing";
}

export function getScoreBadgeVariant(score: number): BadgeProps["variant"] {
  if (score >= 720) return "success";
  if (score >= 650) return "good";
  if (score >= 550) return "fair";
  return "warning";
}

// ── Disclosure ─────────────────────────────────────────────────────────────

export function useDisclosure(initial = false) {
  const [open, setOpen] = useState(initial);
  return { open, toggle: () => setOpen((v) => !v), close: () => setOpen(false), openIt: () => setOpen(true) };
}
