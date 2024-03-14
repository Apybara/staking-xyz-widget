import Link from "next/link";

export default function Home() {
  return (
    <nav style={{ marginTop: "5rem" }}>
      <Link href="/stake">Stake</Link>
    </nav>
  );
}
