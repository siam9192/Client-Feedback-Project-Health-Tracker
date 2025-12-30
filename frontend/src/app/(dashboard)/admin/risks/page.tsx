"use client";

import RiskCard from "@/components/ui/RiskCard";
import RiskCardSkeleton from "@/components/ui/RiskCardSkeleton";
import useQuery from "@/hooks/useQuery";
import { getRisks } from "@/services/api/risk.api.service";
import { IResponse } from "@/types/response.type";
import { ProjectRisk, ProjectRiskSeverity } from "@/types/risk.type";
import { useEffect, useState } from "react";
import Pagination from "@/components/ui/Pagination";
import { formatEnumLabel, getTotalPages } from "@/utils/helpers";

const severities = [
  { label: "All", value: "" },
  ...Object.values(ProjectRiskSeverity).map((_) => ({
    label: formatEnumLabel(_),
    value: _,
  })),
];

export default function ProjectRisksPage() {
  const [page, setPage] = useState(1);
  const [severity, setSeverity] = useState("");

  const { data, isLoading, refetch } = useQuery<IResponse<ProjectRisk[]>>("risks", () =>
    getRisks({ page, severity }),
  );

  const risks = data?.data ?? [];
  const meta = data?.meta;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  useEffect(() => {
    if (!isLoading) refetch();
  }, [page, severity]);

  return (
    <div className="space-y-6">
      {/* Page Heading */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">Project Risks</h1>
        <p className="text-sm text-gray-500">Track, assess, and mitigate project risks</p>
      </div>
      <div className="mb-10 flex justify-end">
        <div className="inline-flex rounded-xl bg-base-200 p-1 shadow-sm font-secondary">
          {severities.map((sv) => {
            const isActive = sv.value === severity;

            return (
              <button
                key={sv.label}
                onClick={() => setSeverity(sv.value)}
                className={`
            px-4 py-2 text-sm font-medium rounded-lg transition-all
            focus:outline-none focus-visible:ring-2 focus-visible:ring-primary
            ${
              isActive
                ? "bg-primary text-primary-content shadow"
                : "text-base-content hover:bg-base-300"
            }
          `}
              >
                {sv.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Risks List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 min-h-[200px]">
        {isLoading ? (
          Array.from({ length: 10 }).map((_, index) => <RiskCardSkeleton key={index} />)
        ) : (meta?.totalResults ?? 0 > 0) ? (
          risks.map((risk) => <RiskCard key={risk._id} risk={risk} />)
        ) : (
          <div className="col-span-full text-center text-gray-400 py-20">
            No risks found for this project.
          </div>
        )}
      </div>

      {/* Pagination */}
      {meta && risks.length > 0 && (
        <Pagination
          page={page}
          totalPages={getTotalPages(meta.totalResults, meta.limit)}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
