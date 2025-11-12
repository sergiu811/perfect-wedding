import React, { createContext, useContext, useState } from "react";

interface ServicePackage {
  id: string;
  name: string;
  price: string;
  description: string;
}

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
  packages?: ServicePackage[];
  specificFields?: Record<string, any>;
  images?: string[];
}

interface ServiceContextType {
  formData: ServiceFormData;
  updateFormData: (newData: Partial<ServiceFormData>) => void;
  resetFormData: () => void;
  startEditingService: (service: any) => void;
  startNewService: () => void;
  editingServiceId: string | null;
  isEditing: boolean;
}

const ServiceContext = createContext<ServiceContextType | null>(null);

export const ServiceProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [formData, setFormData] = useState<ServiceFormData>({});
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);

  const normalizePackages = (packages: any[] | null | undefined) => {
    if (!packages || packages.length === 0) return [];

    return packages.map((pkg, index) => ({
      id:
        typeof pkg?.id === "string" && pkg.id.length > 0
          ? pkg.id
          : `pkg-${index}-${Date.now()}`,
      name: pkg?.name ?? "",
      price:
        typeof pkg?.price === "number"
          ? pkg.price.toString()
          : (pkg?.price ?? ""),
      description: pkg?.description ?? "",
    }));
  };

  const startEditingService = (service: any) => {
    if (!service) return;

    setEditingServiceId(service.id ?? null);

    setFormData({
      title: service.title ?? "",
      category: service.category ?? "",
      description: service.description ?? "",
      priceMin:
        service.price_min !== null && service.price_min !== undefined
          ? String(service.price_min)
          : "",
      priceMax:
        service.price_max !== null && service.price_max !== undefined
          ? String(service.price_max)
          : "",
      location: service.location ?? "",
      contactMethod: service.contact_method ?? "",
      tags: service.tags ?? [],
      videoLink:
        Array.isArray(service.videos) && service.videos.length > 0
          ? service.videos[0]
          : "",
      availableDays: service.available_days ?? [],
      packages: normalizePackages(service.packages),
      specificFields: service.specific_fields ?? {},
      serviceRegion: service.service_region ?? "",
      leadTime:
        service.lead_time !== null && service.lead_time !== undefined
          ? String(service.lead_time)
          : undefined,
      images: service.images ?? [],
    });
  };

  const startNewService = () => {
    setEditingServiceId(null);
    setFormData({});
  };

  const updateFormData = (newData: Partial<ServiceFormData>) => {
    setFormData((prevData) => ({ ...prevData, ...newData }));
  };

  const resetFormData = () => {
    setFormData({});
    setEditingServiceId(null);
  };

  return (
    <ServiceContext.Provider
      value={{
        formData,
        updateFormData,
        resetFormData,
        startEditingService,
        startNewService,
        editingServiceId,
        isEditing: editingServiceId !== null,
      }}
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
