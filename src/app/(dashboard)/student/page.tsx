import { getServerUser } from "@/lib/auth/server-utils";
import { StudentDashboardContent } from "@/components/student/student-dashboard-content";

export default async function StudentDashboard() {
  const user = await getServerUser();

  if (!user) return <div>Loading...</div>;

  return (
    <>
      <StudentDashboardContent user={user} />
    </>
  );
}
