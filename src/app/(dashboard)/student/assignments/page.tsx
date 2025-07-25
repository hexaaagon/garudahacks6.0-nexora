import { getServerUser } from "@/lib/auth/server-utils";
import { StudentAssignmentsContent } from "@/components/student/student-assignments-content";

export default async function StudentAssignmentsPage() {
  const user = await getServerUser();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return <StudentAssignmentsContent user={user} />;
}
