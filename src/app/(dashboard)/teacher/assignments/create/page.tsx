"use client";

import DashboardLayout from "@/components/layout/dashboard-layout";
import { useRef, useState } from "react";

export default function Assignment() {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const form = formRef.current;
    if (!form) return;
    const data = {
      title: (form.elements.namedItem("title") as HTMLInputElement)?.value,
      description: (
        form.elements.namedItem("description") as HTMLTextAreaElement
      )?.value,
      due: (form.elements.namedItem("due") as HTMLInputElement)?.value,
    };
    setLoading(true);
    try {
      const res = await fetch("/api/student/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to save assignment");
      alert("Assignment saved to database!");
      form.reset();
    } catch (err) {
      alert("Failed to save assignment.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardLayout userRole="teacher">
      <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">
          Create Assignment
        </h2>
        <form ref={formRef} onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-800 mb-1"
            >
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              className="w-full border border-gray-300 px-3 py-2 rounded bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400"
              placeholder="Assignment title"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-800 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              className="w-full border border-gray-300 px-3 py-2 rounded bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400"
              rows={4}
              placeholder="Assignment description"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="due"
              className="block text-sm font-medium text-gray-800 mb-1"
            >
              Due Date
            </label>
            <input
              id="due"
              name="due"
              type="date"
              className="w-full border border-gray-300 px-3 py-2 rounded bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>
          <button
            type="submit"
            className="bg-gray-900 text-white px-4 py-2 rounded-md shadow hover:bg-gray-800 transition-all duration-200 font-semibold"
            disabled={loading}
          >
            {loading ? "Saving..." : "Create Assignment"}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
