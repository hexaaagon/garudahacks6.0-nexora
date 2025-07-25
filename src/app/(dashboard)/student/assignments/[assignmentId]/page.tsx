import { getServerUser } from "@/lib/auth/server-utils";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { AssignmentQuestionView } from "@/components/student/assignment-question-view";

export default async function AssignmentPage({
  params,
}: {
  params: Promise<{
    assignmentId: string;
  }>;
}) {
  const resolvedParams = await params;
  const user = await getServerUser();
  if (!user) return <div>Loading...</div>;

  return (
    <DashboardLayout userRole="student">
      <AssignmentQuestionView
        user={user}
        assignmentId={resolvedParams.assignmentId}
      />
    </DashboardLayout>
  );
}
