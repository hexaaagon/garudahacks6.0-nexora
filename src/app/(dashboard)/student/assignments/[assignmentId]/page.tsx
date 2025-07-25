import { getServerUser } from "@/lib/auth/server-utils";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { AssignmentQuestionView } from "@/components/student/assignment-question-view";

interface AssignmentPageProps {
  params: {
    assignmentId: string;
  };
}

export default async function AssignmentPage({ params }: AssignmentPageProps) {
  const user = await getServerUser();

  if (!user) return <div>Loading...</div>;

  return (
    <DashboardLayout userRole="student">
      <AssignmentQuestionView user={user} assignmentId={params.assignmentId} />
    </DashboardLayout>
  );
}
