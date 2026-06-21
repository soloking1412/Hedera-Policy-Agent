import {
  Client,
  PrivateKey,
  AccountCreateTransaction,
  Hbar,
  AccountId,
} from "@hiero-ledger/sdk";
import * as dotenv from "dotenv";
import { writeFileSync, existsSync, readFileSync } from "fs";

dotenv.config({ path: ".env.local" });

async function main() {
  if (!process.env.HEDERA_ACCOUNT_ID || !process.env.HEDERA_PRIVATE_KEY) {
    console.error("Missing HEDERA_ACCOUNT_ID or HEDERA_PRIVATE_KEY in .env.local");
    process.exit(1);
  }

  const client = Client.forTestnet().setOperator(
    process.env.HEDERA_ACCOUNT_ID,
    PrivateKey.fromStringECDSA(process.env.HEDERA_PRIVATE_KEY)
  );

  const names = ["weather", "news", "translate", "premium"];
  const accounts: Record<string, string> = {};

  for (const name of names) {
    const key = PrivateKey.generateECDSA();
    const tx = await new AccountCreateTransaction()
      .setKey(key.publicKey)
      .setInitialBalance(new Hbar(1))
      .execute(client);

    const receipt = await tx.getReceipt(client);
    const accountId = receipt.accountId as AccountId;
    accounts[name] = accountId.toString();
    console.log(`Created ${name} provider: ${accountId.toString()}`);
  }

  const envContent = [
    `PROVIDER_WEATHER_ACCOUNT=${accounts["weather"]}`,
    `PROVIDER_NEWS_ACCOUNT=${accounts["news"]}`,
    `PROVIDER_TRANSLATE_ACCOUNT=${accounts["translate"]}`,
    `PROVIDER_PREMIUM_ACCOUNT=${accounts["premium"]}`,
  ].join("\n");

  const envFile = ".env.local";
  const existing = existsSync(envFile) ? readFileSync(envFile, "utf8") : "";

  const cleaned = existing
    .split("\n")
    .filter((l: string) => !l.startsWith("PROVIDER_"))
    .join("\n");

  writeFileSync(envFile, cleaned + "\n" + envContent + "\n");
  console.log("\n.env.local updated with provider accounts.");
  console.log("Run: npm run dev");

  client.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
