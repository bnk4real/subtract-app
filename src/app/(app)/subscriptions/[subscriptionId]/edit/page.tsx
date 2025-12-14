import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { updateSubscription } from "../../actions";

type Props = {
  params: Promise<{ subscriptionId: string }>;
  searchParams?: Promise<{
    error?: string;
  }>;
};

export default async function EditSubscriptionPage({ params, searchParams }: Props) {
  const { subscriptionId: id } = await params;
  const sp = (await searchParams) ?? {};
  const error = sp.error;
  const user = await requireUser();

  const subscription = await prisma.subscription.findFirst({
    where: { id, userId: user.userId },
  });

  if (!subscription) notFound();

  const updateAction = updateSubscription.bind(null, subscription.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Edit subscription</h1>
          <p className="mt-1 text-sm text-zinc-600">Update details for {subscription.name}.</p>
        </div>
        <Link href={`/subscriptions/${subscription.id}`} className="text-sm underline">
          Cancel
        </Link>
      </div>

      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
      ) : null}

      <form action={updateAction} className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium">Name</label>
            <input
              name="name"
              required
              defaultValue={subscription.name}
              className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Provider</label>
            <input
              name="provider"
              defaultValue={subscription.provider ?? ""}
              className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Website</label>
            <input
              name="websiteUrl"
              defaultValue={subscription.websiteUrl ?? ""}
              className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Price</label>
            <input
              name="price"
              required
              inputMode="decimal"
              defaultValue={(subscription.priceCents / 100).toFixed(2)}
              className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Currency</label>
            <input
              name="currency"
              defaultValue={subscription.currency}
              className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Billing cycle</label>
            <select
              name="billingCycle"
              defaultValue={subscription.billingCycle}
              className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            >
              <option value="monthly">monthly</option>
              <option value="yearly">yearly</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Next payment date</label>
            <input
              type="date"
              name="nextPaymentDate"
              defaultValue={subscription.nextPaymentDate ? new Date(subscription.nextPaymentDate).toISOString().slice(0, 10) : ""}
              className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium">Notes</label>
            <textarea
              name="notes"
              rows={3}
              defaultValue={subscription.notes ?? ""}
              className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="flex items-center justify-end">
          <button className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white">Save</button>
        </div>
      </form>
    </div>
  );
}
