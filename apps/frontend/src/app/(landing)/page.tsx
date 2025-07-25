export default function LandingPage() {
  return (
    <main>
      <pre>{JSON.stringify(process.env, null, 2)}</pre>
    </main>
  );
}
