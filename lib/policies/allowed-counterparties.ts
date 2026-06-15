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

export class AllowedCounterpartiesPolicy extends AbstractPolicy {
  name = "Allowed Counterparties";
  description = "Blocks transfers to accounts not in the whitelist";
  relevantTools = [coreAccountPluginToolNames.TRANSFER_HBAR_TOOL];

  constructor(private readonly whitelist: Set<string>) {
    super();
  }

  protected shouldBlockPostParamsNormalization(
    params: PostParamsNormalizationParams,
    _method: string
  ): boolean {
    const transfers: Array<{ accountId: unknown; amount: unknown }> =
      params.normalisedParams?.hbarTransfers ?? [];

    const recipients = transfers.filter((t) => toHbarNumber(t.amount) > 0);

    return recipients.some((t) => {
      const id = String(t.accountId);
      return !this.whitelist.has(id);
    });
  }
}
