import { getServerUser } from "@/lib/auth/server-utils";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { StudentAssignmentsContent } from "@/components/student/student-assignments-content";

export default async function StudentAssignmentsPage() {
  const user = await getServerUser();

  if (!user) return <div>Loading...</div>;

  return (
    <div className="py-8 px-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-900">Assignments</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-700">You have no assignments yet.</p>
      </div>
    </div>
  );
}
