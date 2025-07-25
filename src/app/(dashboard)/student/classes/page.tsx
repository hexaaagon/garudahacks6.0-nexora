import { getServerUser } from "@/lib/auth/server-utils";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { StudentClassesContent } from "@/components/student/StudentClassesContent";

export default async function StudentClassesPage() {
  const user = await getServerUser();

  if (!user) return <div>Loading...</div>;

  return (
    <DashboardLayout userRole="student">
      <StudentClassesContent user={user} />
    </DashboardLayout>
  );
}
