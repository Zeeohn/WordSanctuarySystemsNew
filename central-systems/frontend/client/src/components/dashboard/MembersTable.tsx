"use client"
import { Member } from '@/types/general';
import React from 'react'

interface MembersTableProps {
    members: Member[];
    onView: (member: Member) => void;
  }

const MembersTable: React.FC<MembersTableProps> = ({ members, onView }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg overflow-hidden">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Name
            </th>
            <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Installation
            </th>
            <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Position
            </th>
            <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {members.map((member, index) => (
            <tr 
              key={index}
              className="hover:bg-gray-50 transition-colors duration-200"
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {member.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {member.installment}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {member.position}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <button
                  onClick={() => onView(member)}
                  className="bg-[#3A2D4A] text-white px-4 py-1 rounded-md text-sm hover:bg-purple-700 transition-colors duration-200"
                >
                  view
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default MembersTable