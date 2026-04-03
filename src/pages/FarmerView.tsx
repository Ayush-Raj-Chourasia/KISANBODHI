import FarmerDashboard from "@/components/FarmerDashboard";
import ChatWidget from "@/components/ChatWidget";

const FarmerView = () => {
  return (
    <div className="flex min-h-screen w-full">
      <FarmerDashboard />
      <ChatWidget />
    </div>
  );
};

export default FarmerView;
