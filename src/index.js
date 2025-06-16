import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";

document.addEventListener('DOMContentLoaded', () => {
  const textarea = document.getElementById('temp-result');
  const iframe = document.getElementById('preview');

  function updatePreview(markdown) {
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    const outputDiv = doc.getElementById('output');
    if (outputDiv) {
      outputDiv.innerHTML = marked.parse(markdown);
    }
  }

  // Ensure the iframe is fully loaded before initial update.
  iframe.addEventListener('load', () => {
    updatePreview(textarea.value);
  });

  // Watch for input events to update the preview.
  textarea.addEventListener('input', () => {
    updatePreview(textarea.value);
  });

  // If the iframe is already loaded, update immediately.
  if (iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
    updatePreview(textarea.value);
  }
});
