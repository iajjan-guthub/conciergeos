import { cn } from "@/lib/utils";

export function Logo({ className, showText = true }: { className?: string; showText?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2", className)} data-testid="logo-conciergeos">
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="ConciergeOS logo"
        className="flex-shrink-0"
      >
        <rect width="32" height="32" rx="7" className="fill-[hsl(var(--sidebar))]" />
        <path
          d="M8 18l8-7 8 7v6a2 2 0 01-2 2h-3v-5h-6v5h-3a2 2 0 01-2-2v-6z"
          fill="hsl(173 80% 45%)"
        />
        <circle cx="16" cy="10" r="2.5" fill="hsl(173 80% 45%)" />
        <path d="M16 12.5v-2M13.5 10h-2M20.5 10h-2" stroke="hsl(173 80% 45%)" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
      {showText && (
        <span className="font-semibold text-base tracking-tight">
          Concierge<span className="text-primary">OS</span>
        </span>
      )}
    </div>
  );
}
