import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "solid" | "outline" | "ghost";
};

export function Button({ variant = "solid", className, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center rounded-md px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none",
        variant === "solid" &&
          "bg-[var(--color-oak)] text-white hover:bg-[var(--color-oak-dark)]",
        variant === "outline" &&
          "border border-[var(--color-rule)] text-[var(--color-ink)] hover:border-[var(--color-oak)]",
        variant === "ghost" &&
          "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]",
        className
      )}
      {...props}
    />
  );
}
