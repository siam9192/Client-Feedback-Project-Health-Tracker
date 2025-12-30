"use client";

import AssignedProjectCard from "@/components/ui/AssignedProjectCard";
import PageHeading from "@/components/ui/PageHeading";
import Pagination from "@/components/ui/Pagination";
import ProjectCardSkeleton from "@/components/ui/ProjectCardSkeleton";
import useQuery from "@/hooks/useQuery";
import { getAssignedProjects } from "@/services/api/project.api.service";
import { AssignedProject } from "@/types/project.type";
import { IResponse } from "@/types/response.type";
import { UserRole } from "@/types/user.type";
import { getTotalPages } from "@/utils/helpers";
import { useState } from "react";

function Page() {
  const [page, setPage] = useState(1);

  const { data, isLoading, refetch } = useQuery<IResponse<AssignedProject[]>>(
    "project-health-groups",
    () => getAssignedProjects({ page }),
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
    <div>
      <PageHeading title="Assigned Projects" subtitle="Projects that assigned to you by admin" />

      {/* Project List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 min-h-[200px]">
        {isLoading ? (
          Array.from({ length: 10 }).map((_, index) => <ProjectCardSkeleton key={index} />)
        ) : (meta?.totalResults ?? 0 > 0) ? (
          projects.map((project) => (
            <AssignedProjectCard key={project._id} project={project} role={UserRole.EMPLOYEE} />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-400 py-20">
            No risks found for this project.
          </div>
        )}
      </div>

      {/* Pagination */}
      {meta && meta.totalResults > 0 && (
        <Pagination
          page={page}
          totalPages={getTotalPages(meta.totalResults, meta?.limit)}
          onPageChange={handelPageChange}
        />
      )}
    </div>
  );
}

export default Page;
