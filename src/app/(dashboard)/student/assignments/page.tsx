import { getServerUser } from "@/lib/auth/server-utils";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { StudentAssignmentsContent } from "@/components/student/student-assignments-content";

export default async function StudentAssignmentsPage() {
  const user = await getServerUser();

  if (!user) return <div>Loading...</div>;

  return (
    <DashboardLayout userRole="student">
      <StudentAssignmentsContent user={user} />
    </DashboardLayout>
  );
}
