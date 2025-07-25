import { getServerUser } from "@/lib/auth/server-utils";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { TeacherHomeworkContent } from "@/components/teacher/teacher-homework-content";

export default async function TeacherHomeworkPage() {
  const user = await getServerUser();

  if (!user) return <div>Loading...</div>;

  return (
    <DashboardLayout userRole="teacher">
      <TeacherHomeworkContent user={user} />
    </DashboardLayout>
  );
}
