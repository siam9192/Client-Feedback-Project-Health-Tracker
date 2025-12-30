"use client";

import useQuery from "@/hooks/useQuery";
import { getHighRiskProjectsWithSummary } from "@/services/api/project.api.service";
import { HighRiskProject } from "@/types/project.type";
import { IResponse } from "@/types/response.type";
import HighRiskProjectCard from "../ui/HighRiskProjectCard";
import HighRiskProjectCardSkeleton from "../ui/HighRiskProjectCardSkeleton";
import { getTotalPages } from "@/utils/helpers";
import Pagination from "../ui/Pagination";
import { useState } from "react";

export default function HighRiskProjects() {
  const [page, setPage] = useState(1);
  const { data, isLoading, refetch } = useQuery<IResponse<HighRiskProject[]>>(
    "high-risk-projects",
    () => getHighRiskProjectsWithSummary({ page }),
  );

  const projects = data?.data ?? [];
  const meta = data?.meta;
  const totalResults = meta?.totalResults ?? 0;
  const handelPageChange = (page: number) => {
    setPage(page);
    setTimeout(() => {
      refetch();
    });
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mt-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">High-Risk Projects Summary</h2>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 5 }).map((_, index) => (
            <HighRiskProjectCardSkeleton key={index} />
          ))}
        </div>
      ) : totalResults === 0 ? (
        <div className="bg-white shadow rounded-lg p-6 mt-6 text-gray-500 text-center">
          🎉 No high-risk projects at the moment
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {projects.map((project) => (
              <HighRiskProjectCard key={project._id} project={project} />
            ))}
          </div>
          {meta ? (
            <Pagination
              totalPages={getTotalPages(totalResults, meta.limit)}
              page={page}
              onPageChange={handelPageChange}
            />
          ) : null}
        </div>
      )}
    </div>
  );
}
