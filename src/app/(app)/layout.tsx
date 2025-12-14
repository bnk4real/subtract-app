import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { signOut } from "./actions";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm font-semibold">
              SubTrack
            </Link>
            <nav className="flex items-center gap-3 text-sm text-zinc-600">
              <Link href="/dashboard" className="hover:text-zinc-900">
                Dashboard
              </Link>
              <Link href="/subscriptions" className="hover:text-zinc-900">
                Subscriptions
              </Link>
              <Link href="/settings" className="hover:text-zinc-900">
                Settings
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-zinc-600 sm:block">Welcome, {user?.firstName ?? user?.email ?? ""}</span>
            <form action={signOut}>
              <button className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
    </div>
  );
}
