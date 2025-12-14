"use server";

import { signInWithUsernameAndPassword, signUpWithUsernameAndPassword } from "@/lib/auth";
import { redirect } from "next/navigation";

function getRedirectTarget(formData: FormData) {
  const next = String(formData.get("next") ?? "").trim();
  return next && next.startsWith("/") ? next : "/dashboard";
}

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    redirect(`/login?error=${encodeURIComponent("Email and password are required")}`);
  }

  const user = await signInWithUsernameAndPassword(email, password);
  if (!user) redirect(`/login?error=${encodeURIComponent("Invalid credentials")}`);

  redirect(getRedirectTarget(formData));
}

export async function signUp(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    redirect(`/login?error=${encodeURIComponent("Email and password are required")}`);
  }

  const user = await signUpWithUsernameAndPassword(email, password);
  if (!user) {
    redirect(`/login?error=${encodeURIComponent("Account already exists")}`);
  }

  redirect(`/login?message=${encodeURIComponent("Account created. You can sign in now.")}`);
}
