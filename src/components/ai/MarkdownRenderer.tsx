/**
 * Safe markdown + KaTeX renderer with an error boundary.
 */

import { Component } from "react";
import type { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

class MarkdownErrorBoundary extends Component<{ children: ReactNode }, { error: boolean }> {
  state = { error: false };
  static getDerivedStateFromError() { return { error: true }; }
  render() {
    if (this.state.error)
      return <span style={{ color: "var(--text-dim)", fontSize: 11 }}>[render error — raw text below]</span>;
    return this.props.children;
  }
}

export default function SafeMarkdown({ children }: { children: string }) {
  return (
    <MarkdownErrorBoundary>
      <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
        {children}
      </ReactMarkdown>
    </MarkdownErrorBoundary>
  );
}

/** Inline CSS to inject once alongside the ai-md class */
export const aiMdStyles = `
  .ai-md p { margin: 0 0 8px; }
  .ai-md p:last-child { margin-bottom: 0; }
  .ai-md ul, .ai-md ol { margin: 4px 0 8px 16px; padding: 0; }
  .ai-md li { margin-bottom: 3px; }
  .ai-md code { font-family: var(--font-mono); font-size: 11px; background: var(--bg-active); padding: 1px 5px; border-radius: 4px; color: var(--text-primary); }
  .ai-md pre { background: var(--bg-active); border: 1px solid var(--border-faint); border-radius: 7px; padding: 10px 12px; overflow-x: auto; margin: 6px 0; }
  .ai-md pre code { background: none; padding: 0; font-size: 11px; }
  .ai-md strong { color: var(--text-white); font-weight: 600; }
  .ai-md h1, .ai-md h2, .ai-md h3 { color: var(--text-white); font-weight: 600; margin: 10px 0 4px; }
  .ai-md h1 { font-size: 14px; } .ai-md h2 { font-size: 13px; } .ai-md h3 { font-size: 12.5px; }
  .ai-md blockquote { border-left: 2px solid var(--border-default); margin: 6px 0; padding: 2px 10px; color: var(--text-dim); }
  .ai-md .katex { font-size: 1em; }
  .ai-md .katex-display { overflow-x: auto; overflow-y: hidden; margin: 8px 0; }
`;
