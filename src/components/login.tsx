"use client";
import { useState } from "react";
import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LogIn, LogOut, Eye, EyeOff } from "lucide-react";
export function LoginForm({ ready }: { ready: boolean }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  return (
    <form
      noValidate
      onSubmit={async (e) => {
        e.preventDefault();
        const values = new FormData(e.currentTarget);
        const email = String(values.get("email") || "").trim();
        const password = String(values.get("password") || "");
        if (!email || !password) {
          setMessage("Enter your admin email and password.");
          return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          setMessage("Enter a valid admin email address.");
          return;
        }
        if (!ready) {
          setMessage(
            "Admin sign-in is currently unavailable. Please contact the site administrator to finish enabling access.",
          );
          return;
        }
        setBusy(true);
        setMessage("");
        try {
          const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
          });
          if (result?.error)
            setMessage(
              "Login failed. Check your credentials or try again later.",
            );
          else if (result?.ok) {
            router.push("/admin");
            router.refresh();
          } else setMessage("Unable to sign in. Please try again.");
        } catch {
          setMessage("Authentication is unavailable. Check server setup.");
        } finally {
          setBusy(false);
        }
      }}
    >
      <label className="field">
        Admin email
        <input
          name="email"
          type="email"
          autoComplete="username"
          placeholder="you@example.com"
          autoFocus
          required
        />
      </label>
      <label className="field">
        Password
        <span className="login-password-field">
          <input
            id="admin-login-password"
            name="password"
            type={showPassword ? "text" : "password"}
            maxLength={128}
            autoComplete="current-password"
            required
            placeholder="Enter your password"
          />
          <button
            type="button"
            className="login-password-toggle"
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-controls="admin-login-password"
            aria-pressed={showPassword}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </span>
      </label>
      <button className="button primary admin-login-submit" disabled={busy}>
        <LogIn size={16} />
        {busy ? "Signing in…" : "Sign in securely"}
      </button>
      {message && (
        <p role="alert" className="notice error">
          {message}
        </p>
      )}
    </form>
  );
}
export function Logout() {
  return (
    <button
      className="button secondary small"
      onClick={() => void signOut({ callbackUrl: "/admin/login" })}
    >
      <LogOut size={15} />
      Log out
    </button>
  );
}
