import React, { useState } from "react";
import {
  ArrowLeft,
  Plus,
  Edit2,
  Trash2,
  Users,
  Download,
  Share2,
  Sparkles,
  AlertCircle,
  CheckCircle,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Grid3x3,
  Search,
  X,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useRouter } from "~/contexts/router-context";
import { useSeating } from "~/hooks/use-seating";
import type { Table } from "~/hooks/use-seating";
import { useGuestList } from "~/hooks/use-guest-list";
import type { Guest } from "~/contexts/guest-list-context";

// Helper component to highlight search matches
const HighlightText = ({ text, query }: { text: string; query: string }) => {
  if (!query.trim()) return <>{text}</>;

  const parts = text.split(new RegExp(`(${query})`, "gi"));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={i} className="bg-yellow-200 text-gray-900 font-semibold">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
};

export const SeatingPlannerPage = () => {
  const { navigate } = useRouter();
  const {
    tables,
    loading: seatingLoading,
    addTable,
    updateTable,
    deleteTable,
    assignGuestToSeat,
    unassignSeat,
    getTotalSeatedGuests,
    autoAssignGuests,
  } = useSeating();
  const { guests, loading: guestsLoading, getStats } = useGuestList();
  const stats = getStats();
  const loading = seatingLoading || guestsLoading;

  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [showAddTable, setShowAddTable] = useState(false);
  const [viewMode, setViewMode] = useState<"visual" | "list">("visual");
  const [zoom, setZoom] = useState(100);
  const [showGuestPicker, setShowGuestPicker] = useState<{
    tableId: string;
    seatNumber: number;
  } | null>(null);
  const [draggedGuest, setDraggedGuest] = useState<Guest | null>(null);
  const [newTableForm, setNewTableForm] = useState({
    name: "",
    seats: 8,
    shape: "round" as "round" | "rectangle",
  });
  const [guestSearchQuery, setGuestSearchQuery] = useState("");

  const totalSeated = getTotalSeatedGuests();
  const seatingProgress = Math.round((totalSeated / stats.confirmed) * 100);
  const unseatedGuests = guests.filter(
    (g) =>
      g.rsvpStatus === "yes" &&
      !tables.some((t) => t.assignedSeats.some((s) => s.guestId === g.id))
  );

  // Filter guests based on search query
  const filterGuests = (guestList: Guest[]) => {
    if (!guestSearchQuery.trim()) return guestList;

    const query = guestSearchQuery.toLowerCase();
    return guestList.filter((guest) => {
      const name = guest.name.toLowerCase();
      const relationship = guest.relationship.toLowerCase();
      const mealPreference = guest.mealPreference?.toLowerCase() || "";

      return (
        name.includes(query) ||
        relationship.includes(query) ||
        mealPreference.includes(query)
      );
    });
  };

  const filteredUnseatedGuests = filterGuests(unseatedGuests);

  const handleAssignGuest = async (
    tableId: string,
    seatNumber: number,
    guestId: string
  ) => {
    const guest = guests.find((g) => g.id === guestId);
    if (guest) {
      await assignGuestToSeat(tableId, seatNumber, guestId, guest.name);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading seating chart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-pink-50 pb-20">
      {/* Header */}
      <header className="flex items-center p-4 lg:p-6 bg-white border-b border-gray-200">
        <button
          onClick={() => navigate("/guest-list")}
          className="text-gray-900"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg lg:text-xl font-bold text-center flex-1 text-gray-900 pr-6">
          Seating Planner
        </h1>
      </header>

      {/* Summary Stats */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-6 lg:p-8 shadow-lg">
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4 mb-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 lg:p-4 text-center">
            <p className="text-white/80 text-xs lg:text-sm mb-1">
              Total Guests
            </p>
            <p className="text-2xl lg:text-3xl font-bold">{stats.confirmed}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 lg:p-4 text-center">
            <p className="text-white/80 text-xs lg:text-sm mb-1">Seated</p>
            <p className="text-2xl lg:text-3xl font-bold">{totalSeated}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 lg:p-4 text-center">
            <p className="text-white/80 text-xs lg:text-sm mb-1">Tables</p>
            <p className="text-2xl lg:text-3xl font-bold">{tables.length}</p>
          </div>
        </div>

        {/* Progress */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white/90">Seating Progress</span>
            <span className="text-sm font-semibold">{seatingProgress}%</span>
          </div>
          <div className="w-full h-2 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all"
              style={{ width: `${seatingProgress}%` }}
            />
          </div>
        </div>

        {unseatedGuests.length > 0 && (
          <div className="mt-3 bg-amber-500/30 backdrop-blur-sm rounded-lg p-3">
            <p className="text-sm text-white flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {unseatedGuests.length} guests need seat assignments
            </p>
          </div>
        )}
      </div>

      {/* View Toggle & Actions */}
      <div className="p-4 lg:p-6 bg-white border-b border-gray-100">
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setViewMode("visual")}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
              viewMode === "visual"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            Visual Map
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
              viewMode === "list"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            List View
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              const nextTableNumber = tables.length + 1;
              setNewTableForm({
                name: `Table ${nextTableNumber}`,
                seats: 8,
                shape: "round",
              });
              setShowAddTable(true);
            }}
            className="flex-1 flex items-center justify-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg h-10 text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Table
          </button>
          <button
            onClick={() => autoAssignGuests(guests)}
            className="flex-1 flex items-center justify-center gap-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg h-10 text-sm font-medium"
          >
            <Sparkles className="w-4 h-4" />
            Auto-Assign
          </button>
        </div>
      </div>

      <main className="flex-1 px-4 lg:px-8 py-4 lg:py-6 overflow-y-auto">
        <div className="lg:grid lg:grid-cols-3 lg:gap-6 space-y-4 lg:space-y-0">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-4 lg:space-y-6">
            {/* Quick Start Guide */}
            {unseatedGuests.length > 0 && tables.length > 0 && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-blue-900 mb-2">
                      How to Assign Guests
                    </p>
                    <ul className="text-xs text-blue-800 space-y-1">
                      <li>
                        • <strong>Drag & Drop:</strong> Drag guests from the
                        sidebar to tables
                      </li>
                      <li>
                        • <strong>Click Seat:</strong> Click "+ Add" on any
                        empty seat to pick a guest
                      </li>
                      <li>
                        • <strong>Quick Assign:</strong> Select a table, then
                        click on a guest
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* AI Suggestion */}
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 border-2 border-purple-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-purple-900 mb-1">
                    AI Seating Suggestion
                  </p>
                  <p className="text-sm text-purple-800 mb-3">
                    I can help you seat family members together near the main
                    table and group friends by age. Want me to optimize the
                    layout?
                  </p>
                  <button className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-4 py-2 text-xs font-medium">
                    Optimize Seating
                  </button>
                </div>
              </div>
            </div>

            {/* Visual Map View */}
            {viewMode === "visual" && (
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-3 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="text-base font-bold text-gray-900">
                    Floor Plan
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setZoom(Math.max(50, zoom - 10))}
                      className="p-1.5 hover:bg-white/50 rounded"
                    >
                      <ZoomOut className="w-4 h-4 text-gray-600" />
                    </button>
                    <span className="text-xs font-medium text-gray-600">
                      {zoom}%
                    </span>
                    <button
                      onClick={() => setZoom(Math.min(150, zoom + 10))}
                      className="p-1.5 hover:bg-white/50 rounded"
                    >
                      <ZoomIn className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Simplified Visual Canvas */}
                <div className="p-4 lg:p-6 bg-gray-50 min-h-[400px] lg:min-h-[600px] relative">
                  <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
                    {tables.map((table) => {
                      const isFull = table.assignedSeats.length >= table.seats;
                      return (
                        <button
                          key={table.id}
                          onClick={() => setSelectedTable(table)}
                          onDragOver={(e) => {
                            if (draggedGuest && !isFull) {
                              e.preventDefault();
                              e.currentTarget.classList.add(
                                "ring-4",
                                "ring-indigo-400"
                              );
                            }
                          }}
                          onDragLeave={(e) => {
                            e.currentTarget.classList.remove(
                              "ring-4",
                              "ring-indigo-400"
                            );
                          }}
                          onDrop={async (e) => {
                            e.preventDefault();
                            e.currentTarget.classList.remove(
                              "ring-4",
                              "ring-indigo-400"
                            );
                            if (draggedGuest && !isFull) {
                              const nextSeat = table.assignedSeats.length + 1;
                              await handleAssignGuest(
                                table.id,
                                nextSeat,
                                draggedGuest.id
                              );
                              setDraggedGuest(null);
                            }
                          }}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            selectedTable?.id === table.id
                              ? "border-indigo-600 bg-indigo-50 shadow-lg"
                              : "border-gray-300 bg-white hover:border-indigo-300"
                          } ${isFull ? "opacity-60" : ""}`}
                          style={{ backgroundColor: table.color }}
                        >
                          <div className="text-center">
                            <div
                              className={`w-20 h-20 mx-auto mb-2 border-4 border-gray-700 flex items-center justify-center text-gray-700 font-bold ${
                                table.shape === "round"
                                  ? "rounded-full"
                                  : "rounded-lg"
                              }`}
                              style={{
                                backgroundColor: "rgba(255,255,255,0.8)",
                              }}
                            >
                              {table.assignedSeats.length}/{table.seats}
                            </div>
                            <p className="text-xs font-semibold text-gray-900 mb-1">
                              {table.name}
                            </p>
                            <p className="text-xs text-gray-600">
                              {table.assignedSeats.length} seated
                            </p>
                            {isFull && (
                              <p className="text-xs text-red-600 font-medium mt-1">
                                Full
                              </p>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {tables.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <Grid3x3 className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No tables yet</p>
                        <button
                          onClick={() => setShowAddTable(true)}
                          className="mt-3 text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                        >
                          Add your first table
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* List View */}
            {viewMode === "list" && (
              <div className="space-y-3">
                {tables.map((table) => (
                  <div
                    key={table.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                  >
                    <div
                      className="p-4"
                      style={{ backgroundColor: table.color || "#fff" }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="text-base font-semibold text-gray-900 mb-1">
                            {table.name}
                          </h4>
                          <div className="flex items-center gap-3 text-xs text-gray-600">
                            <span>
                              {table.shape === "round" ? "🔵" : "⬜"}{" "}
                              {table.shape}
                            </span>
                            <span>•</span>
                            <span>{table.seats} seats</span>
                            <span>•</span>
                            <span>
                              {table.assignedSeats.length}/{table.seats}{" "}
                              assigned
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => setSelectedTable(table)}
                            className="p-2 hover:bg-white/50 rounded-lg"
                          >
                            <Edit2 className="w-4 h-4 text-gray-600" />
                          </button>
                          <button
                            onClick={async () => {
                              if (confirm(`Delete ${table.name}?`)) {
                                await deleteTable(table.id);
                              }
                            }}
                            className="p-2 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </div>

                      {table.assignedSeats.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-xs font-semibold text-gray-700 mb-2">
                            Seated Guests:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {table.assignedSeats.map((seat) => (
                              <span
                                key={seat.seatNumber}
                                className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs"
                              >
                                {seat.seatNumber}. {seat.guestName}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1 space-y-4 lg:space-y-6">
            {/* Unseated Guests */}
            {unseatedGuests.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                    <Users className="w-5 h-5 text-amber-600" />
                    Unseated Guests ({unseatedGuests.length})
                  </h3>
                </div>

                {/* Search Input */}
                <div className="mb-3 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search by name, category, or meal..."
                    value={guestSearchQuery}
                    onChange={(e) => setGuestSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-10 h-10 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                  />
                  {guestSearchQuery && (
                    <button
                      onClick={() => setGuestSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs text-blue-800">
                    💡 <strong>Tip:</strong>{" "}
                    {selectedTable
                      ? `Click a guest to assign to ${selectedTable.name} or drag to any table`
                      : "Drag guests to tables or click a table seat to assign"}
                  </p>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {filteredUnseatedGuests.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-500">
                        {guestSearchQuery
                          ? "No guests match your search"
                          : "No unseated guests"}
                      </p>
                    </div>
                  ) : (
                    filteredUnseatedGuests.map((guest) => (
                      <div
                        key={guest.id}
                        draggable
                        onDragStart={(e) => {
                          setDraggedGuest(guest);
                          e.currentTarget.classList.add("opacity-50");
                        }}
                        onDragEnd={(e) => {
                          setDraggedGuest(null);
                          e.currentTarget.classList.remove("opacity-50");
                        }}
                        onClick={async () => {
                          if (selectedTable) {
                            const nextSeat =
                              selectedTable.assignedSeats.length + 1;
                            if (nextSeat <= selectedTable.seats) {
                              await handleAssignGuest(
                                selectedTable.id,
                                nextSeat,
                                guest.id
                              );
                            } else {
                              alert(
                                "This table is full! Select another table or drag the guest."
                              );
                            }
                          }
                        }}
                        className={`flex items-center justify-between p-3 bg-amber-50 border-2 rounded-lg cursor-move hover:shadow-md transition-all ${
                          selectedTable
                            ? "border-indigo-300 hover:border-indigo-500 hover:bg-indigo-50"
                            : "border-amber-200 hover:border-amber-400"
                        }`}
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            <HighlightText
                              text={guest.name}
                              query={guestSearchQuery}
                            />
                          </p>
                          <p className="text-xs text-gray-500">
                            <HighlightText
                              text={guest.relationship}
                              query={guestSearchQuery}
                            />{" "}
                            •{" "}
                            <HighlightText
                              text={guest.mealPreference}
                              query={guestSearchQuery}
                            />
                          </p>
                        </div>
                        <div className="text-gray-400 text-xs">⋮⋮</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Selected Table Details */}
            {selectedTable && (
              <div className="bg-white rounded-xl shadow-md border-2 border-indigo-200 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-100 to-purple-100 p-4 border-b border-indigo-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-gray-900">
                      {selectedTable.name}
                    </h3>
                    <button
                      onClick={() => setSelectedTable(null)}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedTable.assignedSeats.length} of{" "}
                    {selectedTable.seats} seats filled
                  </p>
                </div>

                <div className="p-4">
                  {/* Seat Grid */}
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {Array.from(
                      { length: selectedTable.seats },
                      (_, i) => i + 1
                    ).map((seatNum) => {
                      const seat = selectedTable.assignedSeats.find(
                        (s) => s.seatNumber === seatNum
                      );
                      return (
                        <button
                          key={seatNum}
                          onClick={async () => {
                            if (seat) {
                              if (
                                confirm(
                                  `Remove ${seat.guestName} from this seat?`
                                )
                              ) {
                                await unassignSeat(selectedTable.id, seatNum);
                              }
                            } else {
                              // Open guest picker for empty seat
                              setShowGuestPicker({
                                tableId: selectedTable.id,
                                seatNumber: seatNum,
                              });
                            }
                          }}
                          onDragOver={(e) => {
                            if (draggedGuest && !seat) {
                              e.preventDefault();
                              e.currentTarget.classList.add(
                                "ring-2",
                                "ring-indigo-400"
                              );
                            }
                          }}
                          onDragLeave={(e) => {
                            e.currentTarget.classList.remove(
                              "ring-2",
                              "ring-indigo-400"
                            );
                          }}
                          onDrop={async (e) => {
                            e.preventDefault();
                            e.currentTarget.classList.remove(
                              "ring-2",
                              "ring-indigo-400"
                            );
                            if (draggedGuest && !seat) {
                              await handleAssignGuest(
                                selectedTable.id,
                                seatNum,
                                draggedGuest.id
                              );
                              setDraggedGuest(null);
                            }
                          }}
                          className={`aspect-square rounded-lg border-2 flex flex-col items-center justify-center p-2 text-xs transition-all ${
                            seat
                              ? "bg-green-100 border-green-400 hover:border-green-600"
                              : "bg-gray-50 border-gray-300 hover:border-indigo-400 hover:bg-indigo-50 cursor-pointer"
                          }`}
                        >
                          <span className="font-bold text-gray-700 mb-1">
                            {seatNum}
                          </span>
                          {seat ? (
                            <span className="text-center text-xs leading-tight text-gray-800 font-medium line-clamp-2">
                              {seat.guestName}
                            </span>
                          ) : (
                            <span className="text-indigo-400 font-medium">
                              + Add
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">
                        Table Name
                      </label>
                      <Input
                        value={selectedTable.name}
                        onChange={(e) =>
                          updateTable(selectedTable.id, {
                            name: e.target.value,
                          })
                        }
                        onBlur={(e) =>
                          updateTable(selectedTable.id, {
                            name: e.target.value,
                          })
                        }
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg h-10 px-3 text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">
                        Number of Seats
                      </label>
                      <Input
                        type="number"
                        min="2"
                        max="20"
                        value={selectedTable.seats}
                        onChange={(e) => {
                          const newSeats = parseInt(e.target.value);
                          if (!isNaN(newSeats)) {
                            updateTable(selectedTable.id, { seats: newSeats });
                          }
                        }}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg h-10 px-3 text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">
                        Table Shape
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() =>
                            updateTable(selectedTable.id, { shape: "round" })
                          }
                          className={`p-3 rounded-lg border-2 transition-all ${
                            selectedTable.shape === "round"
                              ? "border-indigo-600 bg-indigo-50"
                              : "border-gray-200"
                          }`}
                        >
                          <div className="w-12 h-12 mx-auto rounded-full border-4 border-gray-700" />
                          <p className="text-xs font-medium mt-2">Round</p>
                        </button>
                        <button
                          onClick={() =>
                            updateTable(selectedTable.id, {
                              shape: "rectangle",
                            })
                          }
                          className={`p-3 rounded-lg border-2 transition-all ${
                            selectedTable.shape === "rectangle"
                              ? "border-indigo-600 bg-indigo-50"
                              : "border-gray-200"
                          }`}
                        >
                          <div className="w-12 h-8 mx-auto rounded-lg border-4 border-gray-700" />
                          <p className="text-xs font-medium mt-2">Rectangle</p>
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">
                        Notes
                      </label>
                      <textarea
                        value={selectedTable.notes || ""}
                        onChange={(e) =>
                          updateTable(selectedTable.id, {
                            notes: e.target.value,
                          })
                        }
                        placeholder="e.g., Near dance floor, window view..."
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm min-h-[60px]"
                      />
                    </div>

                    <button
                      onClick={async () => {
                        if (confirm(`Delete ${selectedTable.name}?`)) {
                          await deleteTable(selectedTable.id);
                          setSelectedTable(null);
                        }
                      }}
                      className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg h-10 text-sm font-medium"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Table
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Table List View */}
            {viewMode === "list" && (
              <div className="space-y-3">
                {tables.map((table) => (
                  <div
                    key={table.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
                    style={{ backgroundColor: table.color || "#fff" }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="text-base font-semibold text-gray-900">
                          {table.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {table.assignedSeats.length}/{table.seats} seats •{" "}
                          {table.shape}
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedTable(table)}
                        className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                      >
                        Manage
                      </button>
                    </div>

                    {table.assignedSeats.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {table.assignedSeats.map((seat) => (
                          <span
                            key={seat.seatNumber}
                            className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded text-xs"
                          >
                            {seat.guestName}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Export Options */}
            <div className="bg-white rounded-xl shadow-md p-4 lg:p-5">
              <h3 className="text-base font-bold text-gray-900 mb-3">
                Export & Share
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg h-10 text-sm font-medium">
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
                <button className="flex items-center justify-center gap-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg h-10 text-sm font-medium">
                  <Share2 className="w-4 h-4" />
                  Share Link
                </button>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-xl shadow-sm p-4">
                <p className="text-xs text-gray-500 mb-1">Avg Guests/Table</p>
                <p className="text-2xl font-bold text-gray-900">
                  {tables.length > 0
                    ? Math.round(totalSeated / tables.length)
                    : 0}
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-4">
                <p className="text-xs text-gray-500 mb-1">Empty Seats</p>
                <p className="text-2xl font-bold text-gray-900">
                  {tables.reduce((sum, t) => sum + t.seats, 0) - totalSeated}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Guest Picker Modal */}
      {showGuestPicker && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] flex flex-col">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 flex items-center justify-between rounded-t-2xl">
              <h3 className="text-lg font-bold">
                Select Guest for Seat #{showGuestPicker.seatNumber}
              </h3>
              <button
                onClick={() => {
                  setShowGuestPicker(null);
                  setGuestSearchQuery("");
                }}
                className="text-white/80 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Search Input in Modal */}
            <div className="p-4 pb-2 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by name, category, or meal..."
                  value={guestSearchQuery}
                  onChange={(e) => setGuestSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 h-10 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                  autoFocus
                />
                {guestSearchQuery && (
                  <button
                    onClick={() => setGuestSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              {filteredUnseatedGuests.length > 0 && (
                <p className="text-xs text-gray-500 mt-2">
                  Showing {filteredUnseatedGuests.length} of{" "}
                  {unseatedGuests.length} guests
                </p>
              )}
            </div>

            <div className="p-4 overflow-y-auto flex-1">
              {unseatedGuests.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <p className="text-gray-600">All guests are seated!</p>
                </div>
              ) : filteredUnseatedGuests.length === 0 ? (
                <div className="text-center py-8">
                  <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600">No guests match your search</p>
                  <button
                    onClick={() => setGuestSearchQuery("")}
                    className="mt-2 text-sm text-indigo-600 hover:text-indigo-700"
                  >
                    Clear search
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredUnseatedGuests.map((guest) => (
                    <button
                      key={guest.id}
                      onClick={async () => {
                        await handleAssignGuest(
                          showGuestPicker.tableId,
                          showGuestPicker.seatNumber,
                          guest.id
                        );
                        setShowGuestPicker(null);
                        setGuestSearchQuery("");
                      }}
                      className="w-full text-left p-3 bg-gray-50 hover:bg-indigo-50 border-2 border-gray-200 hover:border-indigo-400 rounded-lg transition-all"
                    >
                      <p className="text-sm font-medium text-gray-900">
                        <HighlightText
                          text={guest.name}
                          query={guestSearchQuery}
                        />
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        <HighlightText
                          text={guest.relationship}
                          query={guestSearchQuery}
                        />{" "}
                        •{" "}
                        <HighlightText
                          text={guest.mealPreference}
                          query={guestSearchQuery}
                        />
                        {guest.plusOnes > 0 && ` • +${guest.plusOnes}`}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="p-4 border-t border-gray-200">
              <Button
                onClick={() => {
                  setShowGuestPicker(null);
                  setGuestSearchQuery("");
                }}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-full h-12"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Table Modal */}
      {showAddTable && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowAddTable(false);
              setNewTableForm({ name: "", seats: 8, shape: "round" });
            }
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 flex items-center justify-between rounded-t-2xl">
              <h3 className="text-lg font-bold">Add New Table</h3>
              <button
                onClick={() => {
                  setShowAddTable(false);
                  setNewTableForm({ name: "", seats: 8, shape: "round" });
                }}
                className="text-white/80 hover:text-white"
              >
                ✕
              </button>
            </div>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (newTableForm.name.trim()) {
                  await addTable({
                    name: newTableForm.name.trim(),
                    seats: newTableForm.seats,
                    shape: newTableForm.shape,
                    position: { x: 100, y: 100 },
                    color: "#F5F5F5",
                  });
                  setShowAddTable(false);
                  setNewTableForm({ name: "", seats: 8, shape: "round" });
                }
              }}
              className="p-4 space-y-4"
            >
              <p className="text-sm text-gray-600">
                Create a new table for your seating arrangement. You can assign
                guests after creating the table.
              </p>

              <div>
                <label className="text-sm font-semibold text-gray-900 mb-2 block">
                  Table Name *
                </label>
                <Input
                  value={newTableForm.name}
                  onChange={(e) =>
                    setNewTableForm({ ...newTableForm, name: e.target.value })
                  }
                  placeholder="e.g., Table 4 - Cousins"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg h-12 px-4"
                  autoFocus
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-900 mb-2 block">
                  Number of Seats *
                </label>
                <Input
                  type="number"
                  min="2"
                  max="20"
                  value={newTableForm.seats}
                  onChange={(e) =>
                    setNewTableForm({
                      ...newTableForm,
                      seats: parseInt(e.target.value) || 2,
                    })
                  }
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg h-12 px-4"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-900 mb-2 block">
                  Table Shape *
                </label>
                <select
                  value={newTableForm.shape}
                  onChange={(e) =>
                    setNewTableForm({
                      ...newTableForm,
                      shape: e.target.value as "round" | "rectangle",
                    })
                  }
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg h-12 px-4"
                >
                  <option value="round">Round</option>
                  <option value="rectangle">Rectangle</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  type="submit"
                  disabled={!newTableForm.name.trim()}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full h-12 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Table
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setShowAddTable(false);
                    setNewTableForm({ name: "", seats: 8, shape: "round" });
                  }}
                  className="flex-1 bg-white border-2 border-gray-200 hover:bg-gray-50 text-gray-900 rounded-full h-12"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
