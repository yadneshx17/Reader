/**
 * Ollama API helpers — status check, streaming chat.
 */

import { invoke } from "@tauri-apps/api/core";

export const OLLAMA_BASE = "http://127.0.0.1:11434";

export type OllamaStatus = "loading" | "not_installed" | "not_running" | "starting" | "ready";

export async function checkOllama(): Promise<{ status: OllamaStatus; models: string[] }> {
  // Route through the Rust `check_ollama` command — the webview's fetch to
  // 127.0.0.1 is unreliable in packaged Tauri 2 (opaque origin / CORS).
  const r = await invoke<{ running: boolean; models: string[] }>("check_ollama").catch(() => ({ running: false, models: [] as string[] }));
  if (!r.running) return { status: "not_running", models: [] };
  return { status: "ready", models: r.models };
}

/** Normalize model output: convert \[...\] and \(...\) to $$...$$ / $...$ for KaTeX */
export function normalizeMath(s: string): string {
  return s
    .replace(/\\\[(.+?)\\\]/gs, (_m, inner) => `$$${inner}$$`)
    .replace(/\\\((.+?)\\\)/gs, (_m, inner) => `$${inner}$`);
}

export interface StreamChunkHandler {
  onChunk: (acc: string) => void;
  signal: AbortSignal;
}

export async function streamChat(opts: {
  model: string;
  messages: { role: string; content: string }[];
  signal: AbortSignal;
  onChunk: (acc: string) => void;
}): Promise<string> {
  const res = await fetch(`${OLLAMA_BASE}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: opts.model, messages: opts.messages, stream: true }),
    signal: opts.signal,
  });
  if (!res.ok || !res.body) throw new Error("Bad response");
  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let acc = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    for (const line of dec.decode(value, { stream: true }).split("\n")) {
      if (!line.trim()) continue;
      try {
        const j = JSON.parse(line);
        if (j.message?.content) { acc += j.message.content; opts.onChunk(normalizeMath(acc)); }
      } catch { /* partial line */ }
    }
  }
  return normalizeMath(acc);
}
