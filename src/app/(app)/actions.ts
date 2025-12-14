"use server";

import { signOutLocal } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function signOut() {
  await signOutLocal();
  redirect("/login");
}
