import {
  spendLimitPolicy,
  dailyBudgetPolicy,
  POLICY_LIMITS,
} from "@/lib/agent";
import { SERVICES } from "@/lib/services";

export const dynamic = "force-dynamic";

export function GET() {
  return Response.json({
    policies: {
      spendLimit: {
        maxPerTx: spendLimitPolicy.maxHbar,
        unit: "HBAR",
      },
      dailyBudget: {
        limit: POLICY_LIMITS.dailyLimit,
        spent: dailyBudgetPolicy.spent,
        remaining: dailyBudgetPolicy.remaining,
      },
      allowedCounterparties: {
        count: SERVICES.length,
      },
    },
    services: SERVICES.map((s) => ({
      id: s.id,
      name: s.name,
      account: s.account,
      priceHbar: s.priceHbar,
      category: s.category,
    })),
  });
}
