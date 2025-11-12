import React, { useState, useEffect } from "react";
import { Header } from "~/components/layout";
import { FilterButton, VenueCard } from "~/components/venues";
import { VENUE_FILTERS } from "~/constants";
import { useRouter } from "~/contexts/router-context";

interface Service {
  id: string;
  category: string;
  title: string;
  location: string;
  images: string[] | null;
  price_min: number | null;
  price_max: number | null;
  rating: number | null;
  review_count: number | null;
  tags: string[] | null;
  specific_fields: any;
  vendor?: {
    business_name: string | null;
    avatar_url: string | null;
  };
}

export const VenuesPage = () => {
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
          throw new Error("Failed to load venues");
        }

        const data = await response.json();
        // Filter by venue category
        const venueServices = (data.services || []).filter(
          (s: Service) => s.category === "venue"
        );
        setServices(venueServices);
      } catch (err: any) {
        console.error("Error fetching venues:", err);
        setError(err.message || "Failed to load venues");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleFilterClick = (filterId: string) => {
    setActiveFilter(activeFilter === filterId ? null : filterId);
  };

  const handleVenueClick = (venue: any) => {
    navigate(`/venues/${venue.id}`);
  };

  // Transform service data to match VenueCard interface
  const transformedVenues = services.map((service) => {
    const capacity =
      service.specific_fields?.capacity || "Capacity not specified";
    const style = service.specific_fields?.style || "Various styles";

    return {
      id: service.id as any, // Card component expects number but we use string IDs
      name: service.title,
      location: service.location,
      capacity: typeof capacity === "string" ? capacity : `${capacity} guests`,
      image:
        service.images?.[0] ||
        service.vendor?.avatar_url ||
        "https://images.unsplash.com/photo-1519167758481-83f29da8fd36?w=400&q=80",
      priceRange:
        service.price_min && service.price_max
          ? `$${service.price_min.toLocaleString()} - $${service.price_max.toLocaleString()}`
          : service.price_min
            ? `From $${service.price_min.toLocaleString()}`
            : "Price on request",
      style: style,
      rating: service.rating || null,
      reviewCount: service.review_count || null,
      tags: service.tags || [],
    };
  });

  // Apply filter if active
  const filteredVenues = activeFilter
    ? transformedVenues.filter((venue) => {
        // Simple filter logic - can be enhanced
        return venue.style.toLowerCase().includes(activeFilter.toLowerCase());
      })
    : transformedVenues;

  return (
    <div className="flex-grow pb-6 lg:pb-8">
      <Header title="Venues" onBack={() => navigate("/vendors")} />

      <div className="max-w-7xl mx-auto">
        {/* Filters */}
        <div className="flex gap-3 overflow-x-auto px-4 lg:px-8 py-4 lg:py-6 scrollbar-hide">
          {VENUE_FILTERS.map((filter) => (
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
              <span className="text-gray-400 text-2xl">🏛️</span>
            </div>
            <p className="text-gray-600 font-medium">Loading venues...</p>
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
        {!loading && !error && filteredVenues.length === 0 && (
          <div className="text-center py-12 px-4 lg:px-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-gray-400 text-2xl">🏛️</span>
            </div>
            <p className="text-gray-600 font-medium">No venues found</p>
            <p className="text-sm text-gray-500 mt-1">
              {activeFilter
                ? "Try selecting a different filter"
                : "Check back later for new venues"}
            </p>
          </div>
        )}

        {/* Venue List */}
        {!loading && !error && filteredVenues.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6 px-4 lg:px-8">
            {filteredVenues.map((venue) => (
              <VenueCard
                key={venue.id}
                venue={venue}
                onClick={handleVenueClick}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
