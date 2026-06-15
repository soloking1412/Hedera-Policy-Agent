"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";
import type { UIMessage } from "ai";
import { ChatMessage } from "./message";

const STARTER_PROMPTS = [
  "Buy WeatherAPI access",
  "Buy NewsAPI access",
  "Buy PremiumAnalyticsAPI (try to exceed spend limit)",
  "Send 3 HBAR to account 0.0.9999999 (blocked counterparty)",
];

export function ChatPanel() {
  const { messages, sendMessage, status } = useChat();
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function submit(text: string) {
    if (!text.trim() || isLoading) return;
    sendMessage({ text });
    setInput("");
  }

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-[#2a2a2a] px-4 py-3">
        <h2 className="text-sm font-medium text-gray-300">Agent Chat</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Purchase API access with HBAR — policies enforced automatically
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 && (
          <div className="mt-4">
            <p className="text-xs text-gray-500 mb-3">Try these prompts:</p>
            <div className="flex flex-col gap-2">
              {STARTER_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => submit(prompt)}
                  className="text-left text-xs px-3 py-2 rounded border border-[#2a2a2a] text-gray-400 hover:border-[#8259ef] hover:text-gray-200 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {(messages as UIMessage[]).map((m) => (
          <ChatMessage key={m.id} message={m} />
        ))}

        {isLoading && (
          <div className="flex justify-start mb-3">
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2.5">
              <span className="text-gray-400 text-sm animate-pulse">
                Processing...
              </span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(input);
        }}
        className="border-t border-[#2a2a2a] px-4 py-3 flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask the agent to purchase a service..."
          className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-[#8259ef]"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-[#8259ef] hover:bg-[#7248de] disabled:opacity-40 text-white text-sm px-4 py-2 rounded-lg transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
}
