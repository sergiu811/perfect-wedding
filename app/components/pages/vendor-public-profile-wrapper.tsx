import React from "react";
import { VendorPublicProfile } from "./vendor-public-profile";

interface VendorPublicProfileWrapperProps {
  vendorId: string;
}

export const VendorPublicProfileWrapper = ({
  vendorId,
}: VendorPublicProfileWrapperProps) => {
  return <VendorPublicProfile vendorId={vendorId} />;
};


