import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Deterministic pseudo-chain VID generator (prefix + base58 of hash)
export function generateVIDFromSeed(seed: string): string {
  const encoder = new TextEncoder();
  const data = encoder.encode(seed);
  let h1 = 0x811c9dc5;
  let h2 = 0x811c9dc5 ^ 0xdeadbeef;
  for (let i = 0; i < data.length; i++) {
    h1 ^= data[i];
    h1 = Math.imul(h1, 16777619);
    h2 ^= data[i] + i;
    h2 = Math.imul(h2, 2246822519) ^ (h2 >>> 13);
  }
  const bytes = new Uint8Array(8);
  const dv = new DataView(bytes.buffer);
  dv.setUint32(0, h1 >>> 0);
  dv.setUint32(4, h2 >>> 0);
  const alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  let x = 0n;
  for (let i = 0; i < bytes.length; i++) x = (x << 8n) + BigInt(bytes[i]);
  let out = "";
  while (x > 0n) {
    const r = Number(x % 58n);
    x = x / 58n;
    out = alphabet[r] + out;
  }
  return `vid:${out.padStart(11, '1')}`;
}

export async function getWalletAddress(): Promise<string | null> {
  // Optional: derive from injected EVM wallet if present
  const eth = (window as any)?.ethereum;
  if (!eth) return null;
  try {
    const accounts: string[] = await eth.request({ method: "eth_requestAccounts" });
    return accounts?.[0] ?? null;
  } catch {
    return null;
  }
}

export async function generateUserVIDFallback(userSeedParts: Array<string | undefined | null>): Promise<string> {
  const seed = userSeedParts.filter(Boolean).join("|");
  const addr = await getWalletAddress();
  return generateVIDFromSeed(addr ? `${seed}|${addr.toLowerCase()}` : seed);
}