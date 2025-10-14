import React, { useState } from "react";
import { Header } from "~/components/layout";
import { FilterButton } from "~/components/venues";
import { InvitationCard } from "~/components/invitations";
import { INVITATIONS, INVITATION_FILTERS } from "~/constants";
import { useRouter } from "~/contexts/router-context";

export const InvitationsPage = () => {
  const { navigate } = useRouter();
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const handleFilterClick = (filterId: string) => {
    setActiveFilter(activeFilter === filterId ? null : filterId);
    console.log("Filter clicked:", filterId);
  };

  const handleInvitationClick = (invitation: any) => {
    console.log("Invitation clicked:", invitation.name);
    navigate(`/invitations/${invitation.id}`);
  };

  return (
    <div className="flex-grow pb-6">
      <Header title="Invitations" onBack={() => navigate("/vendors")} />

      {/* Filters */}
      <div className="flex gap-3 overflow-x-auto px-4 py-4 scrollbar-hide">
        {INVITATION_FILTERS.map((filter) => (
          <FilterButton
            key={filter.id}
            label={filter.label}
            onClick={() => handleFilterClick(filter.id)}
            active={activeFilter === filter.id}
          />
        ))}
      </div>

      {/* Invitation List */}
      <main className="space-y-4 px-4">
        {INVITATIONS.map((invitation) => (
          <InvitationCard
            key={invitation.id}
            invitation={invitation}
            onClick={handleInvitationClick}
          />
        ))}
      </main>
    </div>
  );
};
