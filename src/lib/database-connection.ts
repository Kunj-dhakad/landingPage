/** Allow a suspended database time to wake up without overriding explicit settings. */
export function databaseConnectionUrl(value: string | undefined) {
  if (!value) return value;
  const url = new URL(value);
  if (!url.searchParams.has("connect_timeout")) url.searchParams.set("connect_timeout", "15");
  if (!url.searchParams.has("pool_timeout")) url.searchParams.set("pool_timeout", "15");
  return url.toString();
}

/** Retry a public read once for connection failures; never replace real data with samples. */
export async function retryDatabaseRead<T>(read: () => Promise<T>): Promise<T> {
  try {
    return await read();
  } catch (error) {
    const code = error && typeof error === "object"
      ? (error as { code?: string; errorCode?: string }).code || (error as { errorCode?: string }).errorCode
      : undefined;
    if (!["P1001", "P1002", "P1017", "P2024"].includes(code || "")) throw error;
    return read();
  }
}
