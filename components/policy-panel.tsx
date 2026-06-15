"use client";

import { useEffect, useState } from "react";

interface StatusData {
  policies: {
    spendLimit: { maxPerTx: number; unit: string };
    dailyBudget: { limit: number; spent: number; remaining: number };
    allowedCounterparties: { count: number };
  };
  services: Array<{
    id: string;
    name: string;
    account: string;
    priceHbar: number;
    category: string;
  }>;
}

function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = Math.min(100, (value / max) * 100);
  const color = pct >= 90 ? "#ef5959" : pct >= 60 ? "#efb659" : "#8259ef";
  return (
    <div className="mt-2 h-1.5 rounded-full bg-[#2a2a2a] overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </div>
  );
}

function PolicyCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-[#2a2a2a] rounded-lg p-3">
      <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-2">
        {title}
      </p>
      {children}
    </div>
  );
}

export function PolicyPanel() {
  const [data, setData] = useState<StatusData | null>(null);

  const fetchStatus = () => {
    fetch("/api/status")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {});
  };

  useEffect(() => {
    fetchStatus();
    const id = setInterval(fetchStatus, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-[#2a2a2a] px-4 py-3">
        <h2 className="text-sm font-medium text-gray-300">Policy Dashboard</h2>
        <p className="text-xs text-gray-500 mt-0.5">Live enforcement status</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        {data ? (
          <>
            <PolicyCard title="Spend Limit">
              <p className="text-sm text-gray-200">
                Max{" "}
                <span className="font-mono text-[#8259ef]">
                  {data.policies.spendLimit.maxPerTx}
                </span>{" "}
                HBAR per transaction
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Blocks any single transfer that exceeds this threshold before
                execution
              </p>
            </PolicyCard>

            <PolicyCard title="Daily Budget">
              <div className="flex justify-between items-baseline">
                <p className="text-sm text-gray-200">
                  <span className="font-mono text-[#8259ef]">
                    {data.policies.dailyBudget.spent.toFixed(2)}
                  </span>{" "}
                  /{" "}
                  <span className="font-mono">
                    {data.policies.dailyBudget.limit}
                  </span>{" "}
                  HBAR
                </p>
                <p className="text-xs text-gray-500">
                  {data.policies.dailyBudget.remaining.toFixed(2)} remaining
                </p>
              </div>
              <ProgressBar
                value={data.policies.dailyBudget.spent}
                max={data.policies.dailyBudget.limit}
              />
            </PolicyCard>

            <PolicyCard title="Allowed Counterparties">
              <p className="text-xs text-gray-500 mb-2">
                Only these accounts can receive funds
              </p>
              <div className="flex flex-col gap-1.5">
                {data.services.map((s) => (
                  <div key={s.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-300">{s.name}</p>
                      <p className="text-[10px] font-mono text-gray-600">
                        {s.account}
                      </p>
                    </div>
                    <p className="text-xs font-mono text-[#8259ef]">
                      {s.priceHbar} ℏ
                    </p>
                  </div>
                ))}
              </div>
            </PolicyCard>

            <div className="mt-auto pt-3 border-t border-[#2a2a2a]">
              <p className="text-[10px] text-gray-600">
                Policies enforced via Hedera Agent Kit hooks at the
                PostParamsNormalization lifecycle stage
              </p>
            </div>
          </>
        ) : (
          <div className="text-xs text-gray-500 animate-pulse">
            Loading policy status...
          </div>
        )}
      </div>
    </div>
  );
}
