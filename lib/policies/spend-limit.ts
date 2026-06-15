import {
  AbstractPolicy,
  type PostParamsNormalizationParams,
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

export class SpendLimitPolicy extends AbstractPolicy {
  name = "Spend Limit";
  description = `Blocks any single transfer exceeding ${this.maxHbar} HBAR`;
  relevantTools = [coreAccountPluginToolNames.TRANSFER_HBAR_TOOL];

  constructor(readonly maxHbar: number) {
    super();
  }

  protected shouldBlockPostParamsNormalization(
    params: PostParamsNormalizationParams,
    _method: string
  ): boolean {
    const transfers: Array<{ accountId: unknown; amount: unknown }> =
      params.normalisedParams?.hbarTransfers ?? [];

    const outgoing = transfers
      .filter((t) => toHbarNumber(t.amount) > 0)
      .reduce((sum, t) => sum + toHbarNumber(t.amount), 0);

    return outgoing > this.maxHbar;
  }
}
