const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("genAI", {
  ask: (prompt) => ipcRenderer.invoke("genai-ask", prompt),
});
