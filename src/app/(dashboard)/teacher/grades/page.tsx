import DashboardLayout from "@/components/layout/dashboard-layout";

const dummyGrades = [
  { student: "jonathan", subject: "Math", grade: "A" },
  { student: "josuke", subject: "Science", grade: "B+" },
  { student: "joseph", subject: "History", grade: "A-" },
];

export default function Grades() {
  return (
    <DashboardLayout userRole="teacher">
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Grades</h2>
        <table className="w-full text-left border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 font-semibold text-gray-800 border-b border-gray-200">
                Student
              </th>
              <th className="py-2 px-4 font-semibold text-gray-800 border-b border-gray-200">
                Subject
              </th>
              <th className="py-2 px-4 font-semibold text-gray-800 border-b border-gray-200">
                Grade
              </th>
            </tr>
          </thead>
          <tbody>
            {dummyGrades.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b border-gray-100 text-gray-900">
                  {row.student}
                </td>
                <td className="py-2 px-4 border-b border-gray-100 text-gray-900">
                  {row.subject}
                </td>
                <td className="py-2 px-4 border-b border-gray-100 text-gray-900">
                  {row.grade}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
