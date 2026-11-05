import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found">
      <span>404</span>
      <h1>That page isn’t here.</h1>
      <p>The portfolio is still taking shape. Head back to the project overview.</p>
      <Link href="/">Return home →</Link>
    </main>
  );
}
