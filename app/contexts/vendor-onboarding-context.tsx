import React, { createContext, useContext, useState } from "react";

interface VendorOnboardingData {
  // Step 1: Business Identity
  vendorName: string;
  contactPerson: string;
  phoneNumber: string;
  businessDescription: string;
  avatarUrl?: string;

  // Step 2: Business Details
  businessTypes: string[];
  membershipLevel: string;
  website: string;
  yearsExperience: string;

  // Step 3: Service Details
  serviceLocation: string;
  serviceAreas: string;
  priceMin: string;
  priceMax: string;
  availableDays: string[];
  leadTime: string;
  
  // Step 4: Additional Details
  instagram: string;
  facebook: string;
  pinterest: string;
  businessHours: string;
  specialties: string[];
}

interface VendorOnboardingContextType {
  data: VendorOnboardingData;
  updateStep1: (data: Partial<VendorOnboardingData>) => void;
  updateStep2: (data: Partial<VendorOnboardingData>) => void;
  updateStep3: (data: Partial<VendorOnboardingData>) => void;
  updateStep4: (data: Partial<VendorOnboardingData>) => void;
  resetData: () => void;
}

const VendorOnboardingContext = createContext<VendorOnboardingContextType | null>(null);

const initialData: VendorOnboardingData = {
  vendorName: "",
  contactPerson: "",
  phoneNumber: "",
  businessDescription: "",
  businessTypes: [],
  membershipLevel: "basic",
  website: "",
  yearsExperience: "",
  serviceLocation: "",
  serviceAreas: "",
  priceMin: "",
  priceMax: "",
  availableDays: [],
  leadTime: "",
  instagram: "",
  facebook: "",
  pinterest: "",
  businessHours: "",
  specialties: [],
};

export const VendorOnboardingProvider = ({ children }: { children: React.ReactNode }) => {
  const [data, setData] = useState<VendorOnboardingData>(initialData);

  const updateStep1 = (stepData: Partial<VendorOnboardingData>) => {
    setData(prev => ({ ...prev, ...stepData }));
  };

  const updateStep2 = (stepData: Partial<VendorOnboardingData>) => {
    setData(prev => ({ ...prev, ...stepData }));
  };

  const updateStep3 = (stepData: Partial<VendorOnboardingData>) => {
    setData(prev => ({ ...prev, ...stepData }));
  };

  const updateStep4 = (stepData: Partial<VendorOnboardingData>) => {
    setData(prev => ({ ...prev, ...stepData }));
  };

  const resetData = () => {
    setData(initialData);
  };

  return (
    <VendorOnboardingContext.Provider
      value={{
        data,
        updateStep1,
        updateStep2,
        updateStep3,
        updateStep4,
        resetData,
      }}
    >
      {children}
    </VendorOnboardingContext.Provider>
  );
};

export const useVendorOnboarding = () => {
  const context = useContext(VendorOnboardingContext);
  if (!context) {
    throw new Error("useVendorOnboarding must be used within VendorOnboardingProvider");
  }
  return context;
};
