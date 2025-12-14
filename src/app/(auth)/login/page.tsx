import Link from "next/link";
import { signIn, signUp } from "./actions";

type SearchParams = {
  error?: string;
  message?: string;
  next?: string;
};

type Props = {
  searchParams?: Promise<SearchParams>;
};

export default async function LoginPage({ searchParams }: Props) {
  const sp = (await searchParams) ?? {};
  const error = sp.error;
  const message = sp.message;
  const next = sp.next ?? "";

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold">SubTrack</h1>
          <p className="mt-1 text-sm text-zinc-600">Sign in to manage your subscriptions.</p>
        </div>

        {error ? (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {message ? (
          <div className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
            {message}
          </div>
        ) : null}

        <div className="rounded-lg border border-zinc-200 bg-white p-5">
          <form action={signIn} className="space-y-4">
            <input type="hidden" name="next" value={next} />
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                name="email"
                type="email"
                required
                className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Password</label>
              <input
                name="password"
                type="password"
                required
                className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
            >
              Sign in
            </button>
          </form>

          <div className="my-5 h-px bg-zinc-200" />

          <form action={signUp} className="space-y-4">
            <input type="hidden" name="next" value={next} />
            <div>
              <label className="block text-sm font-medium">New email</label>
              <input
                name="email"
                type="email"
                required
                className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">New password</label>
              <input
                name="password"
                type="password"
                required
                className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                placeholder="At least 6 characters"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium"
            >
              Create account
            </button>
          </form>
        </div>

        <p className="mt-6 text-xs text-zinc-500">
          By continuing you agree this is a personal tool. {" "}
          <Link href="/" className="underline">
            Home
          </Link>
        </p>
      </div>
    </div>
  );
}
