import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "~/contexts/auth-context";
import { getSupabaseBrowserClient } from "~/lib/supabase.client";
import {
  getGuestsByWeddingId,
  createGuest,
  updateGuest as updateGuestDB,
  deleteGuest as deleteGuestDB,
  bulkCreateGuests,
} from "~/lib/guests";
import { getWeddingByUserId } from "~/lib/wedding";
import type { Database } from "~/types/database.types";

type GuestRow = Database["public"]["Tables"]["guests"]["Row"];

export interface Guest {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  relationship: string;
  rsvpStatus: "yes" | "no" | "pending";
  mealPreference: string;
  plusOnes: number;
  tableNumber?: string;
  invitedDate?: string;
  giftStatus?: "pending" | "received" | "na";
  notes?: string;
}

interface GuestListContextType {
  guests: Guest[];
  loading: boolean;
  addGuest: (guest: Omit<Guest, "id">) => Promise<void>;
  updateGuest: (id: string, updates: Partial<Guest>) => Promise<void>;
  deleteGuest: (id: string) => Promise<void>;
  importGuests: (guests: Omit<Guest, "id">[]) => Promise<void>;
  exportGuests: () => void;
  refreshGuests: () => Promise<void>;
  getStats: () => {
    total: number;
    confirmed: number;
    declined: number;
    pending: number;
  };
}

const GuestListContext = createContext<GuestListContextType | null>(null);

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

// Helper function to convert context guest to database insert format
const guestToDbInsert = (guest: Omit<Guest, "id">, weddingId: string) => ({
  wedding_id: weddingId,
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

export const GuestListProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [weddingId, setWeddingId] = useState<string | null>(null);
  const { user } = useAuth();
  const supabase = getSupabaseBrowserClient();

  // Fetch wedding and guests on mount
  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Get wedding ID
        const { data: wedding } = await getWeddingByUserId(supabase, user.id);
        if (wedding) {
          setWeddingId(wedding.id);

          // Get guests for this wedding
          const { data: guestsData } = await getGuestsByWeddingId(
            supabase,
            wedding.id
          );
          if (guestsData) {
            setGuests(guestsData.map(dbGuestToGuest));
          }
        }
      } catch (error) {
        console.error("Error fetching guests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, supabase]);

  const refreshGuests = async () => {
    if (!weddingId) return;

    try {
      const { data: guestsData } = await getGuestsByWeddingId(
        supabase,
        weddingId
      );
      if (guestsData) {
        setGuests(guestsData.map(dbGuestToGuest));
      }
    } catch (error) {
      console.error("Error refreshing guests:", error);
    }
  };

  const addGuest = async (guest: Omit<Guest, "id">) => {
    if (!weddingId) throw new Error("No wedding found");

    const { data, error } = await createGuest(
      supabase,
      guestToDbInsert(guest, weddingId)
    );

    if (error) {
      console.error("Error adding guest:", error);
      throw error;
    }

    if (data) {
      setGuests([...guests, dbGuestToGuest(data)]);
    }
  };

  const updateGuest = async (id: string, updates: Partial<Guest>) => {
    const dbUpdates: any = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.email !== undefined) dbUpdates.email = updates.email || null;
    if (updates.phone !== undefined) dbUpdates.phone = updates.phone || null;
    if (updates.relationship !== undefined)
      dbUpdates.relationship = updates.relationship;
    if (updates.rsvpStatus !== undefined)
      dbUpdates.rsvp_status = updates.rsvpStatus;
    if (updates.mealPreference !== undefined)
      dbUpdates.meal_preference = updates.mealPreference || null;
    if (updates.plusOnes !== undefined) dbUpdates.plus_ones = updates.plusOnes;
    if (updates.tableNumber !== undefined)
      dbUpdates.table_number = updates.tableNumber || null;
    if (updates.invitedDate !== undefined)
      dbUpdates.invited_date = updates.invitedDate || null;
    if (updates.giftStatus !== undefined)
      dbUpdates.gift_status = updates.giftStatus || null;
    if (updates.notes !== undefined) dbUpdates.notes = updates.notes || null;

    const { data, error } = await updateGuestDB(supabase, id, dbUpdates);

    if (error) {
      console.error("Error updating guest:", error);
      throw error;
    }

    if (data) {
      setGuests(guests.map((g) => (g.id === id ? dbGuestToGuest(data) : g)));
    }
  };

  const deleteGuest = async (id: string) => {
    const { error } = await deleteGuestDB(supabase, id);

    if (error) {
      console.error("Error deleting guest:", error);
      throw error;
    }

    setGuests(guests.filter((g) => g.id !== id));
  };

  const importGuests = async (guestsToImport: Omit<Guest, "id">[]) => {
    if (!weddingId) throw new Error("No wedding found");

    const dbGuests = guestsToImport.map((g) => guestToDbInsert(g, weddingId));
    const { data, error } = await bulkCreateGuests(supabase, dbGuests);

    if (error) {
      console.error("Error importing guests:", error);
      throw error;
    }

    if (data) {
      setGuests([...guests, ...data.map(dbGuestToGuest)]);
    }
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

  const getStats = () => {
    return {
      total: guests.length,
      confirmed: guests.filter((g) => g.rsvpStatus === "yes").length,
      declined: guests.filter((g) => g.rsvpStatus === "no").length,
      pending: guests.filter((g) => g.rsvpStatus === "pending").length,
    };
  };

  return (
    <GuestListContext.Provider
      value={{
        guests,
        loading,
        addGuest,
        updateGuest,
        deleteGuest,
        importGuests,
        exportGuests,
        refreshGuests,
        getStats,
      }}
    >
      {children}
    </GuestListContext.Provider>
  );
};

export const useGuestList = () => {
  const context = useContext(GuestListContext);
  if (!context) {
    throw new Error("useGuestList must be used within a GuestListProvider");
  }
  return context;
};
