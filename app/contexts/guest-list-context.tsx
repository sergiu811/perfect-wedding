import React, { createContext, useContext, useState } from "react";

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
  addGuest: (guest: Omit<Guest, "id">) => void;
  updateGuest: (id: string, updates: Partial<Guest>) => void;
  deleteGuest: (id: string) => void;
  getStats: () => {
    total: number;
    confirmed: number;
    declined: number;
    pending: number;
  };
}

const GuestListContext = createContext<GuestListContextType | null>(null);

// Sample initial data
const initialGuests: Guest[] = [
  {
    id: "1",
    name: "Emma Johnson",
    email: "emma.j@email.com",
    phone: "555-0101",
    relationship: "Family",
    rsvpStatus: "yes",
    mealPreference: "Standard",
    plusOnes: 1,
    tableNumber: "1",
    invitedDate: "2024-12-01",
    giftStatus: "pending",
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "mchen@email.com",
    relationship: "Friend",
    rsvpStatus: "yes",
    mealPreference: "Vegetarian",
    plusOnes: 0,
    tableNumber: "3",
    invitedDate: "2024-12-01",
    giftStatus: "received",
  },
  {
    id: "3",
    name: "Sarah Williams",
    email: "sarah.w@email.com",
    relationship: "Friend",
    rsvpStatus: "pending",
    mealPreference: "Standard",
    plusOnes: 1,
    invitedDate: "2024-12-15",
    giftStatus: "pending",
  },
  {
    id: "4",
    name: "David Martinez",
    relationship: "Colleague",
    rsvpStatus: "no",
    mealPreference: "Standard",
    plusOnes: 0,
    invitedDate: "2024-12-01",
    giftStatus: "na",
  },
];

export const GuestListProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [guests, setGuests] = useState<Guest[]>(initialGuests);

  const addGuest = (guest: Omit<Guest, "id">) => {
    const newGuest: Guest = {
      ...guest,
      id: Date.now().toString(),
    };
    setGuests([...guests, newGuest]);
  };

  const updateGuest = (id: string, updates: Partial<Guest>) => {
    setGuests(guests.map((g) => (g.id === id ? { ...g, ...updates } : g)));
  };

  const deleteGuest = (id: string) => {
    setGuests(guests.filter((g) => g.id !== id));
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
      value={{ guests, addGuest, updateGuest, deleteGuest, getStats }}
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
