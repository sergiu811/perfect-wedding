import React, { createContext, useContext, useState } from "react";

interface ServiceFormData {
  // Step 1: Basic Information
  title?: string;
  category?: string;
  description?: string;
  priceMin?: string;
  priceMax?: string;
  location?: string;
  contactMethod?: string;
  tags?: string[];

  // Step 2: Category-specific fields (will vary by category)
  [key: string]: any;

  // Step 3: Media & Availability
  serviceRegion?: string;
  videoLink?: string;
  availableDays?: string[];
  leadTime?: string;
}

interface ServiceContextType {
  formData: ServiceFormData;
  updateFormData: (newData: Partial<ServiceFormData>) => void;
  resetFormData: () => void;
}

const ServiceContext = createContext<ServiceContextType | null>(null);

export const ServiceProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [formData, setFormData] = useState<ServiceFormData>({});

  const updateFormData = (newData: Partial<ServiceFormData>) => {
    setFormData((prevData) => ({ ...prevData, ...newData }));
  };

  const resetFormData = () => {
    setFormData({});
  };

  return (
    <ServiceContext.Provider
      value={{ formData, updateFormData, resetFormData }}
    >
      {children}
    </ServiceContext.Provider>
  );
};

export const useServiceForm = () => {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error("useServiceForm must be used within a ServiceProvider");
  }
  return context;
};
