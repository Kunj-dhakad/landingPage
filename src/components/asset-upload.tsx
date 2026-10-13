"use client";
import { useState } from "react";
export function AssetUpload({
  onUploaded,
  pdf = false,
}: {
  onUploaded: (url: string) => void;
  pdf?: boolean;
}) {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <div>
      <label className="field">
        {pdf
          ? "Upload PDF (up to 5 MB)"
          : "Upload PNG, JPEG, or WEBP (up to 5 MB)"}
        <input
          type="file"
          disabled={busy}
          accept={pdf ? "application/pdf" : "image/png,image/jpeg,image/webp"}
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            if (file.size > 5 * 1024 * 1024) {
              setMessage("File must be under 5 MB.");
              return;
            }
            setBusy(true);
            setMessage("Uploading…");
            try {
              const data = new FormData();
              data.append("file", file);
              const response = await fetch("/api/admin/upload", {
                method: "POST",
                body: data,
              });
              const result = await response.json();
              setMessage(
                response.ok
                  ? "Uploaded. Save the record to use this asset."
                  : result.error,
              );
              if (response.ok) onUploaded(result.url);
            } catch {
              setMessage("Upload failed. Please try again.");
            } finally {
              setBusy(false);
              e.target.value = "";
            }
          }}
        />
      </label>
      {message && (
        <p className="micro" role="status">
          {message}
        </p>
      )}
    </div>
  );
}
