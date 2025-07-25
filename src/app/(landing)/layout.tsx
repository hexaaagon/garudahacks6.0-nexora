import { Navbar } from "@/components/layout/navbar";
import { ScrollToTop } from "@/components/app/scroll-to-top";

const landingLinks = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#benefits", label: "Benefits" },
];

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      <Navbar
        variant="landing"
        links={landingLinks}
        brandName="Claisse"
        showAuth={true}
      />
      {children}
      <ScrollToTop />
    </div>
  );
}
