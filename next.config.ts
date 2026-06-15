import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@hiero-ledger/sdk", "@hashgraph/hedera-agent-kit"],
};

export default nextConfig;
