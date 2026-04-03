import AgentSidebar from "@/components/AgentSidebar";
import FarmerDashboard from "@/components/FarmerDashboard";
import ChatWidget from "@/components/ChatWidget";

const DeveloperView = () => {
  return (
    <div className="flex min-h-screen w-full">
      <AgentSidebar />
      <FarmerDashboard />
      <ChatWidget />
    </div>
  );
};

export default DeveloperView;
