import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

type Props = {
  params: Promise<{ subscriptionId: string }>;
};

export default async function SubscriptionDetailPage({ params }: Props) {
  const { subscriptionId: id } = await params;
  const user = await requireUser();

  const subscription = await prisma.subscription.findFirst({
    where: { id, userId: user.userId },
  });

  if (!subscription) return notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">{subscription.name}</h1>
          <p className="mt-1 text-sm text-zinc-600">Subscription details</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/subscriptions/${subscription.id}/edit`} className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm">
            Edit
          </Link>
          <Link href="/subscriptions" className="text-sm underline">
            Back
          </Link>
        </div>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white p-5">
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium text-zinc-600">Provider</dt>
            <dd className="mt-1 text-sm">{subscription.provider ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-zinc-600">Price</dt>
            <dd className="mt-1 text-sm">
              {(subscription.priceCents / 100).toFixed(2)} {subscription.currency}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-zinc-600">Billing cycle</dt>
            <dd className="mt-1 text-sm">{subscription.billingCycle}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-zinc-600">Next payment</dt>
            <dd className="mt-1 text-sm">
              {subscription.nextPaymentDate ? new Date(subscription.nextPaymentDate).toLocaleDateString() : "—"}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs font-medium text-zinc-600">Website</dt>
            <dd className="mt-1 text-sm">
              {subscription.websiteUrl ? (
                <a className="underline" href={subscription.websiteUrl} target="_blank" rel="noreferrer">
                  {subscription.websiteUrl}
                </a>
              ) : (
                "—"
              )}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs font-medium text-zinc-600">Notes</dt>
            <dd className="mt-1 whitespace-pre-wrap text-sm">{subscription.notes ?? "—"}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
