"use strict";

document.addEventListener("click", async (event) => {
  if (!(event.target instanceof Element)) return;
  const button = event.target.closest("button[data-copy-value]");
  const status = document.getElementById("contact-copy-status");
  if (!(button instanceof HTMLButtonElement) || !status) return;
  window.clearTimeout(Number(status.dataset.clearTimer || 0));

  try {
    await navigator.clipboard.writeText(button.dataset.copyValue || "");
    status.textContent = "Copied to clipboard.";
  } catch {
    status.textContent = "Clipboard access is unavailable in this browser.";
  }
  status.dataset.clearTimer = String(
    window.setTimeout(() => {
      status.textContent = "";
      delete status.dataset.clearTimer;
    }, 2800),
  );
});
