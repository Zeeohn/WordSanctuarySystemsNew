import React from "react";
import { navigate } from "@/app/actions";
import { extractIndividualNameAndLeadership } from "@/helpers/stateHandlers";
import { TIndividualProfile } from "@/components/forms/individuals/IndividualOnboardingFormSchema";

interface DepartmentMembersTableProps {
  department: TIndividualProfile[];
}

const handleView = (request: TIndividualProfile) => {
  navigate(
    `/dashboard/onboard/department/department-details?id=${request.profile_id}`
  );
};

const DepartmentTable: React.FC<DepartmentMembersTableProps> = ({
  department,
}) => {
  return (
    <div className="max-w-xl mx-auto p-">
      <table className="w-full border-collapse bg-white rounded-lg overflow-hidden">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left py-3 px-2 font-medium text-gray-700">
              S/N
            </th>
            <th className="text-left py-3 px-3 font-medium text-gray-700">
              Name
            </th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">
              Email
            </th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">
              Life Class
            </th>
            <th
              className="text-left py-3 px-4 font-medium text-gray-700"
              aria-label="Actions"
            ></th>
          </tr>
        </thead>
        <tbody>
          {department.map((member, index) => (
            <tr
              key={member?.profile_id + index}
              className="border-t border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <td className="py-3 px-4 text-gray-900">{index + 1}</td>
              <td className="py-3 px-4 text-gray-900">
                {extractIndividualNameAndLeadership(member)}
              </td>
              <td className="py-3 px-4 text-gray-600">{member.email}</td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <span className="text-gray-900">
                    {member.lifeclass_topic}
                  </span>
                </div>
              </td>
              <td className="py-3 px-3">
                <button
                  className="px-3 py-1 text-sm text-white bg-[#3A2D4A] rounded-full transition-colors"
                  aria-label={`View ${member.name} department details`}
                  onClick={() => handleView(member)}
                >
                  view
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DepartmentTable;
