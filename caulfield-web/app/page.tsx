import Link from "next/link";
import { Users, Hammer, Boxes, Calendar, Receipt } from "lucide-react";
import { Hero } from "@/components/hero";

const modules = [
  {
    href: "/customers",
    icon: Users,
    title: "Customers",
    description: "Contact details and order history for everyone you've built for.",
    ready: true,
  },
  {
    href: "#",
    icon: Hammer,
    title: "Orders",
    description: "Track each commission from inquiry through delivery.",
    ready: false,
  },
  {
    href: "#",
    icon: Boxes,
    title: "Inventory",
    description: "Lumber stock, cost per board foot, and reorder thresholds.",
    ready: false,
  },
  {
    href: "#",
    icon: Calendar,
    title: "Schedule",
    description: "What's on the bench this week, and what's next.",
    ready: false,
  },
  {
    href: "#",
    icon: Receipt,
    title: "Invoicing",
    description: "Deposits, balances due, and payment status per order.",
    ready: false,
  },
];

export default function Home() {
  return (
    <div>
      <Hero />

      {/* Modules */}
      <section
        id="modules"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 fade-in pt-14"
      >
        {modules.map(({ href, icon: Icon, title, description, ready }) => (
          <Link
            key={title}
            href={href}
            className={`group rounded-md border border-[var(--color-rule)] bg-[var(--color-surface)] p-6 transition-all ${
              ready
                ? "hover:border-[var(--color-oak)] hover:shadow-[0_4px_20px_-8px_rgba(43,33,24,0.15)]"
                : "opacity-60 pointer-events-none"
            }`}
          >
            <Icon
              size={20}
              strokeWidth={1.75}
              className="text-[var(--color-oak)] mb-4"
            />
            <h2 className="font-[family-name:var(--font-display)] font-medium text-lg text-[var(--color-ink)] mb-1.5">
              {title}
            </h2>
            <p className="text-sm text-[var(--color-ink-muted)] leading-relaxed">
              {description}
            </p>
            {!ready && (
              <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider text-[var(--color-ink-faint)] mt-4">
                Coming soon
              </p>
            )}
          </Link>
        ))}
      </section>
    </div>
  );
}
