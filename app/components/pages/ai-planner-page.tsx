import React from "react";
import { Sparkles } from "lucide-react";
import { Button } from "~/components/ui/button";
import { PageContainer, SectionTitle } from "~/components/common";

export const AIPlanner = () => {
  return (
    <PageContainer className="p-6 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="h-8 w-8 text-rose-600" />
          <SectionTitle>AI Wedding Planner</SectionTitle>
        </div>
        <p className="text-gray-600 text-lg leading-relaxed mb-8">
          Let our AI help you plan your perfect wedding. Answer a few questions
          and get personalized recommendations.
        </p>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Coming Soon</h3>
          <p className="text-gray-600 mb-6">
            Our AI-powered wedding planner is currently in development. Sign up
            to be notified when it launches!
          </p>
          <Button className="bg-rose-600 hover:bg-rose-700 text-white">
            Notify Me
          </Button>
        </div>
      </div>
    </PageContainer>
  );
};
