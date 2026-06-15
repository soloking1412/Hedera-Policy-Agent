# Hedera Policy Agent

An AI-powered API marketplace agent built on Hedera testnet. The agent purchases simulated data services (weather, news, translation) using HBAR, with three runtime policies enforced via the [Hedera Agent Kit hooks system](https://docs.hedera.com/solutions/ai/agent-kit/hooks-and-policies).

## Policies

All three policies extend `AbstractPolicy` from `@hashgraph/hedera-agent-kit` and block at the `PostParamsNormalization` lifecycle stage — after parameters are resolved but before the transaction is submitted.

| Policy | Rule | Limit |
|--------|------|-------|
| **SpendLimitPolicy** | Blocks any single transfer above threshold | 5 HBAR per tx |
| **DailyBudgetPolicy** | Tracks cumulative daily spend and blocks when exceeded | 10 HBAR per day |
| **AllowedCounterpartiesPolicy** | Only whitelisted service provider accounts can receive funds | 4 providers |

Policy violations surface in the chat as tool errors, which the agent explains to the user.

## Demo Flow

1. "Buy WeatherAPI access" → ✅ 2 HBAR to provider, returns mock data
2. "Buy NewsAPI access" → ✅ 3 HBAR to provider, returns mock headlines
3. "Buy PremiumAnalyticsAPI" → ❌ blocked by SpendLimitPolicy (6 HBAR > 5 limit)
4. "Send 3 HBAR to 0.0.9999999" → ❌ blocked by AllowedCounterpartiesPolicy
5. After 8 HBAR spent: "Buy TranslationAPI" → ❌ blocked by DailyBudgetPolicy

## Stack

- **Next.js 16** (App Router, TypeScript)
- **`@hashgraph/hedera-agent-kit`** — `AbstractPolicy`, `AbstractHook`
- **`@hashgraph/hedera-agent-kit-ai-sdk`** — `HederaAIToolkit` for Vercel AI SDK integration
- **`@hiero-ledger/sdk`** — Hedera client
- **AI SDK v6** — `streamText`, `isLoopFinished`, `toUIMessageStreamResponse`
- **Google Gemini 2.0 Flash** (free via Google AI Studio) or Anthropic / OpenAI

## Setup

**1. Clone and install**

```bash
git clone <repo>
cd hedera-policy-agent
npm install
```

**2. Create `.env.local`**

```bash
cp .env.local.example .env.local
```

Fill in:
- `HEDERA_ACCOUNT_ID` and `HEDERA_PRIVATE_KEY` from [portal.hedera.com/dashboard](https://portal.hedera.com/dashboard) (free testnet account)
- `GOOGLE_GENERATIVE_AI_API_KEY` from [aistudio.google.com/apikey](https://aistudio.google.com/apikey) (free)

**3. Create provider accounts on testnet**

```bash
npx ts-node --esm scripts/setup-providers.ts
```

This creates 4 testnet accounts (WeatherAPI, NewsAPI, TranslationAPI, PremiumAnalyticsAPI) and adds them to `.env.local`.

**4. Run**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deployment

```bash
vercel --prod
```

Set environment variables in the Vercel dashboard matching `.env.local.example`.

## Project Structure

```
lib/
  agent.ts                   # HederaAIToolkit + module-level policy singletons
  services.ts                # Service provider registry
  model.ts                   # Provider-agnostic LLM selection
  policies/
    spend-limit.ts           # SpendLimitPolicy
    daily-budget.ts          # DailyBudgetPolicy (tracks spend across requests)
    allowed-counterparties.ts # AllowedCounterpartiesPolicy
app/
  api/
    chat/route.ts            # POST: streamText with Hedera tools
    status/route.ts          # GET: live policy state
components/
  chat-panel.tsx             # Chat UI using @ai-sdk/react useChat
  policy-panel.tsx           # Live policy dashboard (polls /api/status)
  message.tsx                # UIMessage renderer
```

## Hedera Agent Kit Integration

Policies are registered in the toolkit context:

```typescript
new HederaAIToolkit({
  client,
  configuration: {
    plugins: [coreAccountPlugin, coreAccountQueryPlugin],
    context: {
      mode: AgentMode.AUTONOMOUS,
      hooks: [spendLimitPolicy, dailyBudgetPolicy, counterpartiesPolicy],
    },
  },
})
```

Each policy implements `shouldBlockPostParamsNormalization` which inspects `normalisedParams.hbarTransfers` before any transaction is submitted to the network.
