import React, { useState, useEffect } from "react";
import { Header } from "~/components/layout";
import { FilterButton } from "~/components/venues";
import { PhotographerCard } from "~/components/photographers";
import { PHOTOGRAPHER_FILTERS } from "~/constants";
import { useRouter } from "~/contexts/router-context";

interface Service {
  id: string;
  category: string;
  title: string;
  description: string;
  images: string[] | null;
  rating: number | null;
  review_count: number | null;
  tags: string[] | null;
  price_min: number | null;
  price_max: number | null;
  specific_fields: any;
  vendor?: {
    business_name: string | null;
    avatar_url: string | null;
  };
}

export const PhotoVideoPage = () => {
  const { navigate } = useRouter();
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/services");

        if (!response.ok) {
          throw new Error("Failed to load photographers");
        }

        const data = await response.json();
        const photoServices = (data.services || []).filter(
          (s: Service) => s.category === "photo_video"
        );
        setServices(photoServices);
      } catch (err: any) {
        console.error("Error fetching photographers:", err);
        setError(err.message || "Failed to load photographers");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleFilterClick = (filterId: string) => {
    setActiveFilter(activeFilter === filterId ? null : filterId);
  };

  const handlePhotographerClick = (photographer: any) => {
    navigate(`/photo-video/${photographer.id}`);
  };

  // Transform service data to match PhotographerCard interface
  const transformedPhotographers = services.map((service) => {
    const specialties =
      service.tags?.join(", ") ||
      service.specific_fields?.specialties ||
      "Photography & Videography";
    const type = service.specific_fields?.type || "Photographer";
    const pricing =
      service.price_min && service.price_max
        ? `$${service.price_min.toLocaleString()} - $${service.price_max.toLocaleString()}`
        : service.price_min
          ? `From $${service.price_min.toLocaleString()}`
          : "Contact for pricing";

    return {
      id: service.id as any, // Card component expects number but we use string IDs
      type: type,
      name: service.title,
      specialties: specialties,
      rating: service.rating || 0,
      reviewCount: service.review_count || 0,
      image:
        service.images?.[0] ||
        service.vendor?.avatar_url ||
        "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&q=80",
      portfolio: service.images || [],
      pricing: pricing,
      description: service.description,
      tags: service.tags || [],
      location: service.specific_fields?.location || null,
    };
  });

  const filteredPhotographers = activeFilter
    ? transformedPhotographers.filter((photographer) => {
        return (
          photographer.type
            .toLowerCase()
            .includes(activeFilter.toLowerCase()) ||
          photographer.specialties
            .toLowerCase()
            .includes(activeFilter.toLowerCase())
        );
      })
    : transformedPhotographers;

  return (
    <div className="flex-grow pb-6 lg:pb-8">
      <Header title="Photo & Video" onBack={() => navigate("/vendors")} />

      <div className="max-w-7xl mx-auto">
        {/* Filters */}
        <div className="flex gap-3 overflow-x-auto px-4 lg:px-8 py-4 lg:py-6 scrollbar-hide">
          {PHOTOGRAPHER_FILTERS.map((filter) => (
            <FilterButton
              key={filter.id}
              label={filter.label}
              onClick={() => handleFilterClick(filter.id)}
              active={activeFilter === filter.id}
            />
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12 px-4 lg:px-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <span className="text-gray-400 text-2xl">📷</span>
            </div>
            <p className="text-gray-600 font-medium">
              Loading photographers...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12 px-4 lg:px-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-400 text-2xl">⚠️</span>
            </div>
            <p className="text-gray-600 font-medium">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 text-rose-600 hover:text-rose-700 font-medium"
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredPhotographers.length === 0 && (
          <div className="text-center py-12 px-4 lg:px-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-gray-400 text-2xl">📷</span>
            </div>
            <p className="text-gray-600 font-medium">No photographers found</p>
            <p className="text-sm text-gray-500 mt-1">
              {activeFilter
                ? "Try selecting a different filter"
                : "Check back later for new photographers"}
            </p>
          </div>
        )}

        {/* Photographer List */}
        {!loading && !error && filteredPhotographers.length > 0 && (
          <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6 px-4 lg:px-8">
            {filteredPhotographers.map((photographer) => (
              <PhotographerCard
                key={photographer.id}
                photographer={photographer}
                onClick={handlePhotographerClick}
              />
            ))}
          </main>
        )}
      </div>
    </div>
  );
};
