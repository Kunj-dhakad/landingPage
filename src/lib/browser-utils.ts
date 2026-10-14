/** Crypto.getRandomValues also works on the HTTP LAN preview. */
export function createUUID() {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0"));
  return [hex.slice(0, 4), hex.slice(4, 6), hex.slice(6, 8), hex.slice(8, 10), hex.slice(10)].map((part) => part.join("")).join("-");
}

export async function copyText(text: string) {
  if (window.isSecureContext && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      // Use the user-triggered selection fallback if clipboard access is denied.
    }
  }
  const previousFocus = document.activeElement;
  const selection = document.getSelection();
  const ranges = selection ? Array.from({ length: selection.rangeCount }, (_, i) => selection.getRangeAt(i).cloneRange()) : [];
  const input = document.createElement("textarea");
  input.value = text;
  input.setAttribute("readonly", "");
  input.style.cssText = "position:fixed;left:0;top:0;opacity:0;pointer-events:none;font-size:16px";
  document.body.appendChild(input);
  try {
    input.select();
    if (!document.execCommand("copy")) throw new Error("Clipboard access unavailable");
  } finally {
    input.remove();
    if (previousFocus instanceof HTMLElement) previousFocus.focus({ preventScroll: true });
    selection?.removeAllRanges();
    for (const range of ranges) selection?.addRange(range);
  }
}
