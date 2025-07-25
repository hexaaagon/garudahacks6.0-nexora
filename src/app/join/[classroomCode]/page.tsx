import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/auth/server-utils";

interface JoinPageProps {
  params: Promise<{
    classroomCode: string;
  }>;
}

export default async function JoinClassroomPage({ params }: JoinPageProps) {
  const user = await getServerUser();
  const { classroomCode } = await params;

  if (!user) {
    // If not authenticated, redirect to sign in with return URL
    return redirect(`/auth/sign-in?returnTo=/join/${classroomCode}`);
  }

  // If authenticated, redirect to student dashboard with the classroom code as a parameter
  // The dashboard can then show a join dialog with the code pre-filled
  return redirect(`/student?join=${classroomCode}`);
}
