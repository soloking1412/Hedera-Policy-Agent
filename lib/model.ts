import type { LanguageModel } from "ai";

export function getModel(): LanguageModel {
  const provider = process.env.LLM_PROVIDER ?? "google";

  if (provider === "groq") {
    const { createGroq } = require("@ai-sdk/groq");
    const groq = createGroq({ apiKey: process.env.GROQ_API_KEY });
    return groq(process.env.LLM_MODEL ?? "llama-3.1-8b-instant");
  }

  if (provider === "anthropic") {
    const { anthropic } = require("@ai-sdk/anthropic");
    return anthropic(process.env.LLM_MODEL ?? "claude-3-5-haiku-20241022");
  }

  if (provider === "openai") {
    const { openai } = require("@ai-sdk/openai");
    return openai(process.env.LLM_MODEL ?? "gpt-4o-mini");
  }

  const { google } = require("@ai-sdk/google");
  return google(process.env.LLM_MODEL ?? "gemini-2.0-flash");
}
