"use client";
import { DashboardSummary } from "@/types";
import DashboardSummaryCard from "../ui/DashboardSummaryCard";
import { Users, FolderKanban, Clock, AlertOctagon } from "lucide-react";
import { IResponse } from "@/types/response.type";
import { getDashboardSummary } from "@/services/api/metadata.api.service";
import useQuery from "@/hooks/useQuery";
import { AdminDashboardSummary as TAdminDashboardSummary } from "@/types/metadata.type";

function AdminDashboardSummary() {
  const { data } = useQuery<IResponse<TAdminDashboardSummary>>("dashboard-summary", () =>
    getDashboardSummary(),
  );

  const mainData = data?.data;

  const summary: DashboardSummary[] = [
    {
      label: "Users",
      value: mainData?.users ?? 0,
      icon: Users,
    },
    {
      label: "Active Projects",
      value: mainData?.activeProjects ?? 0,
      icon: FolderKanban,
    },
    {
      label: "Pending Projects",
      value: mainData?.pendingProjects ?? 0,
      icon: Clock,
    },
    {
      label: "High Risk Projects",
      value: mainData?.highRiskProjects ?? 0,
      icon: AlertOctagon,
    },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {summary.map((d) => (
          <DashboardSummaryCard key={d.label} data={d} />
        ))}
      </div>
    </div>
  );
}

export default AdminDashboardSummary;
