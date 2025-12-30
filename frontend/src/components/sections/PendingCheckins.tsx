"use client";
import { useState } from "react";
import { getTotalPages } from "@/utils/helpers";
import { PendingCheckIn } from "@/types/employee-checkin.type";
import useQuery from "@/hooks/useQuery";
import { getPendingCheckins } from "@/services/api/employee-checkin.api.service";
import { IResponse } from "@/types/response.type";
import Pagination from "../ui/Pagination";
import PendingCheckinCard from "../ui/PendingCheckinCard";
import PendingCheckinSkeleton from "../ui/PendingCheckinSkeleton";

export default function PendingCheckins() {
  const [page, setPage] = useState(1);

  const { data, isLoading, refetch } = useQuery<IResponse<PendingCheckIn[]>>(
    "missing-checkin-projects",
    () => getPendingCheckins({ page }),
  );

  const checkins = data?.data ?? [];
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
        <h2 className="text-xl font-semibold text-gray-800">Pending Check-ins of Current Week</h2>
        <span className="text-sm text-gray-500">Total: {meta?.totalResults ?? 0}</span>
      </div>

      {isLoading ? (
        <div className="grid  grid-cols-1 lg:grid-cols-2 gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <PendingCheckinSkeleton key={i} />
          ))}
        </div>
      ) : meta?.totalResults === 0 ? (
        <div className="text-center py-10 text-gray-500"> No pending check-ins</div>
      ) : (
        <div>
          <div className="grid  grid-cols-1 lg:grid-cols-2 gap-3">
            {checkins.map((check) => (
              <PendingCheckinCard key={check._id} checkin={check} />
            ))}
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
