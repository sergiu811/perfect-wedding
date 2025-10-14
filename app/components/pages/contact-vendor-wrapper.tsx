import React from "react";
import { ContactVendorPage } from "./contact-vendor-page";

interface ContactVendorWrapperProps {
  vendorId: string;
}

export const ContactVendorWrapper = ({ vendorId }: ContactVendorWrapperProps) => {
  // Extract query params from URL
  const params = new URLSearchParams(
    typeof window !== "undefined" ? window.location.search : ""
  );
  const vendorName = params.get("name") || "Vendor";
  const vendorCategory = params.get("category") || "venue";

  return (
    <ContactVendorPage
      vendorId={vendorId}
      vendorName={vendorName}
      vendorCategory={vendorCategory}
    />
  );
};
