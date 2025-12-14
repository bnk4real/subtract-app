"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function parsePriceCents(value: FormDataEntryValue | null) {
  const raw = String(value ?? "").trim();
  if (!raw) return null;

  // Allow "12", "12.3", "12.34"
  const normalized = raw.replace(/,/g, "");
  const amount = Number(normalized);
  if (!Number.isFinite(amount) || amount < 0) return null;

  return Math.round(amount * 100);
}

async function requireUserId() {
  const user = await requireUser();
  return user.userId;
}

export async function createSubscription(formData: FormData) {
  const userId = await requireUserId();

  const name = String(formData.get("name") ?? "").trim();
  const provider = String(formData.get("provider") ?? "").trim() || null;
  const currency = String(formData.get("currency") ?? "USD").trim() || "USD";
  const billingCycle = String(formData.get("billingCycle") ?? "monthly").trim() || "monthly";
  const websiteUrl = String(formData.get("websiteUrl") ?? "").trim() || null;
  const notes = String(formData.get("notes") ?? "").trim() || null;

  const priceCents = parsePriceCents(formData.get("price"));
  const nextPaymentDateRaw = String(formData.get("nextPaymentDate") ?? "").trim();
  const nextPaymentDate = nextPaymentDateRaw ? new Date(nextPaymentDateRaw) : null;

  if (!name || priceCents === null) {
    redirect(`/subscriptions/new?error=${encodeURIComponent("Name and price are required")}`);
  }

  await prisma.subscription.create({
    data: {
      userId,
      name,
      provider,
      priceCents,
      currency,
      billingCycle,
      nextPaymentDate,
      websiteUrl,
      notes,
    },
  });

  revalidatePath("/subscriptions");
  redirect("/subscriptions");
}

export async function updateSubscription(subscriptionId: string, formData: FormData) {
  const userId = await requireUserId();

  const name = String(formData.get("name") ?? "").trim();
  const provider = String(formData.get("provider") ?? "").trim() || null;
  const currency = String(formData.get("currency") ?? "USD").trim() || "USD";
  const billingCycle = String(formData.get("billingCycle") ?? "monthly").trim() || "monthly";
  const websiteUrl = String(formData.get("websiteUrl") ?? "").trim() || null;
  const notes = String(formData.get("notes") ?? "").trim() || null;

  const priceCents = parsePriceCents(formData.get("price"));
  const nextPaymentDateRaw = String(formData.get("nextPaymentDate") ?? "").trim();
  const nextPaymentDate = nextPaymentDateRaw ? new Date(nextPaymentDateRaw) : null;

  if (!name || priceCents === null) {
    redirect(`/subscriptions/${subscriptionId}/edit?error=${encodeURIComponent("Name and price are required")}`);
  }

  const result = await prisma.subscription.updateMany({
    where: { id: subscriptionId, userId },
    data: {
      name,
      provider,
      priceCents,
      currency,
      billingCycle,
      nextPaymentDate,
      websiteUrl,
      notes,
    },
  });

  if (result.count === 0) {
    redirect("/subscriptions");
  }

  revalidatePath("/subscriptions");
  redirect(`/subscriptions/${subscriptionId}`);
}

export async function deleteSubscription(subscriptionId: string) {
  const userId = await requireUserId();

  await prisma.subscription.deleteMany({
    where: { id: subscriptionId, userId },
  });

  revalidatePath("/subscriptions");
  redirect("/subscriptions");
}
