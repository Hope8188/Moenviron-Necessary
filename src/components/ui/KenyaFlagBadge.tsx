import kenyaFlag from "@/assets/kenya-flag.svg";
import { cn } from "@/lib/utils";

export function KenyaFlagBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-4 w-4 items-center justify-center overflow-hidden rounded-full border border-border bg-background shadow-sm",
        className
      )}
      aria-hidden="true"
    >
      <img src={kenyaFlag} alt="" className="h-full w-full" loading="lazy" />
    </span>
  );
}
