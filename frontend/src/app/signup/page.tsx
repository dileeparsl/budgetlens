"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Aperture } from "lucide-react";
import { supabase } from "@/lib/supabase";

const MIN_PASSWORD_LENGTH = 8;

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }

    setLoading(true);
    try {
      const { error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });
      if (authError) {
        setError(authError.message);
        return;
      }
      router.push("/");
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-4 py-10">
      <div className="ghost-border w-full max-w-md rounded-xl bg-surface-container p-8 shadow-ambient">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-container-high">
            <Aperture className="h-8 w-8 text-primary" strokeWidth={1.75} aria-hidden />
          </div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-on-surface">
            BudgetLens
          </h1>
          <p className="text-sm text-on-surface-variant">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
          <div className="flex flex-col gap-2">
            <label htmlFor="signup-email" className="text-sm font-medium text-on-surface-variant">
              Email
            </label>
            <input
              id="signup-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="focus-ring w-full rounded-xl border-0 bg-surface-container-highest px-4 py-3 text-on-surface placeholder:text-on-surface-variant/60 disabled:opacity-60"
              placeholder="you@example.com"
              aria-invalid={!!error}
              aria-describedby={error ? "signup-error" : undefined}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="signup-password" className="text-sm font-medium text-on-surface-variant">
              Password
            </label>
            <input
              id="signup-password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="focus-ring w-full rounded-xl border-0 bg-surface-container-highest px-4 py-3 text-on-surface placeholder:text-on-surface-variant/60 disabled:opacity-60"
              placeholder="••••••••"
              minLength={MIN_PASSWORD_LENGTH}
              aria-invalid={!!error}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="signup-confirm-password"
              className="text-sm font-medium text-on-surface-variant"
            >
              Confirm password
            </label>
            <input
              id="signup-confirm-password"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              className="focus-ring w-full rounded-xl border-0 bg-surface-container-highest px-4 py-3 text-on-surface placeholder:text-on-surface-variant/60 disabled:opacity-60"
              placeholder="••••••••"
              minLength={MIN_PASSWORD_LENGTH}
              aria-invalid={!!error}
            />
          </div>

          {error ? (
            <p id="signup-error" role="alert" className="text-sm text-error">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="gradient-primary focus-ring mt-1 w-full rounded-full py-3 text-sm font-semibold text-on-primary transition-opacity disabled:opacity-60"
          >
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-on-surface-variant">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-primary underline-offset-4 hover:underline focus-ring rounded-sm"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
