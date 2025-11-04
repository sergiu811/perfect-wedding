import React, { useState } from "react";
import { Header } from "~/components/layout";
import { FilterButton } from "~/components/venues";
import { DecorationCard } from "~/components/decorations";
import { DECORATIONS, DECORATION_FILTERS } from "~/constants";
import { useRouter } from "~/contexts/router-context";

export const DecorationsPage = () => {
  const { navigate } = useRouter();
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const handleFilterClick = (filterId: string) => {
    setActiveFilter(activeFilter === filterId ? null : filterId);
    console.log("Filter clicked:", filterId);
  };

  const handleDecorationClick = (decoration: any) => {
    console.log("Decoration clicked:", decoration.name);
    navigate(`/decorations/${decoration.id}`);
  };

  return (
    <div className="flex-grow pb-6 lg:pb-8">
      <Header title="Decorations" onBack={() => navigate("/vendors")} />

      <div className="max-w-7xl mx-auto">
      {/* Filters */}
      <div className="flex gap-3 overflow-x-auto px-4 lg:px-8 py-4 lg:py-6 scrollbar-hide">
        {DECORATION_FILTERS.map((filter) => (
          <FilterButton
            key={filter.id}
            label={filter.label}
            onClick={() => handleFilterClick(filter.id)}
            active={activeFilter === filter.id}
          />
        ))}
      </div>

      {/* Decoration List */}
      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 px-4 lg:px-8">
        {DECORATIONS.map((decoration) => (
          <DecorationCard
            key={decoration.id}
            decoration={decoration}
            onClick={handleDecorationClick}
          />
        ))}
      </main>
      </div>
    </div>
  );
};
