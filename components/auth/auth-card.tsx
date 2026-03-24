"use client";

import { FormEvent, useState } from "react";
import {
  signInGuest,
  signInWithEmail,
  signInWithGoogle,
  signUpWithEmail
} from "@/lib/firebase/auth-helpers";
import { useToast } from "@/components/providers/toast-provider";

export function AuthCard() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const { showToast } = useToast();

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);

    try {
      if (mode === "signup") {
        await signUpWithEmail(email, password, name || "Dreamer");
      } else {
        await signInWithEmail(email, password);
      }
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Authentication failed.", "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mx-auto mt-8 max-w-xl">
      <div className="glass-panel overflow-hidden">
        <div className="border-b border-border px-6 py-6">
          <p className="text-sm text-accent">Social dreams, AI insight</p>
          <h2 className="mt-2 text-2xl font-semibold">Your dream journal, with a pulse.</h2>
          <p className="mt-2 text-sm text-muted">
            Log dreams privately, share the vivid ones, and discover patterns across the
            community.
          </p>
        </div>

        <div className="space-y-4 px-6 py-6">
          <form className="space-y-4" onSubmit={onSubmit}>
            {mode === "signup" ? (
              <input
                className="input-base"
                placeholder="Name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            ) : null}
            <input
              className="input-base"
              placeholder="Email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <input
              className="input-base"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <button className="button-primary w-full" disabled={busy} type="submit">
              {busy ? "Please wait..." : mode === "signup" ? "Create account" : "Sign in"}
            </button>
          </form>

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              className="button-secondary"
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                try {
                  await signInWithGoogle();
                } catch (error) {
                  showToast(
                    error instanceof Error ? error.message : "Google sign-in failed.",
                    "error"
                  );
                } finally {
                  setBusy(false);
                }
              }}
              type="button"
            >
              Continue with Google
            </button>
            <button
              className="button-secondary"
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                try {
                  await signInGuest();
                } catch (error) {
                  showToast(
                    error instanceof Error ? error.message : "Guest sign-in failed.",
                    "error"
                  );
                } finally {
                  setBusy(false);
                }
              }}
              type="button"
            >
              Continue anonymously
            </button>
          </div>

          <button
            className="text-sm text-muted transition hover:text-text"
            onClick={() => setMode((current) => (current === "signin" ? "signup" : "signin"))}
            type="button"
          >
            {mode === "signin"
              ? "Need an account? Create one"
              : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </section>
  );
}
