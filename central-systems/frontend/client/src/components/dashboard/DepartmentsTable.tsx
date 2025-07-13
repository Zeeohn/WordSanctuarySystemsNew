"use client";
import React from "react";
// import { departments } from "./mock-data/departments";
import { FaArrowTrendDown } from "react-icons/fa6";
import { FaArrowTrendUp } from "react-icons/fa6";
import { Department } from "@/types/general";
import { navigate } from "@/app/actions";

interface DepartmentProps {
  departments: Department[];
}

const handleView = (request) => {
  navigate(`/dashboard/onboard/department/department-details?id=${request.id}`);
};

const DepartmentTable: React.FC<DepartmentProps> = ({ departments }) => {
  const TrendIcon = ({ trend }: { trend: "up" | "down" }) => {
    if (trend === "up") {
      return <FaArrowTrendUp className="w-4 h-4 text-green-500" />;
    }
    return <FaArrowTrendDown className="w-4 h-4 text-red-500" />;
  };

  return (
    <div className="max-w-xl mx-auto p-">
      <table className="w-full border-collapse bg-white rounded-lg overflow-hidden">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left py-3 px-3 font-medium text-gray-700">
              Departments
            </th>
            <th className="text-left py-3 px-2 font-medium text-gray-700">
              Number of members
            </th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">
              KPI Index
            </th>
            <th
              className="text-left py-3 px-4 font-medium text-gray-700"
              aria-label="Actions"
            ></th>
          </tr>
        </thead>
        <tbody>
          {departments.map((dept, index) => (
            <tr
              key={dept.name + index}
              className="border-t border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <td className="py-3 px-4 text-gray-900">{dept.name}</td>
              <td className="py-3 px-4 text-gray-600">{dept.members}</td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <span className="text-gray-900">{dept.kpi}%</span>
                  <TrendIcon trend={dept.trend} />
                </div>
              </td>
              <td className="py-3 px-3">
                <button
                  className="px-3 py-1 text-sm text-white bg-[#3A2D4A] rounded-full transition-colors"
                  aria-label={`View ${dept.name} department details`}
                  onClick={() => handleView(dept)}
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
