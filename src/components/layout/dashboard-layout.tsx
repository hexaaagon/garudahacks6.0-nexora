"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/middleware/hooks";

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole: "student" | "teacher";
}

export default function DashboardLayout({
  children,
  userRole,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { signOut } = useAuth();

  const studentLinks = [
    { name: "Dashboard", href: "/dashboard/student", icon: "🏠" },
    { name: "My Classes", href: "/dashboard/student/classes", icon: "📚" },
    { name: "Assignments", href: "/dashboard/student/assignments", icon: "📝" },
    { name: "Grades", href: "/dashboard/student/grades", icon: "📊" },
    { name: "Profile", href: "/dashboard/student/profile", icon: "👤" },
  ];

  const teacherLinks = [
    { name: "Dashboard", href: "/dashboard/teacher", icon: "🏠" },
    { name: "My Classes", href: "/dashboard/teacher/classes", icon: "🏫" },
    {
      name: "Create Homework",
      href: "/dashboard/teacher/homework/create",
      icon: "➕",
    },
    { name: "All Homework", href: "/dashboard/teacher/homework", icon: "📋" },
    { name: "Students", href: "/dashboard/teacher/students", icon: "👥" },
    { name: "Profile", href: "/dashboard/teacher/profile", icon: "👤" },
  ];

  const navigation = userRole === "student" ? studentLinks : teacherLinks;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 flex z-40 md:hidden ${
          sidebarOpen ? "" : "hidden"
        }`}
      >
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          onClick={() => setSidebarOpen(false)}
        />
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <SidebarContent
            navigation={navigation}
            userRole={userRole}
            onSignOut={signOut}
          />
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <SidebarContent
          navigation={navigation}
          userRole={userRole}
          onSignOut={signOut}
        />
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        {/* Top navbar */}
        <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gray-50">
          <button
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Page content */}
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

interface NavigationItem {
  name: string;
  href: string;
  icon: string;
}

function SidebarContent({
  navigation,
  userRole,
  onSignOut,
}: {
  navigation: NavigationItem[];
  userRole: string;
  onSignOut: () => void;
}) {
  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <h1 className="text-xl font-bold text-gray-900">
            {userRole === "student" ? "Student Portal" : "Teacher Portal"}
          </h1>
        </div>
        <nav className="mt-5 flex-1 px-2 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
        <div className="flex-shrink-0 w-full group block">
          <div className="flex items-center">
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                {userRole.charAt(0).toUpperCase() + userRole.slice(1)} Account
              </p>
            </div>
          </div>
          <button
            onClick={onSignOut}
            className="mt-2 w-full text-left text-sm text-gray-500 hover:text-gray-700"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
