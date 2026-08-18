import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--color-ink)] mb-2">
        Shop dashboard
      </h1>
      <div className="tick-rule mb-8" />
      <p className="text-[var(--color-ink-muted)] max-w-prose">
        Orders, inventory, scheduling, and invoicing will land here as each
        piece comes online. For now,{" "}
        <Link href="/customers" className="text-[var(--color-oak)] underline underline-offset-2">
          manage customers
        </Link>{" "}
        against the live API.
      </p>
    </div>
  );
}
