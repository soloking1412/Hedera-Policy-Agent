"use client";

import type { UIMessage } from "ai";

interface Props {
  message: UIMessage;
}

export function ChatMessage({ message }: Props) {
  const isUser = message.role === "user";

  const text = message.parts
    .filter((p): p is Extract<typeof p, { type: "text" }> => p.type === "text")
    .map((p) => p.text)
    .join("");

  if (!text) return null;

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      <div
        className={`max-w-[80%] rounded-lg px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "bg-[#8259ef] text-white"
            : "bg-[#1a1a1a] text-gray-200 border border-[#2a2a2a]"
        }`}
      >
        <pre className="whitespace-pre-wrap font-sans">{text}</pre>
      </div>
    </div>
  );
}
