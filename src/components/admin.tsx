"use client";
import { Select } from "@/components/ui/select";
import Link from "next/link";
import Image from "next/image";
import { assetUrl } from "@/lib/media-assets";
import dynamic from "next/dynamic";
import { useEffect, useState, useMemo } from "react";
import { useTable, tableFeatures } from "@tanstack/react-table";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  Users,
  Mail,
  Code2,
  Sparkles,
  FileText,
  BookOpen,
  Megaphone,
  Settings,
  ArrowRight,
  Plus,
  Pencil,
  Trash2,
  Download,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Logout } from "./login";
import { AssetUpload } from "./asset-upload";
const Traffic = dynamic(
  () => import("./admin-charts").then((m) => m.TrafficChart),
  { ssr: false, loading: () => <div className="skeleton" /> },
);
const Breakdown = dynamic(
  () => import("./admin-charts").then((m) => m.BreakdownChart),
  { ssr: false },
);
const dataFeatures = tableFeatures({});
export const adminLinks = [
  ["Overview", "overview", LayoutDashboard],
  ["Analytics", "analytics", BarChart3],
  ["Visitors", "visitors", Users],
  ["Leads", "leads", Mail],
  ["Free Tools", "free-tools", Code2],
  ["Affiliate Tools", "affiliate-tools", Sparkles],
  ["Content Management", "content", FileText],
  ["Resources", "resources", BookOpen],
  ["Campaigns", "campaigns", Megaphone],
  ["Email Activity", "email-activity", Mail],
  ["Conversions", "conversions", BarChart3],
  ["Contact Inbox", "contact", Mail],
  ["Settings", "settings", Settings],
  ["Administrators", "administrators", ShieldCheck],
  ["Audit Log", "audit-log", FileText],
] as const;
export function AdminFrame({
  children,
  role,
}: {
  children: React.ReactNode;
  role: string;
}) {
  const path = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const current =
    adminLinks.find(
      ([, key]) => path === (key === "overview" ? "/admin" : `/admin/${key}`),
    )?.[0] || "Dashboard";
  return (
    <div className={`admin-shell${menuOpen ? " menu-open" : ""}`}>
      <aside className="panel admin-sidebar">
        <Link href="/admin" className="admin-workspace-brand">
          <Image src={assetUrl("/images/navonixx-logo.png")} alt="" width={36} height={36} />
          navonixx<span>.</span>
        </Link>
        <span className="admin-nav-label">WORKSPACE</span>
        <nav aria-label="Admin navigation">
          {adminLinks
            .filter(
              ([, key]) =>
                role === "ADMIN" || ["content", "resources"].includes(key),
            )
            .map(([name, key, Icon]) => (
              <Link
                className={
                  path === (key === "overview" ? "/admin" : `/admin/${key}`)
                    ? "active"
                    : ""
                }
                key={key}
                onClick={() => setMenuOpen(false)}
                aria-current={
                  path === (key === "overview" ? "/admin" : `/admin/${key}`)
                    ? "page"
                    : undefined
                }
                href={key === "overview" ? "/admin" : `/admin/${key}`}
              >
                <Icon size={15} />
                {name}
              </Link>
            ))}
        </nav>
        <Link href="/" className="admin-visit-site">
          View website <ArrowRight size={16} />
        </Link>
      </aside>
      <div className="admin-main">
        <header className="admin-topbar">
          <div>
            <button
              className="icon-button admin-menu-toggle"
              aria-label={menuOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={21} /> : <Menu size={21} />}
            </button>
            <span>
              Workspace <span className="admin-breadcrumb-separator">/</span>{" "}
              <strong>{current}</strong>
            </span>
          </div>
          <div>
            <span className="admin-role-badge">
              <ShieldCheck size={14} />
              {role === "ADMIN" ? "Administrator" : "Editor"}
            </span>
            <Logout />
          </div>
        </header>
        <div className="admin-content">{children}</div>
      </div>
    </div>
  );
}
type Row = Record<string, unknown>;
type EditorField = {
  key: string;
  label: string;
  type?: "textarea" | "boolean" | "list" | "password";
  options?: string[];
  default?: string | boolean;
};
const resourceFields: EditorField[] = [
  { key: "title", label: "Title" },
  { key: "slug", label: "URL slug" },
  {
    key: "kind",
    label: "Resource type",
    options: ["blog", "prompts", "templates", "workflows", "toolkit", "faq"],
  },
  { key: "description", label: "Short description", type: "textarea" },
  { key: "category", label: "Category" },
  { key: "body", label: "Markdown content", type: "textarea" },
  { key: "assetPath", label: "PDF asset path (optional)", default: "" },
  { key: "coverUrl", label: "Cover image URL (optional)" },
  { key: "seoTitle", label: "SEO title (optional)" },
  { key: "seoDescription", label: "SEO description (optional)" },
  { key: "published", label: "Published", type: "boolean" },
  { key: "featured", label: "Featured", type: "boolean" },
  {
    key: "emailCapture",
    label: "Offer optional email delivery",
    type: "boolean",
  },
];
const affiliateFields: EditorField[] = [
  { key: "name", label: "Name" },
  { key: "slug", label: "URL slug" },
  { key: "description", label: "Short description", type: "textarea" },
  { key: "body", label: "Overview (Markdown)", type: "textarea" },
  { key: "category", label: "Category" },
  { key: "officialUrl", label: "Official website URL" },
  { key: "destinationUrl", label: "Approved affiliate destination (optional)" },
  { key: "logoUrl", label: "Logo URL (optional)" },
  {
    key: "pricingModel",
    label: "Pricing model",
    options: ["UNVERIFIED", "FREE", "FREEMIUM", "PAID"],
  },
  {
    key: "pricingDescription",
    label: "Pricing description",
    default: "Confirm current pricing on the official website.",
  },
  {
    key: "freePlan",
    label: "Free plan information",
    default: "Not yet verified.",
  },
  ...["features", "advantages", "limitations", "platforms", "useCases"].map(
    (key) => ({
      key,
      label: key.replace(/([A-Z])/g, " $1"),
      type: "list" as const,
    }),
  ),
  { key: "affiliate", label: "Affiliate relationship", type: "boolean" },
  { key: "published", label: "Published", type: "boolean" },
  { key: "featured", label: "Featured", type: "boolean" },
];
const editors: Record<string, EditorField[]> = {
  resources: resourceFields,
  content: resourceFields,
  "affiliate-tools": affiliateFields,
  "free-tools": [
    { key: "title", label: "Tool name" },
    { key: "description", label: "Description", type: "textarea" },
    {
      key: "category",
      label: "Category",
      options: ["Writing", "Development", "Business", "Marketing"],
    },
    { key: "enabled", label: "Enabled", type: "boolean" },
    { key: "featured", label: "Featured", type: "boolean" },
    { key: "iconUrl", label: "Icon URL (optional)" },
    { key: "seoTitle", label: "SEO title (optional)" },
    { key: "seoDescription", label: "SEO description (optional)" },
  ],
  campaigns: [
    { key: "name", label: "Campaign name" },
    { key: "source", label: "UTM source" },
    { key: "medium", label: "UTM medium" },
    { key: "url", label: "Campaign destination URL" },
  ],
  settings: [
    {
      key: "key",
      label: "Setting",
      options: [
        "brandName",
        "tagline",
        "contactEmail",
        "affiliateDisclosure",
        "retentionDays",
        "socialLinks",
      ],
    },
    { key: "value", label: "Value", type: "textarea" },
  ],
  administrators: [
    { key: "email", label: "Admin email" },
    {
      key: "password",
      label: "New password (12+ characters)",
      type: "password",
    },
    { key: "role", label: "Role", options: ["ADMIN", "EDITOR"] },
    { key: "enabled", label: "Enabled", type: "boolean", default: true },
  ],
  contact: [
    { key: "status", label: "Status", options: ["NEW", "REPLIED", "CLOSED"] },
  ],
  leads: [
    { key: "status", label: "Subscription status", options: ["UNSUBSCRIBED"] },
  ],
};
const cols: Record<string, string[]> = {
  leads: ["email", "createdAt", "source", "campaign", "status", "verifiedAt"],
  visitors: [
    "id",
    "landingPage",
    "exitPage",
    "source",
    "campaign",
    "device",
    "browser",
    "startedAt",
    "lastSeenAt",
    "durationSecondsEstimate",
    "returning",
    "country",
    "_count",
  ],
  resources: ["title", "kind", "category", "published", "updatedAt"],
  content: ["title", "kind", "category", "published", "updatedAt"],
  "affiliate-tools": [
    "name",
    "category",
    "pricingModel",
    "affiliate",
    "published",
    "_count",
  ],
  "free-tools": ["title", "category", "enabled", "featured"],
  "email-activity": [
    "lead",
    "kind",
    "status",
    "resourceSlug",
    "error",
    "createdAt",
  ],
  campaigns: ["name", "source", "medium", "url"],
  settings: ["key", "value"],
  administrators: ["email", "role", "enabled", "createdAt"],
  contact: ["name", "email", "message", "status", "createdAt"],
  "audit-log": ["action", "entity", "entityId", "createdAt"],
};
function display(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}
export function AdminData({
  entity,
  title,
}: {
  entity: string;
  title: string;
}) {
  const [rows, setRows] = useState<Row[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("desc");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState<Row | null>(null);
  const [draft, setDraft] = useState<Row>({});
  const [preview, setPreview] = useState(false);
  const [detail, setDetail] = useState<Row | null>(null);
  const [version, setVersion] = useState(0);
  const columns = useMemo(
    () => (cols[entity] || []).map((key) => ({ accessorKey: key })),
    [entity],
  );
  const table = useTable({ features: dataFeatures, data: rows, columns });
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    void fetch(
      `/api/admin/${entity}?page=${page}&search=${encodeURIComponent(search)}&status=${status}&sort=${sort}`,
      { signal: controller.signal },
    )
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setMessage(d.error);
        else {
          setRows(d.rows);
          setPages(d.pages || 1);
          setTotal(d.total);
        }
        setLoading(false);
      })
      .catch((e) => {
        if (e.name !== "AbortError") {
          setMessage("Could not load records.");
          setLoading(false);
        }
      });
    return () => controller.abort();
  }, [entity, page, search, status, sort, version]);
  function open(row: Row) {
    setEdit(row);
    setDetail(null);
    setPreview(false);
    setDraft(
      Object.fromEntries(
        (editors[entity] || []).map((f) => [
          f.key,
          f.type === "list"
            ? Array.isArray(row[f.key])
              ? (row[f.key] as string[]).join("\n")
              : ""
            : (row[f.key] ??
              f.default ??
              (f.type === "boolean" ? false : f.options?.[0] || "")),
        ]),
      ),
    );
  }
  async function save(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    const data = Object.fromEntries(
      editors[entity].map((f) => [
        f.key,
        f.type === "list"
          ? String(draft[f.key] || "")
              .split("\n")
              .map((s) => s.trim())
              .filter(Boolean)
          : f.type === "boolean"
            ? Boolean(draft[f.key])
            : draft[f.key],
      ]),
    );
    for (const key of [
      "assetPath",
      "coverUrl",
      "logoUrl",
      "iconUrl",
      "destinationUrl",
      "seoTitle",
      "seoDescription",
    ])
      if (data[key] === "") data[key] = null;
    if (entity === "administrators" && edit?.id && data.password === "")
      delete data.password;
    try {
      const response = await fetch(
        `/api/admin/${entity}${edit?.id ? `/${edit.id}` : ""}`,
        {
          method: edit?.id ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        },
      );
      const result = await response.json();
      setMessage(result.message || result.error);
      if (response.ok) {
        setEdit(null);
        setVersion(version + 1);
      }
    } catch {
      setMessage("Could not save. Try again.");
    }
  }
  const canCreate = [
    "resources",
    "content",
    "affiliate-tools",
    "campaigns",
    "settings",
    "administrators",
  ].includes(entity);
  return (
    <>
      <div className="admin-heading">
        <div>
          <span className="eyebrow">NAVONIXX WORKSPACE</span>
          <h1>{title}</h1>
        </div>
        <Logout />
      </div>
      <div className="admin-tools">
        <input
          aria-label="Search records"
          value={search}
          placeholder="Search records…"
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        {entity !== "settings" && (
          <Select aria-label="Sort by date" value={sort} onValueChange={setSort} options={[{ value: "desc", label: "Newest first" }, { value: "asc", label: "Oldest first" }]} />
        )}
        {entity === "leads" && (
          <>
            <Select aria-label="Lead subscription filter" value={status} onValueChange={value => { setStatus(value); setPage(1); }} options={[{ value: "", label: "All statuses" }, ...["TRANSACTIONAL", "PENDING", "SUBSCRIBED", "UNSUBSCRIBED"].map(value => ({ value, label: value[0] + value.slice(1).toLowerCase() }))]} />
            <a
              className="button secondary small"
              href="/api/admin/export"
              download
            >
              <Download size={14} />
              Export CSV
            </a>
          </>
        )}
        {canCreate && (
          <button className="button primary small" onClick={() => open({})}>
            <Plus size={14} />
            Add new
          </button>
        )}
        {entity === "settings" && (
          <button
            className="button secondary small"
            onClick={async () => {
              if (
                !confirm(
                  "Delete expired analytics and sessions according to the retention setting?",
                )
              )
                return;
              const r = await fetch("/api/admin/retention", { method: "POST" });
              const d = await r.json();
              setMessage(d.message || d.error);
            }}
          >
            Apply retention policy
          </button>
        )}
      </div>
      {entity === "free-tools" && (
        <p className="notice">
          These records configure registered tools. New executable tools require
          an implementation in the tool registry.
        </p>
      )}
      {message && (
        <p className="notice" role="status">
          {message}
        </p>
      )}
      {edit && (
        <form className="panel" onSubmit={save}>
          <div className="admin-heading">
            <h2>{edit.id ? "Edit record" : "New record"}</h2>
            <button
              type="button"
              className="button secondary small"
              onClick={() => setEdit(null)}
            >
              Cancel
            </button>
          </div>
          <div className="admin-edit-grid">
            {editors[entity].map((f) => (
              <label
                className={f.type === "boolean" ? "checkbox" : "field"}
                key={f.key}
              >
                <span>
                  {f.label}
                  {f.type === "list" ? " (one per line)" : ""}
                </span>
                {f.type === "boolean" ? (
                  <input
                    type="checkbox"
                    checked={Boolean(draft[f.key])}
                    onChange={(e) =>
                      setDraft({ ...draft, [f.key]: e.target.checked })
                    }
                  />
                ) : f.options ? (
                  <Select aria-label={f.label} value={String(draft[f.key] || "")} onValueChange={value => setDraft({ ...draft, [f.key]: value })} options={f.options} />
                ) : f.type === "textarea" || f.type === "list" ? (
                  <textarea
                    rows={f.key === "body" ? 12 : 4}
                    value={String(draft[f.key] || "")}
                    onChange={(e) =>
                      setDraft({ ...draft, [f.key]: e.target.value })
                    }
                  />
                ) : (
                  <input
                    type={f.type === "password" ? "password" : "text"}
                    value={String(draft[f.key] || "")}
                    onChange={(e) =>
                      setDraft({ ...draft, [f.key]: e.target.value })
                    }
                  />
                )}
              </label>
            ))}
          </div>
          {["resources", "content", "affiliate-tools", "free-tools"].includes(
            entity,
          ) && (
            <AssetUpload
              pdf={["resources", "content"].includes(entity)}
              onUploaded={(url) =>
                setDraft({
                  ...draft,
                  [["resources", "content"].includes(entity)
                    ? "assetPath"
                    : entity === "affiliate-tools"
                      ? "logoUrl"
                      : "iconUrl"]: url,
                })
              }
            />
          )}{" "}
          {["resources", "content"].includes(entity) && (
            <AssetUpload
              onUploaded={(url) => setDraft({ ...draft, coverUrl: url })}
            />
          )}{" "}
          {Boolean(draft.body) && (
            <>
              <button
                type="button"
                className="button secondary small"
                onClick={() => setPreview(!preview)}
              >
                {preview ? "Hide" : "Show"} Markdown preview
              </button>
              {preview && (
                <article className="prose panel">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {String(draft.body)}
                  </ReactMarkdown>
                </article>
              )}
            </>
          )}
          <button className="button primary" type="submit">
            Save changes <ArrowRight size={15} />
          </button>
        </form>
      )}
      {detail && (
        <div className="panel prose">
          <div className="admin-heading">
            <h2>Record detail</h2>
            <button
              className="button secondary small"
              onClick={() => setDetail(null)}
            >
              Close
            </button>
          </div>
          <pre>{JSON.stringify(detail, null, 2)}</pre>
          {entity === "leads" && (
            <a
              className="button secondary small"
              href={`/api/admin/export?format=lead-json&id=${detail.id}`}
            >
              Export this lead&apos;s data
            </a>
          )}
        </div>
      )}
      <p className="result-count">
        {total} records · Page {page} of {pages}
      </p>
      {loading ? (
        <div className="skeleton" />
      ) : (
        <div className="panel data-table">
          <table>
            <thead>
              <tr>
                {(cols[entity] || []).map((c) => (
                  <th key={c}>
                    {c.replace(/([A-Z])/g, " $1").replace("_count", "Activity")}
                  </th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {table.getRowModel().rows.map(({ original: row }, i) => (
                <tr key={String(row.id || row.key || i)}>
                  {(cols[entity] || []).map((c) => (
                    <td key={c} title={display(row[c])}>
                      {display(row[c]).slice(0, 90)}
                    </td>
                  ))}
                  <td>
                    <div className="tool-actions">
                      <button
                        className="button secondary small"
                        onClick={() => setDetail(row)}
                      >
                        Details
                      </button>
                      {editors[entity] && (
                        <button
                          className="icon-button"
                          aria-label="Edit record"
                          onClick={() =>
                            open(
                              entity === "settings"
                                ? { ...row, id: undefined }
                                : row,
                            )
                          }
                        >
                          <Pencil size={13} />
                        </button>
                      )}
                      {[
                        "resources",
                        "content",
                        "affiliate-tools",
                        "leads",
                        "campaigns",
                        "contact",
                        "administrators",
                      ].includes(entity) && (
                        <button
                          className="icon-button"
                          aria-label="Delete record"
                          onClick={async () => {
                            if (
                              !confirm(
                                "Permanently delete this record and its related data?",
                              )
                            )
                              return;
                            const r = await fetch(
                              `/api/admin/${entity}/${row.id}`,
                              { method: "DELETE" },
                            );
                            const d = await r.json();
                            setMessage(d.message || d.error);
                            if (r.ok) setVersion(version + 1);
                          }}
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!rows.length && (
            <p className="notice">
              No records yet. This view displays real database records.
            </p>
          )}
        </div>
      )}
      <div className="tool-actions">
        <button
          className="button secondary small"
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>
        <button
          className="button secondary small"
          disabled={page >= pages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </>
  );
}
type OverviewData = {
  metrics: { label: string; value: number; suffix?: string }[];
  traffic: { day: string; visits: number }[];
  sources: { name: string; count: number }[];
  popular: { name: string; count: number }[];
  devices: { name: string; count: number }[];
  landingPages: { name: string; count: number }[];
  funnel: { name: string; count: number }[];
};
export function AdminOverview({ entity = "overview" }: { entity?: string }) {
  const [days, setDays] = useState("30");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [data, setData] = useState<OverviewData | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    const now = new Date();
    const today = new Date(
      new Date(now.getTime() + 330 * 60000).toISOString().slice(0, 10) +
        "T00:00:00+05:30",
    );
    const start =
      days === "custom"
        ? new Date(from + "T00:00:00+05:30")
        : days === "today"
          ? today
          : days === "yesterday"
            ? new Date(today.getTime() - 86400000)
            : new Date(now.getTime() - Number(days) * 86400000);
    const end =
      days === "custom"
        ? new Date(to + "T23:59:59+05:30")
        : days === "yesterday"
          ? new Date(today.getTime() - 1)
          : now;
    if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime()))
      return;
    setData(null);
    setError("");
    const controller = new AbortController();
    void fetch(
      `/api/admin/${entity}?from=${start.toISOString()}&to=${end.toISOString()}`,
      { signal: controller.signal },
    )
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setError(d.error);
        else setData(d);
      })
      .catch((e) => {
        if (e.name !== "AbortError")
          setError("Analytics unavailable. Check your database connection.");
      });
    return () => controller.abort();
  }, [days, from, to, entity]);
  return (
    <>
      <div className="admin-heading">
        <div>
          <span className="eyebrow">A CLEARER PICTURE OF YOUR GROWTH</span>
          <h1>
            {entity === "overview"
              ? "Your workspace, at a glance."
              : entity === "analytics"
                ? "Understand your audience."
                : "Follow the useful next steps."}
          </h1>
        </div>
        <Logout />
      </div>
      <div className="admin-tools">
        <label className="field">
          Date range
          <Select aria-label="Date range" value={days} onValueChange={setDays} options={[{ value: "today", label: "Today (workspace time)" }, { value: "yesterday", label: "Yesterday (workspace time)" }, { value: "7", label: "Last 7 days" }, { value: "30", label: "Last 30 days" }, { value: "custom", label: "Custom range" }]} />
        </label>
        {days === "custom" && (
          <>
            <label className="field">
              From
              <input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />
            </label>
            <label className="field">
              To
              <input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </label>
          </>
        )}
      </div>
      <p className="notice">
        Traffic includes anonymous page-view counts. Unique visitors and sessions reflect optional, consented analytics and are
        cookie-based estimates. Lead/session and click/page ratios use different
        populations; they are not exact attribution or user-level conversion
        funnels.
      </p>
      {error && <p className="notice error">{error}</p>}
      {!data && !error ? (
        <div className="skeleton" />
      ) : (
        data && (
          <>
            <div className="metric-grid">
              {data.metrics.map((m) => (
                <div key={m.label} className="panel metric-card">
                  <span>{m.label}</span>
                  <strong>
                    {m.value.toLocaleString("en-IN")}
                    {m.suffix}
                  </strong>
                  <span>Measured in selected period</span>
                </div>
              ))}
            </div>
            <div className="panel" style={{ marginTop: 25 }}>
              <h2 style={{ fontSize: 23 }}>Recorded page views</h2>
              {data.traffic.length ? (
                <Traffic data={data.traffic} />
              ) : (
                <p className="notice">No recorded traffic in this period.</p>
              )}
            </div>
            <div className="admin-edit-grid" style={{ marginTop: 25 }}>
              {[
                ["Traffic sources", data.sources],
                ["Popular tools", data.popular],
                ["Devices", data.devices],
                ["Top landing pages", data.landingPages],
                ["Activity counts", data.funnel],
              ].map(([title, values]) => (
                <div className="panel" key={title as string}>
                  <h2 style={{ fontSize: 21 }}>{title as string}</h2>
                  {(values as OverviewData["sources"]).length ? (
                    <Breakdown data={values as OverviewData["sources"]} />
                  ) : (
                    <p className="notice">No records for this period.</p>
                  )}
                </div>
              ))}
            </div>
          </>
        )
      )}
    </>
  );
}
