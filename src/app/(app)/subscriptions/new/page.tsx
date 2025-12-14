import Link from "next/link";
import { createSubscription } from "../actions";

type Props = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

export default async function NewSubscriptionPage({ searchParams }: Props) {
  const sp = (await searchParams) ?? {};
  const error = sp.error;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">New subscription</h1>
          <p className="mt-1 text-sm text-zinc-600">Add a service you pay for.</p>
        </div>
        <Link href="/subscriptions" className="text-sm underline">
          Back
        </Link>
      </div>

      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
      ) : null}

      <form action={createSubscription} className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium">Name</label>
            <input
              name="name"
              required
              className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
              placeholder="Netflix"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Provider</label>
            <input
              name="provider"
              className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
              placeholder="Netflix"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Website</label>
            <input
              name="websiteUrl"
              className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Price</label>
            <input
              name="price"
              required
              inputMode="decimal"
              className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
              placeholder="9.99"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Currency</label>
            <input
              name="currency"
              defaultValue="USD"
              className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
              placeholder="USD"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Billing cycle</label>
            <select
              name="billingCycle"
              defaultValue="monthly"
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
              className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium">Notes</label>
            <textarea
              name="notes"
              rows={3}
              className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
              placeholder="Optional"
            />
          </div>
        </div>

        <div className="flex items-center justify-end">
          <button className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white">Create</button>
        </div>
      </form>
    </div>
  );
}
