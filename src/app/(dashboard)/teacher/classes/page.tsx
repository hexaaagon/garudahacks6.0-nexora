"use client";

import DashboardLayout from "@/components/layout/dashboard-layout";
import { useState } from "react";

const dummyClasses = [
  { name: "Math 101", subject: "Math", students: 30, schedule: "Mon 08:00" },
  {
    name: "Science 201",
    subject: "Science",
    students: 25,
    schedule: "Wed 10:00",
  },
  {
    name: "History 301",
    subject: "History",
    students: 20,
    schedule: "Fri 13:00",
  },
  { name: "Math 201", subject: "Math", students: 28, schedule: "Thu 09:00" },
];

const subjects = Array.from(new Set(dummyClasses.map((cls) => cls.subject)));

export default function Classes() {
  const [selectedSubject, setSelectedSubject] = useState<string>("");

  const filteredClasses = selectedSubject
    ? dummyClasses.filter((cls) => cls.subject === selectedSubject)
    : dummyClasses;

  return (
    <DashboardLayout userRole="teacher">
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Classes</h2>
        <div className="mb-4">
          <label
            className="mr-2 text-gray-800 font-medium"
            htmlFor="subject-filter"
          >
            Filter by Subject:
          </label>
          <select
            id="subject-filter"
            className="border border-gray-300 rounded px-2 py-1"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            <option value="">All</option>
            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>
        <table className="w-full text-left border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 font-semibold text-gray-800 border-b border-gray-200">
                Class Name
              </th>
              <th className="py-2 px-4 font-semibold text-gray-800 border-b border-gray-200">
                Subject
              </th>
              <th className="py-2 px-4 font-semibold text-gray-800 border-b border-gray-200">
                Students
              </th>
              <th className="py-2 px-4 font-semibold text-gray-800 border-b border-gray-200">
                Schedule
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredClasses.map((cls, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b border-gray-100 text-gray-900">
                  {cls.name}
                </td>
                <td className="py-2 px-4 border-b border-gray-100 text-gray-900">
                  {cls.subject}
                </td>
                <td className="py-2 px-4 border-b border-gray-100 text-gray-900">
                  {cls.students}
                </td>
                <td className="py-2 px-4 border-b border-gray-100 text-gray-900">
                  {cls.schedule}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
