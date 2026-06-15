import {
  AbstractPolicy,
  type PostParamsNormalizationParams,
  type PostSecondaryActionParams,
} from "@hashgraph/hedera-agent-kit";
import { coreAccountPluginToolNames } from "@hashgraph/hedera-agent-kit/plugins";

function toHbarNumber(amount: unknown): number {
  if (amount == null) return 0;
  if (typeof amount === "number") return amount;
  if (typeof amount === "string") return parseFloat(amount);
  if (typeof amount === "object" && "toBigNumber" in amount) {
    const bn = (amount as { toBigNumber: () => { toNumber: () => number } }).toBigNumber();
    return bn.toNumber();
  }
  return Number(amount);
}

function sumOutgoing(transfers: Array<{ amount: unknown }>): number {
  return transfers
    .filter((t) => toHbarNumber(t.amount) > 0)
    .reduce((sum, t) => sum + toHbarNumber(t.amount), 0);
}

export class DailyBudgetPolicy extends AbstractPolicy {
  name = "Daily Budget";
  description = `Limits total daily HBAR spend to ${this.limit} HBAR`;
  relevantTools = [coreAccountPluginToolNames.TRANSFER_HBAR_TOOL];

  private ledger = new Map<string, number>();

  constructor(readonly limit: number) {
    super();
  }

  private today(): string {
    return new Date().toISOString().split("T")[0];
  }

  get spent(): number {
    return this.ledger.get(this.today()) ?? 0;
  }

  get remaining(): number {
    return Math.max(0, this.limit - this.spent);
  }

  protected shouldBlockPostParamsNormalization(
    params: PostParamsNormalizationParams,
    _method: string
  ): boolean {
    const transfers: Array<{ amount: unknown }> =
      params.normalisedParams?.hbarTransfers ?? [];
    const outgoing = sumOutgoing(transfers);
    return this.spent + outgoing > this.limit;
  }

  async postToolExecutionHook(
    params: PostSecondaryActionParams,
    method: string
  ): Promise<void> {
    await super.postToolExecutionHook(params, method);
    if (!this.relevantTools.includes(method as (typeof this.relevantTools)[number])) return;
    const transfers: Array<{ amount: unknown }> =
      params.normalisedParams?.hbarTransfers ?? [];
    const outgoing = sumOutgoing(transfers);
    if (outgoing <= 0) return;
    const today = this.today();
    this.ledger.set(today, (this.ledger.get(today) ?? 0) + outgoing);
  }
}
