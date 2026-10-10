import type { ReactNode } from "react";

// Tiny, XSS-safe Markdown renderer for briefs: ## / ### headings, "- " lists,
// paragraphs, **bold** and [links](https://…). Builds React nodes — no raw HTML.
// Swap for react-markdown if briefs need tables or images.

function inline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    if (m[1]) nodes.push(<strong key={`${keyPrefix}-${i++}`}>{m[1]}</strong>);
    else
      nodes.push(
        <a key={`${keyPrefix}-${i++}`} href={m[3]} target="_blank" rel="noreferrer" className="text-sky-700 underline">
          {m[2]}
        </a>,
      );
    last = re.lastIndex;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export function Markdown({ source }: { source: string }) {
  const blocks: ReactNode[] = [];
  let list: string[] = [];

  const flushList = () => {
    if (list.length) {
      const k = blocks.length;
      blocks.push(
        <ul key={k} className="list-disc space-y-1 pl-5">
          {list.map((li, j) => (
            <li key={j}>{inline(li, `${k}-${j}`)}</li>
          ))}
        </ul>,
      );
      list = [];
    }
  };

  for (const raw of source.split("\n")) {
    const line = raw.trimEnd();
    const k = blocks.length;
    if (line.startsWith("- ")) {
      list.push(line.slice(2));
      continue;
    }
    flushList();
    if (!line.trim()) continue;
    if (line.startsWith("### ")) blocks.push(<h3 key={k} className="pt-2 text-lg font-bold">{inline(line.slice(4), `${k}`)}</h3>);
    else if (line.startsWith("## ")) blocks.push(<h2 key={k} className="pt-4 text-xl font-black">{inline(line.slice(3), `${k}`)}</h2>);
    else blocks.push(<p key={k}>{inline(line, `${k}`)}</p>);
  }
  flushList();

  return <div className="space-y-3 leading-relaxed text-slate-800">{blocks}</div>;
}
