import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = await createClient();
  const { data: messages, error } = await supabase
    .from("messages")
    .select("id, content, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col gap-8 py-32 px-16 bg-white dark:bg-black">
        <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
          Next.js + Supabase
        </h1>

        {error ? (
          <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
            <p className="font-medium">Could not read from Supabase.</p>
            <pre className="mt-2 whitespace-pre-wrap break-all">{error.message}</pre>
            <p className="mt-2 text-red-700 dark:text-red-300">
              Check your env vars in <code>.env.local</code>, that the{" "}
              <code>messages</code> table exists, and that an RLS read policy is
              enabled.
            </p>
          </div>
        ) : messages && messages.length > 0 ? (
          <ul className="flex flex-col gap-3">
            {messages.map((m) => (
              <li
                key={m.id}
                className="rounded-lg border border-black/[.08] p-4 text-lg text-zinc-800 dark:border-white/[.145] dark:text-zinc-200"
              >
                {m.content}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Connected to Supabase, but the <code>messages</code> table is empty
            (or RLS is blocking reads). Run <code>supabase/schema.sql</code> in
            the SQL Editor.
          </p>
        )}
      </main>
    </div>
  );
}
