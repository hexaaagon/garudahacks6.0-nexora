import { getServerUser } from "@/lib/auth/server-utils";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { TeacherDashboardContent } from "@/components/teacher/teacher-dashboard-content";

export default async function TeacherDashboard() {
  // Get user info (auth and role checking handled by template)
  const user = await getServerUser();

  return (
    <DashboardLayout userRole="teacher">
      <TeacherDashboardContent user={user} />
    </DashboardLayout>
  );
}
