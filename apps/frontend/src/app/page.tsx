import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Menu,
  Zap,
  Shield,
  Users,
  BarChart3,
  ArrowRight,
  Twitter,
  Linkedin,
  Github,
  Mail,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-green-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-green-50/95 backdrop-blur supports-[backdrop-filter]:bg-green-50/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">Claiss</span>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="#home"
              className="text-sm font-medium hover:text-green-600 transition-colors"
            >
              Home
            </Link>

            <Link
              href="#features"
              className="text-sm font-medium hover:text-green-600 transition-colors"
            >
              Features
            </Link>

            <Link
              href="#contact"
              className="text-sm font-medium hover:text-green-600 transition-colors"
            >
              Contact
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="hidden md:inline-flex">
              Sign In
            </Button>
            <Button>Get Started</Button>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        id="home"
        className="py-20 md:py-32 bg-gradient-to-br from-green-100 to-emerald-200"
      >
        <div className="container px-4 md:px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="w-fit">
                  🤖 AI-Powered Learning Platform
                </Badge>
                <h1 className="text-4xl font-bold tracking-tight  sm:text-5xl md:text-6xl lg:text-7xl">
                  Smart Learning with{" "}
                  <span className="text-green-600">Claiss</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-[600px]">
                  AI-powered quiz platform that creates unique questions for
                  every student to prevent cheating. Empower teachers with smart
                  tools and give children engaging, personalized learning
                  experiences.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="text-lg px-8 bg-green-600 hover:bg-green-700"
                >
                  Start Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 bg-transparent"
                >
                  Watch Demo
                </Button>
              </div>
            </div>

            <div className="relative">
              <Image
                src="/placeholder.svg?height=600&width=800"
                alt="StreamLine Dashboard"
                width={800}
                height={600}
                className="rounded-xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32">
        <div className="container px-4 md:px-6">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="secondary" className="w-fit mx-auto">
              Features
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Everything educators need to succeed
            </h2>
            <p className="text-xl text-muted-foreground max-w-[800px] mx-auto">
              Powerful AI-driven tools designed to enhance learning, prevent
              cheating, and empower teachers with smart educational technology.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                  <Zap className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>AI Quiz Generation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our AI creates unique questions and answers for each student,
                  ensuring fair assessment and preventing cheating.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100">
                  <Users className="h-6 w-6 text-emerald-600" />
                </div>
                <CardTitle>Teacher Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Comprehensive tools for teachers to create custom quizzes,
                  track student progress, and manage classrooms.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Smart Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Detailed insights into student performance, learning patterns,
                  and areas that need improvement.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
                  <Shield className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle>Anti-Cheating System</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Advanced algorithms ensure academic integrity with randomized
                  questions and secure testing environment.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 md:py-32 bg-green-600 text-white">
        <div className="container px-4 md:px-6 text-center">
          <div className="space-y-8 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Ready to transform learning?
            </h2>
            <p className="text-xl text-green-100">
              Join thousands of teachers who are already using Claiss for free
              to create engaging, cheat-proof quizzes that help students learn
              better.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="text-lg px-8 bg-green-600 hover:bg-green-700"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <p className="text-sm text-green-200">
              100% Free • No credit card required • Start teaching today
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-16">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mx-auto text-center">
            <div>
              <div className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">Claiss</span>
              </div>
              <p className="text-gray-400">
                Claiss is an AI-powered learning platform that helps teachers
                create engaging quizzes and prevents cheating through
                intelligent question generation.
              </p>
              <div className="flex space-x-4">
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-gray-400 hover:text-white"
                >
                  <Twitter className="h-5 w-5" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-gray-400 hover:text-white"
                >
                  <Linkedin className="h-5 w-5" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-gray-400 hover:text-white"
                >
                  <Github className="h-5 w-5" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-gray-400 hover:text-white"
                >
                  <Mail className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} StreamLine. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link
                href="#"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
