/**
 * Ollama API helpers — status check, streaming chat.
 */

export const OLLAMA_BASE = "http://localhost:11434";

export type OllamaStatus = "loading" | "not_installed" | "not_running" | "starting" | "ready";

export async function checkOllama(): Promise<{ status: OllamaStatus; models: string[] }> {
  try {
    const r = await fetch(`${OLLAMA_BASE}/api/tags`, { signal: AbortSignal.timeout(2000) });
    if (!r.ok) return { status: "not_running", models: [] };
    const d = await r.json();
    const models: string[] = (d.models ?? []).map((m: { name: string }) => m.name);
    return { status: "ready", models };
  } catch {
    // In Tauri's webview, any connection failure comes as a generic fetch error —
    // can't distinguish "not installed" from "not running" via fetch alone.
    return { status: "not_running", models: [] };
  }
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
