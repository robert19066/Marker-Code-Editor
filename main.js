const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { GoogleGenAI } = require("@google/genai");

const apiKey = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey });

ipcMain.handle("genai-ask", async (_, prompt) => {
  try {
    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash-001",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return "[AI ERROR] Empty response from Gemini.";
    }

    return text;

  } catch (error) {
    console.error("Something went wrong", error);

    if (error.message.includes("overloaded")) {
      return "Unfortunately, the AI service is currently overloaded. Please try again later. Error: " + error.message;
    }
    if (error.message.includes("quota") || error.message.includes("limit")) {
      return "API quota or usage limit reached. Please check your API usage or try again later.";
    }
    if (error.message.includes("network") || error.message.includes("ECONNREFUSED")) {
      return "Network error: Unable to reach the AI service. Please check your internet connection.";
    }
    if (error.message.includes("invalid api key") || error.message.includes("authentication")) {
      return "Authentication error: Invalid or missing API key. Please verify your API credentials.";
    }

    return `Something went wrong :/ ${error.message}`;
  }
});


function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.js"), // optional if using ipcRenderer
    },
  });

  win.loadFile("index.html");
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
