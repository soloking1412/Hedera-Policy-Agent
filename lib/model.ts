import type { LanguageModel } from "ai";

export function getModel(): LanguageModel {
  const provider = process.env.LLM_PROVIDER ?? "google";

  if (provider === "anthropic") {
    const { anthropic } = require("@ai-sdk/anthropic");
    return anthropic(process.env.LLM_MODEL ?? "claude-haiku-4-5-20251001");
  }

  if (provider === "openai") {
    const { openai } = require("@ai-sdk/openai");
    return openai(process.env.LLM_MODEL ?? "gpt-4o-mini");
  }

  const { google } = require("@ai-sdk/google");
  return google(process.env.LLM_MODEL ?? "gemini-2.0-flash");
}
