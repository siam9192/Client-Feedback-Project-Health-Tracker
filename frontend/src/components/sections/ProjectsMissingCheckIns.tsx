"use client";

import useQuery from "@/hooks/useQuery";
import { getMissingRecentCheckinsProjects } from "@/services/api/project.api.service";
import { Project, ProjectStatus } from "@/types/project.type";
import { IResponse } from "@/types/response.type";
import { formatEnumLabel, getProjectStatusColor, getTotalPages } from "@/utils/helpers";
import Pagination from "../ui/Pagination";
import { useState } from "react";
import SkeletonRow from "../ui/SkeletonRow";

function formatEmployees(names: string[], max = 3) {
  if (names.length <= max) return names.join(", ");

  const visible = names.slice(0, max).join(", ");
  const remaining = names.length - max;

  return `${visible} +${remaining} others`;
}

function ProjectsMissingCheckIns() {
  const [page, setPage] = useState(1);

  const { data, isLoading, refetch } = useQuery<IResponse<Project[]>>(
    "missing-checkin-projects",
    () => getMissingRecentCheckinsProjects({ page }),
  );

  const projects = data?.data ?? [];
  const meta = data?.meta;

  const handelPageChange = (page: number) => {
    setPage(page);
    setTimeout(() => {
      refetch();
    });
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mt-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">No Check-ins Last 14 Days</h2>
        <span className="text-sm text-gray-500">Total: {meta?.totalResults}</span>
      </div>

      {isLoading ? (
        <div className="overflow-x-auto custom-scrollbar">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Project</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Client</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Employees</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Status</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Progress</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Last Check-in</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {Array.from({ length: 5 }).map((_, idx) => (
                <SkeletonRow dataCount={6} key={idx} />
              ))}
            </tbody>
          </table>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-10 text-gray-500"> No projects are missing check-ins</div>
      ) : (
        <div>
          <div className="overflow-x-auto custom-scrollbar">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Project</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Client</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Employees</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Progress</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Last Check-in</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 font-secondary">
                {projects.map((project) => {
                  const employeeNames = project.employees.map((e) => e.name);

                  return (
                    <tr key={project._id} className="hover:bg-gray-50">
                      {/* Project */}
                      <td className="min-w-xs max-md px-4 py-3 font-medium text-gray-800">
                        {project.name}
                      </td>

                      {/* Client */}
                      <td className="min-w-xs px-4 py-3 text-gray-700">{project.client.name}</td>

                      {/* Employees */}
                      <td
                        className="min-w-xs max-md px-4 py-3 text-gray-700"
                        title={employeeNames.join(", ")}
                      >
                        {formatEmployees(employeeNames, 3)}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            project.status === ProjectStatus.CRITICAL
                              ? "bg-red-100 text-red-700"
                              : project.status === ProjectStatus.AT_RISK
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-green-100 text-green-700"
                          }`}
                        >
                          {formatEnumLabel(project.status)}
                        </span>
                      </td>

                      {/* Progress */}
                      <td className="px-4 py-3 w-48">
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full ${getProjectStatusColor(project.status)}`}
                            style={{ width: `${project.progressPercentage}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-600">{project.progressPercentage}%</span>
                      </td>

                      {/* Last Check-in */}
                      <td>
                        {project.lastCheckInAt ? (
                          <>
                            {" "}
                            {new Date(project.lastCheckInAt).toLocaleDateString()},
                            {new Date(project.lastCheckInAt).toLocaleTimeString()}{" "}
                          </>
                        ) : (
                          "Unspecified"
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {meta ? (
            <Pagination
              totalPages={getTotalPages(meta.totalResults, meta.limit)}
              page={page}
              onPageChange={handelPageChange}
            />
          ) : null}
        </div>
      )}
    </div>
  );
}

export default ProjectsMissingCheckIns;
