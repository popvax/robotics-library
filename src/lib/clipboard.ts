/**
 * Copy text to the clipboard, with a fallback for non-secure contexts.
 * The async Clipboard API only exists on https / localhost — when the site is opened
 * over http://<LAN-IP> (e.g. testing on a phone) it's undefined, so we fall back to a
 * hidden textarea + execCommand (including the selection dance iOS Safari needs).
 */
export async function copyText(text: string): Promise<boolean> {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      /* fall through to the legacy path */
    }
  }

  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.top = '0';
    ta.style.left = '0';
    ta.style.width = '1px';
    ta.style.height = '1px';
    ta.style.padding = '0';
    ta.style.opacity = '0';
    document.body.appendChild(ta);

    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      ta.contentEditable = 'true';
      ta.readOnly = true;
      const range = document.createRange();
      range.selectNodeContents(ta);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
      ta.setSelectionRange(0, text.length);
    } else {
      ta.focus();
      ta.select();
    }

    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}
