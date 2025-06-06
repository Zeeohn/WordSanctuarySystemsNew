"use strict";
import React from "react";
// import { FaArrowTrendDown } from "react-icons/fa6";
// import { FaArrowTrendUp } from "react-icons/fa6";
import { navigate } from "@/app/actions";
import { extractIndividualNameAndLeadership } from "@/helpers/stateHandlers";
import { DepartmentalProfile } from "@/types/department";

interface DepartmentMembersTableProps {
  department: DepartmentalProfile[];
}

const handleView = (request) => {
  navigate(`/dashboard/onboard/department/department-details?id=${request.id}`);
};

const IndividualsTable: React.FC<DepartmentMembersTableProps> = ({
  department,
}) => {
  // const TrendIcon = ({ trend }: { trend: "up" | "down" }) => {
  //   if (trend === "up") {
  //     return <FaArrowTrendUp className="w-4 h-4 text-green-500" />;
  //   }
  //   return <FaArrowTrendDown className="w-4 h-4 text-red-500" />;
  // };

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
              Installation
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
              key={member?.name + index}
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

export default IndividualsTable;
