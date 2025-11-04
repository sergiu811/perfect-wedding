import { useState } from "react";
import { Header } from "~/components/layout";
import { FilterButton, VenueCard } from "~/components/venues";
import { VENUES, VENUE_FILTERS } from "~/constants";
import { useRouter } from "~/contexts/router-context";

export const VenuesPage = () => {
  const { navigate } = useRouter();
  const [activeFilter, setActiveFilter] = useState(null);

  const handleFilterClick = (filterId) => {
    setActiveFilter(activeFilter === filterId ? null : filterId);
    console.log("Filter clicked:", filterId);
  };

  const handleVenueClick = (venue) => {
    console.log("Venue clicked:", venue.name);
    navigate(`/venues/${venue.id}`);
  };

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

        {/* Venue List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 px-4 lg:px-8">
          {VENUES.map((venue) => (
            <VenueCard key={venue.id} venue={venue} onClick={handleVenueClick} />
          ))}
        </div>
      </div>
    </div>
  );
};
