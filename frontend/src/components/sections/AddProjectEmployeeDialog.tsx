"use client";

import useBouncer from "@/hooks/useBouncer";
import useQuery from "@/hooks/useQuery";
import { getEmployees } from "@/services/api/user.api.service";
import { IResponse } from "@/types/response.type";
import { Employee } from "@/types/user.type";
import { DEFAULT_PROFILE_PICTURE } from "@/utils/constant";
import { useState, useEffect } from "react";

interface AddProjectEmployeeDialogProps {
  selectedEmployees?: Employee[];
  onClose: (employee?: Employee) => void;
}

export default function AddProjectEmployeeDialog({
  selectedEmployees = [],
  onClose,
}: AddProjectEmployeeDialogProps) {
  const [value, setValue] = useState("");
  const [searchTerm] = useBouncer(value, 600);
  const [selected, setSelected] = useState<Employee | null>(null);

  const params = {
    searchTerm,
    limit: 20,
    notIn: selectedEmployees.map((e) => e._id).join(",") || "",
  };

  const { data, isLoading, refetch } = useQuery<IResponse<Employee[]>>("employees", () =>
    getEmployees(params),
  );

  const employees = data?.data ?? [];
  const meta = data?.meta;

  useEffect(() => {
    refetch();
  }, [searchTerm]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 relative">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Select Employees</h2>

        {/* Search input */}
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value.trim())}
          placeholder="Search employees..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        {/* Loading skeleton */}
        {isLoading && (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-10 w-full bg-gray-200 rounded-md animate-pulse" />
            ))}
          </div>
        )}

        {/* No employees */}
        {!isLoading && (meta?.totalResults ?? 0) === 0 && (
          <p className="text-center text-gray-400">No employees found.</p>
        )}

        {/* Employee list */}
        {!isLoading && (meta?.totalResults ?? 0) > 0 && (
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {employees.map((employee) => (
              <button
                key={employee._id}
                onClick={() => setSelected(employee)}
                className={`w-full text-left px-4 py-2 rounded-lg hover:bg-indigo-50 flex items-center gap-3 ${
                  selected?._id === employee._id ? "bg-indigo-100 font-semibold" : ""
                }`}
              >
                <img
                  src={DEFAULT_PROFILE_PICTURE}
                  alt=""
                  className="h-10 w-10 rounded-full object-cover outline-2 outline-offset-1 outline-secondary"
                />
                <div>
                  <span>{employee.name}</span>
                  <br />
                  <span className="text-xs text-gray-500">{employee.user?.email}</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Footer buttons */}
        <div className="flex justify-end items-center gap-4 mt-4">
          <button
            onClick={() => onClose()}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            Close
          </button>
          <button
            disabled={!selected}
            onClick={() => onClose(selected!)}
            className="px-4 py-2 rounded-lg disabled:bg-gray-400 bg-indigo-600 text-white hover:bg-indigo-700 transition"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
