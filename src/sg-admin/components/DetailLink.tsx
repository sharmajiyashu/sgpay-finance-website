import Link from "next/link";
import { IconArrowRight } from "@tabler/icons-react";
import { twMerge } from "tailwind-merge";
import { agentDetailHref, teamDetailHref } from "@/sg-admin/lib/team-utils";

export { agentDetailHref, teamDetailHref };

export function DetailLink({
  href,
  className,
}: {
  href: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={twMerge(
        "inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90",
        className
      )}
    >
      Detail
      <IconArrowRight className="h-3.5 w-3.5" />
    </Link>
  );
}
