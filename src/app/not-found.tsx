import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md py-24 text-center">
      <h1 className="text-xl font-semibold">Not found</h1>
      <p className="mt-2 text-sm text-zinc-600">The page you’re looking for doesn’t exist.</p>
      <div className="mt-6">
        <Link href="/dashboard" className="underline">
          Go to dashboard
        </Link>
      </div>
    </div>
  );
}
