import React from "react";
import { VideoProductionCalculator } from "@/components/calculator/VideoProductionCalculator";

const PriceCalculator = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Video Production Price Calculator</h1>
      <VideoProductionCalculator />
    </div>
  );
};

export default PriceCalculator;