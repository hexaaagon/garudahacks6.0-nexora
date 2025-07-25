import { getServerUser } from "@/lib/auth/server-utils";
import DashboardLayout from "@/components/layout/dashboard-layout";

export default async function StudentDashboard() {
  // Get user info (auth and role checking handled by template)
  const user = await getServerUser();

  if (!user) return <div>Loading...</div>;

  return (
    <DashboardLayout userRole="student">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Student Dashboard
        </h1>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">
            Welcome, {user?.email}!
          </h2>
          <p className="text-blue-600">
            You are logged in as a <strong>{user.role}</strong>.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-100 rounded-lg p-6 text-center hover:bg-gray-200 transition-colors cursor-pointer">
            <div className="text-3xl mb-3">📚</div>
            <h3 className="text-lg font-semibold mb-2">My Courses</h3>
            <p className="text-gray-600">View your enrolled courses</p>
          </div>

          <div className="bg-gray-100 rounded-lg p-6 text-center hover:bg-gray-200 transition-colors cursor-pointer">
            <div className="text-3xl mb-3">📝</div>
            <h3 className="text-lg font-semibold mb-2">Assignments</h3>
            <p className="text-gray-600">Check pending assignments</p>
          </div>

          <div className="bg-gray-100 rounded-lg p-6 text-center hover:bg-gray-200 transition-colors cursor-pointer">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="text-lg font-semibold mb-2">Grades</h3>
            <p className="text-gray-600">View your academic progress</p>
          </div>

          <div className="bg-gray-100 rounded-lg p-6 text-center hover:bg-gray-200 transition-colors cursor-pointer">
            <div className="text-3xl mb-3">📅</div>
            <h3 className="text-lg font-semibold mb-2">Schedule</h3>
            <p className="text-gray-600">View your class schedule</p>
          </div>

          <div className="bg-gray-100 rounded-lg p-6 text-center hover:bg-gray-200 transition-colors cursor-pointer">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="text-lg font-semibold mb-2">Study Goals</h3>
            <p className="text-gray-600">Track your learning objectives</p>
          </div>

          <div className="bg-gray-100 rounded-lg p-6 text-center hover:bg-gray-200 transition-colors cursor-pointer">
            <div className="text-3xl mb-3">💬</div>
            <h3 className="text-lg font-semibold mb-2">Messages</h3>
            <p className="text-gray-600">Communicate with teachers</p>
          </div>
        </div>

        {/* Upcoming Assignments Section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Upcoming Assignments
          </h2>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white rounded border">
                <div>
                  <h3 className="font-medium">Mathematics Quiz 3</h3>
                  <p className="text-sm text-gray-600">
                    Due: Tomorrow, 11:59 PM
                  </p>
                </div>
                <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  Due Soon
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded border">
                <div>
                  <h3 className="font-medium">History Essay</h3>
                  <p className="text-sm text-gray-600">Due: Friday, 11:59 PM</p>
                </div>
                <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  This Week
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded border">
                <div>
                  <h3 className="font-medium">Physics Lab Report</h3>
                  <p className="text-sm text-gray-600">
                    Due: Next Monday, 11:59 PM
                  </p>
                </div>
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  Next Week
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
