import Link from "next/link";
import { redirect } from "next/navigation";
import {
  LockKeyhole,
  ShieldCheck,
  Zap,
  Wrench,
  Layers,
  Sparkles,
  Workflow,
} from "lucide-react";
import { LoginForm } from "@/components/login";
import { currentAdmin } from "@/lib/auth";
import { databaseReady } from "@/lib/db";
export const metadata = {
  title: "Administrator login",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";
export default async function Page() {
  if (await currentAdmin()) redirect("/admin");
  const ready = databaseReady() && Boolean(process.env.AUTH_SECRET);
  return (
    <div className="admin-login-page">
      <aside className="admin-login-brand-panel">
        <Link href="/" className="admin-login-brand">
          <Zap size={32} fill="currentColor" />
          navonixx<span>.</span>
        </Link>
        <div className="admin-login-art" aria-hidden="true">
          <span>
            <Wrench size={62} />
          </span>
          <span>
            <Sparkles size={72} />
          </span>
          <span>
            <Layers size={62} />
          </span>
        </div>
        <h2>
          Smarter tools.
          <br />
          Bigger <span>possibilities.</span>
        </h2>
        <p>
          Your tools, resources, and growth.
          <br />
          Everything you need, in one workspace.
        </p>
        <div className="admin-login-features">
          <span>
            <Wrench />
            Free tools
          </span>
          <span>
            <Sparkles />
            AI resources
          </span>
          <span>
            <Workflow />
            Workflows
          </span>
        </div>
      </aside>
      <section
        className="admin-signin-card"
        aria-labelledby="admin-login-title"
      >
        <span className="admin-login-symbol">
          <LockKeyhole size={25} />
        </span>
        <span className="eyebrow">NAVONIXX ADMINISTRATION</span>
        <h1 id="admin-login-title">Welcome back</h1>
        <p>
          Enter your administrator email and password to access your dashboard.
        </p>
        {!ready && (
          <p className="notice" role="status">
            Admin login is not configured yet. Configure the database and
            authentication secret, then create your administrator account using
            the documented seed command.
          </p>
        )}
        <LoginForm ready={ready} />
        <div className="admin-login-security">
          <ShieldCheck size={14} />
          Authorized administrators only
        </div>
        <Link href="/" className="text-link">
          Back to NavoNixx
        </Link>
      </section>
    </div>
  );
}
