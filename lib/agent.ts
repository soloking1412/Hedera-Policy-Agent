import { AgentMode } from "@hashgraph/hedera-agent-kit";
import {
  coreAccountPlugin,
  coreAccountQueryPlugin,
} from "@hashgraph/hedera-agent-kit/plugins";
import { HederaAIToolkit } from "@hashgraph/hedera-agent-kit-ai-sdk";
import { Client, PrivateKey } from "@hiero-ledger/sdk";
import { SpendLimitPolicy } from "@/lib/policies/spend-limit";
import { DailyBudgetPolicy } from "@/lib/policies/daily-budget";
import { AllowedCounterpartiesPolicy } from "@/lib/policies/allowed-counterparties";
import { SERVICES, serviceWhitelist } from "@/lib/services";

export const POLICY_LIMITS = {
  maxPerTx: 5,
  dailyLimit: 10,
} as const;

export const spendLimitPolicy = new SpendLimitPolicy(POLICY_LIMITS.maxPerTx);
export const dailyBudgetPolicy = new DailyBudgetPolicy(POLICY_LIMITS.dailyLimit);
export const counterpartiesPolicy = new AllowedCounterpartiesPolicy(serviceWhitelist());

const SYSTEM_PROMPT = `You are an API marketplace agent running on the Hedera testnet.

Available services:
${SERVICES.map((s) => `- ${s.name}: ${s.priceHbar} HBAR → account ${s.account}`).join("\n")}

When a user requests a service, transfer the exact HBAR amount to the provider's account using the transfer_hbar_tool.

Three policies are enforced at the protocol level — you cannot override them:
1. Spend Limit: max ${POLICY_LIMITS.maxPerTx} HBAR per transaction
2. Daily Budget: max ${POLICY_LIMITS.dailyLimit} HBAR total per day
3. Allowed Counterparties: only the listed provider accounts can receive funds

When a transfer is blocked by policy, clearly explain which policy triggered and why.
After a successful payment, confirm the transaction and return the sample data for that service.
Keep responses concise.`;

export function buildSystemPrompt(): string {
  return SYSTEM_PROMPT;
}

export function createToolkit(): HederaAIToolkit {
  const client = Client.forTestnet().setOperator(
    process.env.HEDERA_ACCOUNT_ID!,
    PrivateKey.fromStringECDSA(process.env.HEDERA_PRIVATE_KEY!)
  );

  return new HederaAIToolkit({
    client,
    configuration: {
      plugins: [coreAccountPlugin, coreAccountQueryPlugin],
      context: {
        mode: AgentMode.AUTONOMOUS,
        hooks: [spendLimitPolicy, dailyBudgetPolicy, counterpartiesPolicy],
      },
    },
  });
}
