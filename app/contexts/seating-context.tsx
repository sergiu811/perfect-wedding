import React, { createContext, useContext, useState } from "react";

export interface TableSeat {
  seatNumber: number;
  guestId?: string;
  guestName?: string;
}

export interface Table {
  id: string;
  name: string;
  shape: "round" | "rectangle";
  seats: number;
  assignedSeats: TableSeat[];
  position?: { x: number; y: number };
  color?: string;
  notes?: string;
}

interface SeatingContextType {
  tables: Table[];
  addTable: (table: Omit<Table, "id" | "assignedSeats">) => void;
  updateTable: (id: string, updates: Partial<Table>) => void;
  deleteTable: (id: string) => void;
  assignGuestToSeat: (
    tableId: string,
    seatNumber: number,
    guestId: string,
    guestName: string
  ) => void;
  unassignSeat: (tableId: string, seatNumber: number) => void;
  getTotalSeatedGuests: () => number;
  autoAssignGuests: (guests: any[]) => void;
}

const SeatingContext = createContext<SeatingContextType | null>(null);

// Initial sample tables
const initialTables: Table[] = [
  {
    id: "1",
    name: "Table 1 - Family",
    shape: "round",
    seats: 10,
    assignedSeats: [{ seatNumber: 1, guestId: "1", guestName: "Emma Johnson" }],
    position: { x: 100, y: 100 },
    color: "#FFE5E5",
    notes: "Near couple's table",
  },
  {
    id: "2",
    name: "Table 2 - Friends",
    shape: "round",
    seats: 8,
    assignedSeats: [
      { seatNumber: 1, guestId: "2", guestName: "Michael Chen" },
      { seatNumber: 2, guestId: "3", guestName: "Sarah Williams" },
    ],
    position: { x: 300, y: 100 },
    color: "#E6F3FF",
  },
  {
    id: "3",
    name: "Table 3 - Colleagues",
    shape: "rectangle",
    seats: 10,
    assignedSeats: [],
    position: { x: 100, y: 300 },
    color: "#F0E6FF",
  },
];

export const SeatingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [tables, setTables] = useState<Table[]>(initialTables);

  const addTable = (table: Omit<Table, "id" | "assignedSeats">) => {
    const newTable: Table = {
      ...table,
      id: Date.now().toString(),
      assignedSeats: [],
    };
    setTables([...tables, newTable]);
  };

  const updateTable = (id: string, updates: Partial<Table>) => {
    setTables(tables.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const deleteTable = (id: string) => {
    setTables(tables.filter((t) => t.id !== id));
  };

  const assignGuestToSeat = (
    tableId: string,
    seatNumber: number,
    guestId: string,
    guestName: string
  ) => {
    setTables(
      tables.map((table) => {
        if (table.id === tableId) {
          // Remove guest from any other seat first
          const updatedSeats = table.assignedSeats.filter(
            (s) => s.guestId !== guestId
          );
          // Check if seat is already taken
          const existingSeat = updatedSeats.find(
            (s) => s.seatNumber === seatNumber
          );
          if (existingSeat) {
            return table; // Seat already taken
          }
          // Add new assignment
          return {
            ...table,
            assignedSeats: [
              ...updatedSeats,
              { seatNumber, guestId, guestName },
            ],
          };
        }
        // Remove guest from other tables
        return {
          ...table,
          assignedSeats: table.assignedSeats.filter(
            (s) => s.guestId !== guestId
          ),
        };
      })
    );
  };

  const unassignSeat = (tableId: string, seatNumber: number) => {
    setTables(
      tables.map((table) => {
        if (table.id === tableId) {
          return {
            ...table,
            assignedSeats: table.assignedSeats.filter(
              (s) => s.seatNumber !== seatNumber
            ),
          };
        }
        return table;
      })
    );
  };

  const getTotalSeatedGuests = () => {
    return tables.reduce((sum, table) => sum + table.assignedSeats.length, 0);
  };

  const autoAssignGuests = (guests: any[]) => {
    // Simple auto-assign logic: distribute guests evenly across tables
    const confirmedGuests = guests.filter((g) => g.rsvpStatus === "yes");
    let tableIndex = 0;
    let seatIndex = 1;

    confirmedGuests.forEach((guest) => {
      if (tableIndex < tables.length) {
        const table = tables[tableIndex];
        if (seatIndex <= table.seats) {
          assignGuestToSeat(table.id, seatIndex, guest.id, guest.name);
          seatIndex++;
        } else {
          tableIndex++;
          seatIndex = 1;
          if (tableIndex < tables.length) {
            assignGuestToSeat(
              tables[tableIndex].id,
              seatIndex,
              guest.id,
              guest.name
            );
            seatIndex++;
          }
        }
      }
    });
  };

  return (
    <SeatingContext.Provider
      value={{
        tables,
        addTable,
        updateTable,
        deleteTable,
        assignGuestToSeat,
        unassignSeat,
        getTotalSeatedGuests,
        autoAssignGuests,
      }}
    >
      {children}
    </SeatingContext.Provider>
  );
};

export const useSeating = () => {
  const context = useContext(SeatingContext);
  if (!context) {
    throw new Error("useSeating must be used within a SeatingProvider");
  }
  return context;
};
