import { useState, useEffect, useCallback } from "react";

export type TableSeat = {
  seatNumber: number;
  guestId?: string;
  guestName?: string;
};

export type Table = {
  id: string;
  name: string;
  shape: "round" | "rectangle";
  seats: number;
  assignedSeats: TableSeat[];
  position?: { x: number; y: number };
  color?: string;
  notes?: string;
};

export function useSeating() {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSeatingChart = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/seating");
      if (!response.ok) throw new Error("Failed to fetch seating chart");
      
      const data = await response.json();
      setTables(data.tables || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch seating chart");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSeatingChart();
  }, [fetchSeatingChart]);

  const saveTables = async (updatedTables: Table[]) => {
    const formData = new FormData();
    formData.append("tables", JSON.stringify(updatedTables));

    const response = await fetch("/api/seating", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("Failed to save seating chart");
    
    const data = await response.json();
    setTables(data.tables);
  };

  const addTable = async (table: Omit<Table, "id" | "assignedSeats">) => {
    const newTable: Table = {
      ...table,
      id: Date.now().toString(),
      assignedSeats: [],
    };
    const updatedTables = [...tables, newTable];
    setTables(updatedTables);
    await saveTables(updatedTables);
  };

  const updateTable = async (id: string, updates: Partial<Table>) => {
    const updatedTables = tables.map((t) =>
      t.id === id ? { ...t, ...updates } : t
    );
    setTables(updatedTables);
    await saveTables(updatedTables);
  };

  const deleteTable = async (id: string) => {
    const updatedTables = tables.filter((t) => t.id !== id);
    setTables(updatedTables);
    await saveTables(updatedTables);
  };

  const assignGuestToSeat = async (
    tableId: string,
    seatNumber: number,
    guestId: string,
    guestName: string
  ) => {
    const updatedTables = tables.map((table) => {
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
          assignedSeats: [...updatedSeats, { seatNumber, guestId, guestName }],
        };
      }
      // Remove guest from other tables
      return {
        ...table,
        assignedSeats: table.assignedSeats.filter((s) => s.guestId !== guestId),
      };
    });

    setTables(updatedTables);
    await saveTables(updatedTables);
  };

  const unassignSeat = async (tableId: string, seatNumber: number) => {
    const updatedTables = tables.map((table) => {
      if (table.id === tableId) {
        return {
          ...table,
          assignedSeats: table.assignedSeats.filter(
            (s) => s.seatNumber !== seatNumber
          ),
        };
      }
      return table;
    });

    setTables(updatedTables);
    await saveTables(updatedTables);
  };

  const getTotalSeatedGuests = () => {
    return tables.reduce((sum, table) => sum + table.assignedSeats.length, 0);
  };

  const autoAssignGuests = async (guests: any[]) => {
    // Simple auto-assign logic: distribute guests evenly across tables
    const confirmedGuests = guests.filter((g) => g.rsvpStatus === "yes");

    // Get currently seated guest IDs
    const seatedGuestIds = new Set(
      tables.flatMap((t) => t.assignedSeats.map((s) => s.guestId))
    );

    // Filter out already seated guests
    const unseatedGuests = confirmedGuests.filter(
      (g) => !seatedGuestIds.has(g.id)
    );

    let updatedTables = [...tables];
    let tableIndex = 0;

    for (const guest of unseatedGuests) {
      if (tableIndex >= updatedTables.length) break;

      // Find next available seat in current table
      let assigned = false;
      while (tableIndex < updatedTables.length && !assigned) {
        const table = updatedTables[tableIndex];
        const occupiedSeats = table.assignedSeats.map((s) => s.seatNumber);

        // Find first available seat number
        for (let seatNum = 1; seatNum <= table.seats; seatNum++) {
          if (!occupiedSeats.includes(seatNum)) {
            // Assign guest to this seat
            updatedTables = updatedTables.map((t) => {
              if (t.id === table.id) {
                return {
                  ...t,
                  assignedSeats: [
                    ...t.assignedSeats,
                    {
                      seatNumber: seatNum,
                      guestId: guest.id,
                      guestName: guest.name,
                    },
                  ],
                };
              }
              return t;
            });
            assigned = true;
            break;
          }
        }

        if (!assigned) {
          tableIndex++; // Move to next table if current is full
        }
      }
    }

    setTables(updatedTables);
    await saveTables(updatedTables);
  };

  const refreshSeatingChart = fetchSeatingChart;

  return {
    tables,
    loading,
    error,
    addTable,
    updateTable,
    deleteTable,
    assignGuestToSeat,
    unassignSeat,
    getTotalSeatedGuests,
    autoAssignGuests,
    refreshSeatingChart,
  };
}
