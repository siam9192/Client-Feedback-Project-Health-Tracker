import AdminDashboardSummary from "@/components/sections/AdminDashboardSummary";
import HighRiskProjects from "@/components/sections/HighRiskProjects";
import MissingCheckIns from "@/components/sections/ProjectsMissingCheckIns";

function page() {
  return (
    <div className="w-full">
      <AdminDashboardSummary />
      <MissingCheckIns />
      <HighRiskProjects />
    </div>
  );
}

export default page;
