var{contextBridge:n,ipcRenderer:i}=require("electron");n.exposeInMainWorld("genAI",{ask:e=>i.invoke("genai-ask",e)});
