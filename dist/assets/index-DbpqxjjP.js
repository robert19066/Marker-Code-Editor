import{marked as c}from"https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))i(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const s of t.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&i(s)}).observe(document,{childList:!0,subtree:!0});function n(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function i(e){if(e.ep)return;e.ep=!0;const t=n(e);fetch(e.href,t)}})();document.addEventListener("DOMContentLoaded",()=>{const o=document.getElementById("temp-result"),r=document.getElementById("preview");function n(i){const e=r.contentDocument||r.contentWindow.document,t=`
      <!DOCTYPE html>
      <html>
        <body style="font-family: Arial, sans-serif; padding: 1rem;">
          ${c.parse(i)}
        </body>
      </html>
    `;e.open(),e.write(t),e.close()}o.addEventListener("input",()=>{n(o.value)}),n(o.value)});
