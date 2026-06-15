import { streamText, isLoopFinished, type ToolSet } from "ai";
import { getModel } from "@/lib/model";
import { createToolkit, buildSystemPrompt } from "@/lib/agent";

export const maxDuration = 60;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const toolkit = createToolkit();

  const result = streamText({
    model: getModel(),
    system: buildSystemPrompt(),
    messages,
    tools: toolkit.getTools() as ToolSet,
    stopWhen: isLoopFinished(),
  });

  return result.toUIMessageStreamResponse();
}
