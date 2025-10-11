import React, { useState } from "react";
import { Header } from "~/components/layout";
import { FilterButton } from "~/components/venues";
import { SweetCard } from "~/components/sweets";
import { SWEETS, SWEETS_FILTERS } from "~/constants";
import { useRouter } from "~/contexts/router-context";

export const SweetsPage = () => {
  const { navigate } = useRouter();
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const handleFilterClick = (filterId: string) => {
    setActiveFilter(activeFilter === filterId ? null : filterId);
    console.log("Filter clicked:", filterId);
  };

  const handleSweetClick = (sweet: any) => {
    console.log("Sweet clicked:", sweet.name);
    navigate(`/sweets/${sweet.id}`);
  };

  return (
    <div className="flex-grow pb-6">
      <Header title="Sweets" onBack={() => navigate("/")} />

      {/* Filters */}
      <div className="flex gap-3 overflow-x-auto px-4 py-4 scrollbar-hide">
        {SWEETS_FILTERS.map((filter) => (
          <FilterButton
            key={filter.id}
            label={filter.label}
            onClick={() => handleFilterClick(filter.id)}
            active={activeFilter === filter.id}
          />
        ))}
      </div>

      {/* Sweets List */}
      <main className="space-y-4 px-4">
        {SWEETS.map((sweet) => (
          <SweetCard key={sweet.id} sweet={sweet} onClick={handleSweetClick} />
        ))}
      </main>
    </div>
  );
};
