import AgentSidebar from "@/components/AgentSidebar";
import FarmerDashboard from "@/components/FarmerDashboard";
import ChatWidget from "@/components/ChatWidget";

const Index = () => {
  return (
    <div className="flex min-h-screen w-full">
      <AgentSidebar />
      <FarmerDashboard />
      <ChatWidget />
    </div>
  );
};

export default Index;
