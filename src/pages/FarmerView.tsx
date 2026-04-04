import { useState } from "react";
import FarmerDashboard from "@/components/FarmerDashboard";
import ChatWidget from "@/components/ChatWidget";
import { Farmer } from "@/services/api.client";

const FarmerView = () => {
  // Sample farmer data - In production, this would come from user login/profile
  const [farmer] = useState<Farmer>({
    id: "farmer-001",
    name: "राज कुमार",
    email: "raj@farm.in",
    phone: "9876543210",
    district: "Nashik",
    state: "Maharashtra",
    cropType: "wheat",
    farmSize: 5,
    latitude: 19.994,
    longitude: 73.7997,
    language: "hi", // Hindi
  });

  return (
    <div className="flex min-h-screen w-full">
      <FarmerDashboard farmer={farmer} />
      <ChatWidget farmer={farmer} />
    </div>
  );
};

export default FarmerView;
