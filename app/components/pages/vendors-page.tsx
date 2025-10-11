import React from "react";
import { PageContainer, SectionTitle } from "~/components/common";

export const VendorsPage = () => {
  return (
    <PageContainer className="p-6 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <SectionTitle>Find Vendors</SectionTitle>
        <p className="text-gray-600 text-lg leading-relaxed">
          Browse through our curated list of wedding vendors.
        </p>
      </div>
    </PageContainer>
  );
};
