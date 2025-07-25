import { getServerUser } from "@/lib/auth/server-utils";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { StudentDashboardContent } from "@/components/student/student-dashboard-content";

export default async function StudentDashboard() {
  // Get user info (auth and role checking handled by template)
  const user = await getServerUser();

  if (!user) return <div>Loading...</div>;

  return (
    <DashboardLayout userRole="student">
      <StudentDashboardContent user={user} />
    </DashboardLayout>
  );
}
