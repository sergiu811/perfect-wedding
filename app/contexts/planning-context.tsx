import React, { createContext, useContext, useState } from "react";

interface PlanningFormData {
  // Step 1: Wedding Overview
  partner1Name?: string;
  partner2Name?: string;
  weddingDate?: string;
  guestCount?: string;
  budgetMin?: string;
  budgetMax?: string;
  location?: string;
  weddingType?: string;
  language?: string;
  referralSource?: string;

  // Step 2: Style & Theme
  themes?: string[];
  colorPalette?: string[];
  moodBoardImages?: File[];
  venuePreference?: string;
  formalityLevel?: string;
  venueTypes?: string[];
  musicStyles?: string[];

  // Step 3: Vendor Needs
  vendorCategories?: string[];
  vendorPriorities?: Record<string, number>;
  hasBookedVendors?: boolean;
  bookedVendorsDetails?: string;
  preferredContactMethod?: string;

  // Step 4: Timeline & Personalization
  currentStage?: string;
  helpTasks?: string[];
  notifications?: string[];
  acceptedTerms?: boolean;
}

interface PlanningContextType {
  formData: PlanningFormData;
  updateFormData: (newData: Partial<PlanningFormData>) => void;
  resetFormData: () => void;
}

const PlanningContext = createContext<PlanningContextType | null>(null);

export const PlanningProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [formData, setFormData] = useState<PlanningFormData>({});

  const updateFormData = (newData: Partial<PlanningFormData>) => {
    setFormData((prevData) => ({ ...prevData, ...newData }));
  };

  const resetFormData = () => {
    setFormData({});
  };

  return (
    <PlanningContext.Provider
      value={{ formData, updateFormData, resetFormData }}
    >
      {children}
    </PlanningContext.Provider>
  );
};

export const usePlanning = () => {
  const context = useContext(PlanningContext);
  if (!context) {
    throw new Error("usePlanning must be used within a PlanningProvider");
  }
  return context;
};
