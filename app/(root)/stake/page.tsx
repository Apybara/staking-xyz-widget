import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stake | Staking.xyz",
  description: "Your portal to staking",
};

export default function Stake() {
  return (
    <div style={{ marginTop: "5rem" }}>
      <h1>Stake view</h1>

      <nav style={{ marginTop: "5rem" }}>
        <Link href="/">Back to home</Link>
      </nav>
    </div>
  );
}
