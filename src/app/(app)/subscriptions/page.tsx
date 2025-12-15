import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { deleteSubscription } from "./actions";

export default async function SubscriptionsPage() {
  const user = await requireUser();

  // Dynamically infer the Subscription type using PrismaClient
  const subscriptions = await prisma.subscription.findMany({
    where: { userId: user.userId },
    orderBy: [{ nextPaymentDate: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Subscriptions</h1>
          <p className="mt-1 text-sm text-zinc-600">Manage your services and payments.</p>
        </div>
        <Link
          href="/subscriptions/new"
          className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white"
        >
          Add
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
        {subscriptions.length === 0 ? (
          <div className="p-4 text-sm text-zinc-600">No subscriptions yet.</div>
        ) : (
          <ul className="divide-y divide-zinc-200">
            {subscriptions.map((s) => {
              const deleteAction = deleteSubscription.bind(null, s.id);
              return (
                <li key={s.id} className="flex items-center justify-between gap-3 px-4 py-3">
                  <div className="min-w-0">
                    <Link href={`/subscriptions/${s.id}`} className="block truncate text-sm font-medium hover:underline">
                      {s.name}
                    </Link>
                    <div className="mt-0.5 text-xs text-zinc-600">
                      {s.provider ? `${s.provider} · ` : ""}
                      {(s.priceCents / 100).toFixed(2)} {s.currency} · {s.billingCycle}
                      {s.nextPaymentDate ? ` · Next: ${new Date(s.nextPaymentDate).toLocaleDateString()}` : ""}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/subscriptions/${s.id}/edit`}
                      className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium"
                    >
                      Edit
                    </Link>
                    <form action={deleteAction}>
                      <button className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium">
                        Delete
                      </button>
                    </form>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}