"use client";

import { useState } from "react";
import { CheckCircle, Wallet, AlertCircle, Loader2 } from "lucide-react";
import { claimStamp } from "@/lib/actions";
import { shortWallet } from "@/lib/utils";

type ClaimState = "idle" | "connecting" | "claiming" | "claimed" | "error";

interface ClaimBannerProps {
  stampId: string;
  claimedBy?: string;
}

export default function ClaimBanner({ stampId, claimedBy }: ClaimBannerProps) {
  const [state, setState] = useState<ClaimState>(claimedBy ? "claimed" : "idle");
  const [claimedWallet, setClaimedWallet] = useState<string>(claimedBy || "");
  const [errorMsg, setErrorMsg] = useState<string>("");

  // Already claimed — show badge
  if (state === "claimed") {
    return (
      <div className="glass rounded-2xl p-5 mb-6 border border-emerald-500/20 bg-emerald-500/5">
        <div className="flex items-center gap-3">
          <CheckCircle size={18} className="text-emerald-400 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-emerald-300">Claimed</p>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Owned by {shortWallet(claimedWallet)}
            </p>
          </div>
        </div>
      </div>
    );
  }

  async function handleClaim() {
    setErrorMsg("");

    // Step 1: connect wallet
    if (!(window as any).ethereum) {
      setErrorMsg("No wallet detected. Install MetaMask or a browser wallet.");
      setState("error");
      return;
    }

    setState("connecting");

    let wallet: string;
    try {
      const accounts: string[] = await (window as any).ethereum.request({
        method: "eth_requestAccounts",
      });
      if (!accounts || accounts.length === 0) throw new Error("No accounts returned.");
      wallet = accounts[0];
    } catch {
      setErrorMsg("Wallet connection cancelled.");
      setState("error");
      return;
    }

    // Step 2: claim
    setState("claiming");
    const { error } = await claimStamp(stampId, wallet);
    if (error) {
      setErrorMsg(error);
      setState("error");
      return;
    }

    setClaimedWallet(wallet);
    setState("claimed");
  }

  function reset() {
    setState("idle");
    setErrorMsg("");
  }

  const busy = state === "connecting" || state === "claiming";

  return (
    <div className="glass rounded-2xl p-5 mb-6 border border-purple-500/20 bg-purple-500/5">
      {state === "error" ? (
        <div className="flex items-start gap-3">
          <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-300">Claim failed</p>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">{errorMsg}</p>
          </div>
          <button
            onClick={reset}
            className="text-xs text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
          >
            Try again
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-sm font-semibold text-[var(--text)]">Is this your agent?</p>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Connect the agent&apos;s wallet to claim ownership of this stamp.
            </p>
          </div>
          <button
            onClick={handleClaim}
            disabled={busy}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-60 text-white font-semibold text-sm transition-all shrink-0"
          >
            {busy ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                {state === "connecting" ? "Connecting…" : "Claiming…"}
              </>
            ) : (
              <>
                <Wallet size={14} />
                Claim this Stamp
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
