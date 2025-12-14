import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { PaymentsCalendar } from "./PaymentsCalendar";

type CalendarItem = { name: string; nextPaymentDate: Date | null };
type CalendarEvent = { title: string; start: Date; end: Date };

function formatMoney(amountCents: number, currency: string) {
  const amount = amountCents / 100;
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
}

export default async function DashboardPage() {
  const user = await requireUser();

  const [count, upcoming, allForTotals, calendarItems] = await Promise.all([
    prisma.subscription.count({ where: { userId: user.userId } }),
    prisma.subscription.findMany({
      where: { userId: user.userId, nextPaymentDate: { not: null } },
      orderBy: { nextPaymentDate: "asc" },
      take: 5,
    }),
    prisma.subscription.findMany({
      where: { userId: user.userId },
      select: { priceCents: true, billingCycle: true, currency: true },
    }),
    prisma.subscription.findMany({
      where: { userId: user.userId, nextPaymentDate: { not: null } },
      select: { name: true, nextPaymentDate: true },
      orderBy: { nextPaymentDate: "asc" },
      take: 200,
    }),
  ]);

  const totalsByCurrency = new Map<string, number>();
  for (const s of allForTotals) {
    const monthlyCents = s.billingCycle === "yearly" ? Math.round(s.priceCents / 12) : s.priceCents;
    totalsByCurrency.set(s.currency, (totalsByCurrency.get(s.currency) ?? 0) + monthlyCents);
  }

  const currencies = Array.from(totalsByCurrency.keys()).sort();
  const primaryCurrency = currencies[0] ?? "USD";
  const monthlyTotalPrimary = totalsByCurrency.get(primaryCurrency) ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <p className="mt-1 text-sm text-zinc-600">You have {count} subscriptions.</p>
        </div>
        <Link
          href="/subscriptions/new"
          className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white"
        >
          Add subscription
        </Link>
      </div>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-zinc-200 bg-white p-4">
          <div className="text-xs font-medium text-zinc-600">Total subscriptions</div>
          <div className="mt-2 text-2xl font-semibold">{count}</div>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-4">
          <div className="text-xs font-medium text-zinc-600">Total amount / month</div>
          <div className="mt-2 text-2xl font-semibold">{formatMoney(monthlyTotalPrimary, primaryCurrency)}</div>
          {currencies.length > 1 ? (
            <div className="mt-1 text-xs text-zinc-600">Multiple currencies detected.</div>
          ) : null}
        </div>
      </section>

      <section className="grid gap-4">
        <PaymentsCalendar
          events={calendarItems
            .map((item: CalendarItem) => {
              if (!item.nextPaymentDate) return null;
              return {
                title: item.name,
                start: item.nextPaymentDate,
                end: item.nextPaymentDate,
              } satisfies CalendarEvent;
            })
            .filter((event): event is CalendarEvent => event !== null)}
        />

        <div className="rounded-lg border border-zinc-200 bg-white">
          <div className="border-b border-zinc-200 px-4 py-3">
            <h2 className="text-sm font-semibold">Upcoming payments</h2>
          </div>
          <div className="p-4">
            {upcoming.length === 0 ? (
              <p className="text-sm text-zinc-600">No upcoming payments yet.</p>
            ) : (
              <ul className="space-y-2">
                {upcoming.map((s) => (
                  <li
                    key={s.id}
                    className="flex items-center justify-between rounded-md border border-zinc-200 px-3 py-2"
                  >
                    <div>
                      <Link href={`/subscriptions/${s.id}`} className="text-sm font-medium hover:underline">
                        {s.name}
                      </Link>
                      <div className="text-xs text-zinc-600">
                        {s.nextPaymentDate ? new Date(s.nextPaymentDate).toLocaleDateString() : "—"}
                      </div>
                    </div>
                    <div className="text-sm font-medium">{formatMoney(s.priceCents, s.currency)}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      <div className="text-sm">
        <Link href="/subscriptions" className="underline">
          View all subscriptions
        </Link>
      </div>
    </div>
  );
}
