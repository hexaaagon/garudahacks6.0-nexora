import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  // Auth logic is now handled in middleware
  // This page only shows for unauthenticated users

  // Show home page for unauthenticated users
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-gray-900">Nexora</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/sign-in">
                <Button variant="outline">Sign In</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Welcome to <span className="text-indigo-600">Nexora</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Your comprehensive educational platform connecting students and
            teachers in a seamless learning environment.
          </p>

          <div className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center">
            <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:inline-flex">
              <Link href="/auth/sign-in">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started
                </Button>
              </Link>
              <Link href="/">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-24">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-4xl mb-4">🎓</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                For Students
              </h3>
              <p className="text-gray-600">
                Access your courses, submit assignments, track grades, and
                communicate with teachers.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-4xl mb-4">👨‍🏫</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                For Teachers
              </h3>
              <p className="text-gray-600">
                Create assignments, manage classes, grade students, and monitor
                progress.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Secure Access
              </h3>
              <p className="text-gray-600">
                Role-based authentication ensures users only access their
                designated portals.
              </p>
            </div>
          </div>
        </div>

        {/* Auto-redirect Notice */}
        <div className="mt-16 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-blue-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Already signed in?
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  If you&apos;re already authenticated, you&apos;ll be
                  automatically redirected to your portal:
                </p>
                <ul className="list-disc list-inside mt-1">
                  <li>Students will be redirected to the Student Portal</li>
                  <li>Teachers will be redirected to the Teacher Portal</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500 text-sm">
            <p>&copy; 2025 Nexora Educational Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
