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
    <div className="flex-grow pb-6">
      <Header title="Venues" onBack={() => navigate("/vendors")} />

      {/* Filters */}
      <div className="flex gap-3 overflow-x-auto px-4 py-4 scrollbar-hide">
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
      <div className="space-y-5 px-4">
        {VENUES.map((venue) => (
          <VenueCard key={venue.id} venue={venue} onClick={handleVenueClick} />
        ))}
      </div>
    </div>
  );
};
