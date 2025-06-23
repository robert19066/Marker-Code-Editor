const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

let ai = null; // Lazy init
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("Warning: GEMINI_API_KEY not set. AI features will not work.");
}

ipcMain.handle("genai-ask", async (_, prompt) => {
  if (!ai) {
    const { GoogleGenAI } = require("@google/genai");
    ai = new GoogleGenAI({ apiKey });
  }

  try {
    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash-001",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
    return text || "[AI ERROR] Empty response from Gemini.";
  } catch (error) {
    console.error("AI Error:", error);
    const msg = error.message.toLowerCase();
    if (msg.includes("overloaded")) return "AI service overloaded. Try again later.";
    if (msg.includes("quota") || msg.includes("limit")) return "API quota or usage limit reached.";
    if (msg.includes("network") || msg.includes("econnrefused")) return "Network error: Check your connection.";
    if (msg.includes("invalid api key") || msg.includes("authentication")) return "Authentication error: Check your API key.";
    return `AI Error: ${error.message}`;
  }
});

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    useContentSize: true, // Slightly improves resize perf
    show: false, // Don't show until ready
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.once("ready-to-show", () => win.show()); // Show only when ready
  win.loadFile("index.html");
}

app.whenReady().then(() => {
  createWindow();

  // macOS: re-create a window in the app when the dock icon is clicked
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
