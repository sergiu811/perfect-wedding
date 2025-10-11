import React from "react";
import { PageContainer, SectionTitle } from "~/components/common";

export const MorePage = () => {
  return (
    <PageContainer className="p-6 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <SectionTitle>More Options</SectionTitle>
        <p className="text-gray-600 text-lg leading-relaxed">
          Additional settings and information.
        </p>
      </div>
    </PageContainer>
  );
};
