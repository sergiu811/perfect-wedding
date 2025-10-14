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
    <div className="flex-grow pb-6">
      <Header title="Decorations" onBack={() => navigate("/vendors")} />

      {/* Filters */}
      <div className="flex gap-3 overflow-x-auto px-4 py-4 scrollbar-hide">
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
      <main className="space-y-4 px-4">
        {DECORATIONS.map((decoration) => (
          <DecorationCard
            key={decoration.id}
            decoration={decoration}
            onClick={handleDecorationClick}
          />
        ))}
      </main>
    </div>
  );
};
