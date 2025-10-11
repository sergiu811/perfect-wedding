import React, { useState } from "react";
import { Header } from "~/components/layout";
import { FilterButton } from "~/components/venues";
import { MusicianCard } from "~/components/musicians";
import { MUSICIANS, MUSICIAN_FILTERS } from "~/constants";
import { useRouter } from "~/contexts/router-context";

export const MusicDJPage = () => {
  const { navigate } = useRouter();
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const handleFilterClick = (filterId: string) => {
    setActiveFilter(activeFilter === filterId ? null : filterId);
    console.log("Filter clicked:", filterId);
  };

  const handleMusicianClick = (musician: any) => {
    console.log("Musician clicked:", musician.name);
    navigate(`/music-dj/${musician.id}`);
  };

  return (
    <div className="flex-grow pb-6">
      <Header title="Music/DJ" onBack={() => navigate("/")} />

      {/* Filters */}
      <div className="flex gap-3 overflow-x-auto px-4 py-4 scrollbar-hide">
        {MUSICIAN_FILTERS.map((filter) => (
          <FilterButton
            key={filter.id}
            label={filter.label}
            onClick={() => handleFilterClick(filter.id)}
            active={activeFilter === filter.id}
          />
        ))}
      </div>

      {/* Musician List */}
      <main className="space-y-4 px-4">
        {MUSICIANS.map((musician) => (
          <MusicianCard
            key={musician.id}
            musician={musician}
            onClick={handleMusicianClick}
          />
        ))}
      </main>
    </div>
  );
};
