import { getServerUser } from "@/lib/auth/server-utils";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { StudentClassesContent } from "@/components/student/student-classes-content";

export default async function StudentClassesPage() {
  const user = await getServerUser();

  if (!user) return <div>Loading...</div>;

  return (
    <DashboardLayout userRole="student">
      <StudentClassesContent user={user} />
    </DashboardLayout>
  );
}
