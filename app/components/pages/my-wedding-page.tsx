import React from "react";
import { PageContainer, SectionTitle } from "~/components/common";

export const MyWeddingPage = () => {
  return (
    <PageContainer className="p-6 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <SectionTitle>My Wedding</SectionTitle>
        <p className="text-gray-600 text-lg leading-relaxed">
          Plan and manage your wedding details here.
        </p>
      </div>
    </PageContainer>
  );
};
