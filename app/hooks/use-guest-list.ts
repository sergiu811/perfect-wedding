import { useState, useEffect, useCallback } from "react";
import type { Guest } from "~/contexts/guest-list-context";

type GuestRow = {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  relationship: string;
  rsvp_status: "yes" | "no" | "pending";
  meal_preference?: string | null;
  plus_ones?: number | null;
  table_number?: string | null;
  invited_date?: string | null;
  gift_status?: "pending" | "received" | "na" | null;
  notes?: string | null;
};

// Helper function to convert database guest to context guest
const dbGuestToGuest = (dbGuest: GuestRow): Guest => ({
  id: dbGuest.id,
  name: dbGuest.name,
  email: dbGuest.email || undefined,
  phone: dbGuest.phone || undefined,
  relationship: dbGuest.relationship,
  rsvpStatus: dbGuest.rsvp_status || "pending",
  mealPreference: dbGuest.meal_preference || "Standard",
  plusOnes: dbGuest.plus_ones || 0,
  tableNumber: dbGuest.table_number || undefined,
  invitedDate: dbGuest.invited_date || undefined,
  giftStatus: dbGuest.gift_status || undefined,
  notes: dbGuest.notes || undefined,
});

// Helper function to convert context guest to database format
const guestToDbFormat = (guest: Omit<Guest, "id">) => ({
  name: guest.name,
  email: guest.email || null,
  phone: guest.phone || null,
  relationship: guest.relationship,
  rsvp_status: guest.rsvpStatus,
  meal_preference: guest.mealPreference || null,
  plus_ones: guest.plusOnes || 0,
  table_number: guest.tableNumber || null,
  invited_date: guest.invitedDate || null,
  gift_status: guest.giftStatus || null,
  notes: guest.notes || null,
});

export function useGuestList() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGuests = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/guests");
      if (!response.ok) throw new Error("Failed to fetch guests");
      
      const data = await response.json();
      setGuests((data.guests || []).map(dbGuestToGuest));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch guests");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGuests();
  }, [fetchGuests]);

  const addGuest = async (guest: Omit<Guest, "id">) => {
    const formData = new FormData();
    formData.append("intent", "create");
    formData.append("guest", JSON.stringify(guestToDbFormat(guest)));

    const response = await fetch("/api/guests", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("Failed to add guest");
    
    const data = await response.json();
    setGuests([...guests, dbGuestToGuest(data.guest)]);
  };

  const updateGuest = async (id: string, updates: Partial<Guest>) => {
    const dbUpdates: any = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.email !== undefined) dbUpdates.email = updates.email || null;
    if (updates.phone !== undefined) dbUpdates.phone = updates.phone || null;
    if (updates.relationship !== undefined) dbUpdates.relationship = updates.relationship;
    if (updates.rsvpStatus !== undefined) dbUpdates.rsvp_status = updates.rsvpStatus;
    if (updates.mealPreference !== undefined) dbUpdates.meal_preference = updates.mealPreference || null;
    if (updates.plusOnes !== undefined) dbUpdates.plus_ones = updates.plusOnes;
    if (updates.tableNumber !== undefined) dbUpdates.table_number = updates.tableNumber || null;
    if (updates.invitedDate !== undefined) dbUpdates.invited_date = updates.invitedDate || null;
    if (updates.giftStatus !== undefined) dbUpdates.gift_status = updates.giftStatus || null;
    if (updates.notes !== undefined) dbUpdates.notes = updates.notes || null;

    const formData = new FormData();
    formData.append("intent", "update");
    formData.append("id", id);
    formData.append("updates", JSON.stringify(dbUpdates));

    const response = await fetch("/api/guests", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("Failed to update guest");
    
    const data = await response.json();
    setGuests(guests.map((g) => (g.id === id ? dbGuestToGuest(data.guest) : g)));
  };

  const deleteGuest = async (id: string) => {
    const formData = new FormData();
    formData.append("intent", "delete");
    formData.append("id", id);

    const response = await fetch("/api/guests", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("Failed to delete guest");
    
    setGuests(guests.filter((g) => g.id !== id));
  };

  const importGuests = async (guestsToImport: Omit<Guest, "id">[]) => {
    const dbGuests = guestsToImport.map(guestToDbFormat);
    
    const formData = new FormData();
    formData.append("intent", "bulk-import");
    formData.append("guests", JSON.stringify(dbGuests));

    const response = await fetch("/api/guests", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("Failed to import guests");
    
    const data = await response.json();
    setGuests([...guests, ...(data.guests || []).map(dbGuestToGuest)]);
  };

  const exportGuests = () => {
    const csvContent = [
      [
        "Name",
        "Email",
        "Phone",
        "Relationship",
        "RSVP Status",
        "Meal Preference",
        "Plus Ones",
        "Table Number",
        "Invited Date",
        "Gift Status",
        "Notes",
      ],
      ...guests.map((g) => [
        g.name,
        g.email || "",
        g.phone || "",
        g.relationship,
        g.rsvpStatus,
        g.mealPreference,
        g.plusOnes.toString(),
        g.tableNumber || "",
        g.invitedDate || "",
        g.giftStatus || "",
        g.notes || "",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `guest-list-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const refreshGuests = fetchGuests;

  const getStats = () => {
    return {
      total: guests.length,
      confirmed: guests.filter((g) => g.rsvpStatus === "yes").length,
      declined: guests.filter((g) => g.rsvpStatus === "no").length,
      pending: guests.filter((g) => g.rsvpStatus === "pending").length,
    };
  };

  return {
    guests,
    loading,
    error,
    addGuest,
    updateGuest,
    deleteGuest,
    importGuests,
    exportGuests,
    refreshGuests,
    getStats,
  };
}
