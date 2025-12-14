import { requireUser } from "@/lib/auth";
import { updateEmail, updateProfile } from "./actions";

type Props = {
  searchParams?: Promise<{
    error?: string;
    message?: string;
  }>;
};

export default async function SettingsPage({ searchParams }: Props) {
  const user = await requireUser();
  const sp = (await searchParams) ?? {};

  const error = sp.error;
  const message = sp.message;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Settings</h1>
        <p className="mt-1 text-sm text-zinc-600">Manage your profile and email.</p>
      </div>

      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
      ) : null}

      {message ? (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">{message}</div>
      ) : null}

      <section className="rounded-lg border border-zinc-200 bg-white">
        <div className="border-b border-zinc-200 px-4 py-3">
          <h2 className="text-sm font-semibold">Profile settings</h2>
        </div>
        <form action={updateProfile} className="space-y-4 p-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium">First name</label>
              <input
                name="firstName"
                defaultValue={user.firstName ?? ""}
                className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Last name</label>
              <input
                name="lastName"
                defaultValue={user.lastName ?? ""}
                className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium">Username</label>
              <input
                name="username"
                defaultValue={user.username ?? ""}
                className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                placeholder="Optional"
              />
            </div>
          </div>

          <div className="flex items-center justify-end">
            <button className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white">Save profile</button>
          </div>
        </form>
      </section>

      <section className="rounded-lg border border-zinc-200 bg-white">
        <div className="border-b border-zinc-200 px-4 py-3">
          <h2 className="text-sm font-semibold">Email settings</h2>
        </div>
        <form action={updateEmail} className="space-y-4 p-4">
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              name="email"
              type="email"
              required
              defaultValue={user.email ?? ""}
              className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            />
          </div>

          <div className="flex items-center justify-end">
            <button className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white">Save email</button>
          </div>
        </form>
      </section>
    </div>
  );
}
