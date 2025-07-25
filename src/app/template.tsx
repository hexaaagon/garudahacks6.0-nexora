interface TemplateProps {
  children: React.ReactNode;
}

export default function Template({ children }: TemplateProps) {
  // Auth logic is now handled in middleware
  // This template just renders children
  return <>{children}</>;
}
