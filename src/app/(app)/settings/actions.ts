"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function updateProfile(formData: FormData) {
  const user = await requireUser();

  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const username = String(formData.get("username") ?? "").trim();

  try {
    await prisma.person.update({
      where: { userId: user.userId },
      data: {
        firstName,
        lastName: lastName || null,
        username: username || null,
      },
    });
  } catch {
    redirect(`/settings?error=${encodeURIComponent("Could not update profile")}`);
  }

  redirect(`/settings?message=${encodeURIComponent("Profile updated")}`);
}

export async function updateEmail(formData: FormData) {
  const user = await requireUser();
  const email = String(formData.get("email") ?? "").trim();

  if (!email) {
    redirect(`/settings?error=${encodeURIComponent("Email is required")}`);
  }

  try {
    await prisma.person.update({
      where: { userId: user.userId },
      data: { email },
    });
  } catch {
    redirect(`/settings?error=${encodeURIComponent("Email is already in use")}`);
  }

  redirect(`/settings?message=${encodeURIComponent("Email updated")}`);
}
