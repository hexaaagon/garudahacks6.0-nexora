// Force dynamic rendering to prevent static generation issues with middleware
export const dynamic = 'force-dynamic';

export default function LandingPage() {
  return (
    <main>
      <pre>{JSON.stringify(process.env, null, 2)}</pre>
    </main>
  );
}
