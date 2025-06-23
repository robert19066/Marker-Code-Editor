import { languages } from './languages.js';

document.addEventListener("DOMContentLoaded", () => {
  const editorEl = document.getElementById("editor");
  const languageSelect = document.getElementById("language-select");
  const themeSelect = document.getElementById("theme-select");
  const runBtn = document.getElementById("run-btn");

  const toggleAIButton = document.getElementById("toggle-ai-btn");
  const aiContainer = document.getElementById("ai-container");
  const chatMessages = document.getElementById("chat-messages");
  const chatInput = document.getElementById("chat-input");
  const chatSendBtn = document.getElementById("chat-send-btn");

  const outputPre = document.getElementById("output");
  const htmlPreview = document.getElementById("html-preview");

  // Initialize CodeMirror editor
  let codeMirror = CodeMirror.fromTextArea(editorEl, {
    lineNumbers: true,
    mode: "javascript",
    theme: "dracula",
    tabSize: 2,
    indentUnit: 2,
    autofocus: true,
  });

  // Populate language dropdown from languages.js
  languages.forEach(lang => {
    const option = document.createElement("option");
    option.value = lang.id;
    option.textContent = lang.name;
    languageSelect.appendChild(option);
  });

  // Set default language
  languageSelect.value = "javascript";

  // Change CodeMirror mode when language changes
  languageSelect.addEventListener("change", () => {
    const langId = languageSelect.value;
    const langObj = languages.find(l => l.id === langId);
    if (langObj) {
      codeMirror.setOption("mode", langObj.mode);
    }
  });

  // Change theme when theme changes
  themeSelect.addEventListener("change", () => {
    const theme = themeSelect.value;
    codeMirror.setOption("theme", theme);
  });

  // Toggle AI chat visibility
  toggleAIButton.addEventListener("click", () => {
    aiContainer.style.display = aiContainer.style.display === "flex" ? "none" : "flex";
  });

  // Add chat message to chat box
  function addChatMessage(text, sender = "ai") {
    const msg = document.createElement("div");
    msg.classList.add("chat-message", sender);
    msg.textContent = text;
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Send user message and request AI response via preload-exposed API
  async function sendAIMessage(prompt) {
    addChatMessage(prompt, "user");
    chatInput.value = "";
    const typingMsg = document.createElement("div");
    typingMsg.classList.add("chat-message", "ai");
    typingMsg.textContent = "Typing...";
    chatMessages.appendChild(typingMsg);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
      const response = await window.genAI.ask(prompt);
      typingMsg.remove();
      addChatMessage(response || "[Empty response]", "ai");
    } catch (err) {
      typingMsg.remove();
      addChatMessage("Error: " + err.message, "ai");
    }
  }

  chatSendBtn.addEventListener("click", () => {
    const val = chatInput.value.trim();
    if (val) sendAIMessage(val);
  });

  chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      chatSendBtn.click();
    }
  });

  // Run code handler
  runBtn.addEventListener("click", async () => {
    const code = codeMirror.getValue();
    const langId = languageSelect.value;
    const langObj = languages.find(l => l.id === langId);

    outputPre.style.display = "none";
    htmlPreview.style.display = "none";
    outputPre.textContent = "";
    htmlPreview.srcdoc = "";

    if (!langObj) {
      outputPre.style.display = "block";
      outputPre.textContent = "Unsupported language selected.";
      return;
    }

    if (["html", "php", "markdown"].includes(langObj.id)) {
      htmlPreview.style.display = "block";

      if (langObj.id === "markdown") {
        htmlPreview.srcdoc = marked.parse(code);
      } else if (langObj.id === "php") {
        htmlPreview.srcdoc = `<pre>PHP preview not supported in browser</pre>`;
      } else {
        htmlPreview.srcdoc = code;
      }
    } else {
      outputPre.style.display = "block";
      outputPre.textContent = "Running code...";

      try {
        const result = await runCodeWithPistonAPI(langObj.id, code);
        outputPre.textContent = result;
      } catch (err) {
        outputPre.textContent = "Error: " + err.message;
      }
    }
  });

  // Function to call Piston API to run code
  async function runCodeWithPistonAPI(language, source) {
    const payload = {
      language,
      version: "*",
      files: [{ name: "main", content: source }],
    };

    const response = await fetch("https://emkc.org/api/v2/piston/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errText}`);
    }

    const data = await response.json();
    return data.run.output || "[No output]";
  }

  // Initialize editor mode for default language
  const defaultLang = languages.find(l => l.id === "javascript");
  if (defaultLang) {
    codeMirror.setOption("mode", defaultLang.mode);
  }
});
