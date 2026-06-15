import { ChatPanel } from "@/components/chat-panel";
import { PolicyPanel } from "@/components/policy-panel";

export default function Home() {
  return (
    <div className="flex flex-col h-full">
      <header className="border-b border-[#2a2a2a] px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold text-gray-100">
            Hedera Policy Agent
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            API marketplace on Hedera testnet · policy-constrained payments
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs text-gray-500">Testnet</span>
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden">
        <div className="flex-1 border-r border-[#2a2a2a] overflow-hidden">
          <ChatPanel />
        </div>
        <div className="w-72 shrink-0 overflow-hidden">
          <PolicyPanel />
        </div>
      </main>
    </div>
  );
}
