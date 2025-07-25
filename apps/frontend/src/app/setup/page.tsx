import { getUserAndSetupStatus } from "@/lib/auth/server-utils";
import { SetupForm } from "@/components/setup/SetupForm";

export default async function SetupPage() {
  // Get user info - consistent with layout
  const { user } = await getUserAndSetupStatus();

  if (!user) {
    // This should not happen due to layout protection, but just in case
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Complete Your Setup
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Welcome! Please complete your profile setup to continue.
          </p>
        </div>
        <SetupForm user={user} />
      </div>
    </div>
  );
}
