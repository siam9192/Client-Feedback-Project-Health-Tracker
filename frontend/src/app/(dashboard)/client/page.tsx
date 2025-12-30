import ClientDashboardSummary from "@/components/sections/ClientDashboardSummary";
import LastSubmittedFeedback from "@/components/sections/LastSubmittedFeedback";

function page() {
  return (
    <div>
      <ClientDashboardSummary />
      <LastSubmittedFeedback />
    </div>
  );
}

export default page;
