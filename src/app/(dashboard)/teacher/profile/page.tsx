import DashboardLayout from "@/components/layout/dashboard-layout";
import { getServerUser } from "@/lib/auth/server-utils";

export default async function TeacherDashboard() {
  const user = await getServerUser();
  // Get user info (auth and role checking handled by template)const user = await getServerUser();

  return (
    <DashboardLayout userRole="teacher">
      <div className="max-w-xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">
          Profile Settings
        </h2>
        <form>
          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-1 text-gray-800"
              htmlFor="name"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              defaultValue={user?.email || " "}
              className="w-full border border-gray-300 px-3 py-2 rounded bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400"
              disabled
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-1 text-gray-800"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={user?.email || ""}
              className="w-full border border-gray-300 px-3 py-2 rounded bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400"
              disabled
            />
          </div>
          {/* Add more profile settings fields here */}
          <button
            type="submit"
            className="bg-gray-900 text-white px-4 py-2 rounded-md mt-2 shadow hover:bg-gray-800 transition-all duration-200 font-semibold"
            disabled
          >
            Save Changes
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
