import DashboardTemplate from "@/components/layout/dashboard-template";

interface TemplateProps {
  children: React.ReactNode;
}

export default function Template({ children }: TemplateProps) {
  return (
    <DashboardTemplate requiredRole="student">{children}</DashboardTemplate>
  );
}
