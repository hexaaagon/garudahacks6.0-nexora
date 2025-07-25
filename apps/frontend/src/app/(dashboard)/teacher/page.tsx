import { getServerUser } from "@/lib/auth/server-utils";
import DashboardLayout from "@/components/layout/dashboard-layout";

export default async function TeacherDashboard() {
  // Get user info (auth and role checking handled by template)
  const user = await getServerUser();

  return (
    <DashboardLayout userRole="teacher">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Teacher Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome to your teaching portal, {user?.email}!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              My Classes
            </h3>
            <p className="text-gray-600">Manage your classes and students</p>
            <div className="mt-4">
              <span className="text-2xl font-bold text-blue-600">0</span>
              <span className="text-gray-500 ml-1">Active Classes</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Assignments
            </h3>
            <p className="text-gray-600">Create and manage assignments</p>
            <div className="mt-4">
              <span className="text-2xl font-bold text-green-600">0</span>
              <span className="text-gray-500 ml-1">Active Assignments</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Students
            </h3>
            <p className="text-gray-600">Monitor student progress</p>
            <div className="mt-4">
              <span className="text-2xl font-bold text-purple-600">0</span>
              <span className="text-gray-500 ml-1">Total Students</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
              <div className="text-left">
                <h4 className="font-medium text-gray-900">Create New Class</h4>
                <p className="text-sm text-gray-500">
                  Set up a new class for your students
                </p>
              </div>
            </button>

            <button className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
              <div className="text-left">
                <h4 className="font-medium text-gray-900">Create Assignment</h4>
                <p className="text-sm text-gray-500">
                  Design a new assignment or quiz
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
