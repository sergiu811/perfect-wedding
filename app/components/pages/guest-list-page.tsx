import {
  ArrowLeft,
  Clock,
  Download,
  Edit2,
  Mail,
  MessageCircle,
  PieChart,
  Plus,
  QrCode,
  Search,
  Sparkles,
  Trash2,
  Upload,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import type { Guest } from "~/contexts/guest-list-context";
import { useGuestList } from "~/hooks/use-guest-list";
import { useRouter } from "~/contexts/router-context";

export const GuestListPage = () => {
  const { navigate } = useRouter();
  const {
    guests,
    loading,
    getStats,
    addGuest,
    updateGuest,
    deleteGuest,
    importGuests,
    exportGuests,
  } = useGuestList();
  const stats = getStats();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterRSVP, setFilterRSVP] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [formData, setFormData] = useState<Partial<Guest>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Filter guests
  const filteredGuests = guests.filter((guest) => {
    const matchesSearch =
      guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guest.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterRSVP === "all" || guest.rsvpStatus === filterRSVP;
    return matchesSearch && matchesFilter;
  });

  // Meal preference breakdown
  const mealStats = guests.reduce((acc: any, guest) => {
    acc[guest.mealPreference] = (acc[guest.mealPreference] || 0) + 1;
    return acc;
  }, {});

  // Relationship breakdown
  const relationshipStats = guests.reduce((acc: any, guest) => {
    acc[guest.relationship] = (acc[guest.relationship] || 0) + 1;
    return acc;
  }, {});

  const confirmedPercentage = Math.round((stats.confirmed / stats.total) * 100);

  // Handle add/edit guest
  const handleOpenAddModal = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      relationship: "Friend",
      rsvpStatus: "pending",
      mealPreference: "Standard",
      plusOnes: 0,
      tableNumber: "",
      notes: "",
    });
    setEditingGuest(null);
    setShowAddModal(true);
    setError("");
  };

  const handleOpenEditModal = (guest: Guest) => {
    setFormData(guest);
    setEditingGuest(guest);
    setShowAddModal(true);
    setError("");
  };

  const handleSaveGuest = async () => {
    if (!formData.name || !formData.relationship) {
      setError("Name and relationship are required");
      return;
    }

    setSaving(true);
    setError("");

    try {
      if (editingGuest) {
        await updateGuest(editingGuest.id, formData);
      } else {
        await addGuest(formData as Omit<Guest, "id">);
      }
      setShowAddModal(false);
      setFormData({});
    } catch (err) {
      setError("Failed to save guest. Please try again.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteGuest = async (id: string) => {
    if (!confirm("Are you sure you want to delete this guest?")) return;

    try {
      await deleteGuest(id);
    } catch (err) {
      alert("Failed to delete guest");
      console.error(err);
    }
  };

  // Handle CSV import
  const handleImportCSV = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const text = await file.text();
      const lines = text.split("\n");

      const guestsToImport: Omit<Guest, "id">[] = [];

      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;

        const values = lines[i].split(",");
        guestsToImport.push({
          name: values[0] || "",
          email: values[1] || undefined,
          phone: values[2] || undefined,
          relationship: values[3] || "Friend",
          rsvpStatus: (values[4] as "yes" | "no" | "pending") || "pending",
          mealPreference: values[5] || "standard",
          plusOnes: parseInt(values[6]) || 0,
          tableNumber: values[7] || undefined,
          giftStatus: (values[8] as "pending" | "received" | "na") || undefined,
          notes: values[9]?.replace(/\r/g, "") || undefined, // ✅ removes \r
        });
      }

      try {
        await importGuests(guestsToImport);
        alert(`Successfully imported ${guestsToImport.length} guests`);
      } catch (err) {
        alert("Failed to import guests");
        console.error(err);
      }
    };
    input.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading guests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-pink-50 pb-20">
      {/* Header */}
      <header className="flex items-center p-4 lg:p-6 bg-white border-b border-gray-200">
        <button
          onClick={() => navigate("/my-wedding")}
          className="text-gray-900"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg lg:text-xl font-bold text-center flex-1 text-gray-900 pr-6">
          Guest List
        </h1>
      </header>

      {/* Summary Stats Header */}
      <div className="bg-gradient-to-br from-rose-500 to-pink-600 text-white p-6 lg:p-8 shadow-lg">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 lg:p-4">
            <p className="text-white/80 text-xs lg:text-sm mb-1">
              Total Guests
            </p>
            <p className="text-3xl lg:text-4xl font-bold">{stats.total}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 lg:p-4">
            <p className="text-white/80 text-xs lg:text-sm mb-1">Confirmed</p>
            <p className="text-3xl lg:text-4xl font-bold">
              {stats.confirmed}
              <span className="text-lg ml-1">({confirmedPercentage}%)</span>
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 lg:p-4">
            <p className="text-white/80 text-xs lg:text-sm mb-1">Pending</p>
            <p className="text-3xl lg:text-4xl font-bold">{stats.pending}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 lg:p-4">
            <p className="text-white/80 text-xs lg:text-sm mb-1">Declined</p>
            <p className="text-3xl lg:text-4xl font-bold">{stats.declined}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white/90">RSVP Progress</span>
            <span className="text-sm font-semibold">
              {confirmedPercentage}%
            </span>
          </div>
          <div className="w-full h-2 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all"
              style={{ width: `${confirmedPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 lg:p-6 bg-white border-b border-gray-100">
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-2 lg:gap-3">
          <button
            onClick={handleOpenAddModal}
            className="flex flex-col items-center gap-1 p-3 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5 text-rose-600" />
            <span className="text-xs font-medium text-rose-700">Add Guest</span>
          </button>
          <button
            onClick={handleImportCSV}
            className="flex flex-col items-center gap-1 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <Upload className="w-5 h-5 text-blue-600" />
            <span className="text-xs font-medium text-blue-700">Import</span>
          </button>
          <button
            onClick={exportGuests}
            className="flex flex-col items-center gap-1 p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
          >
            <Download className="w-5 h-5 text-green-600" />
            <span className="text-xs font-medium text-green-700">Export</span>
          </button>
          <button
            onClick={() => setShowAnalytics(!showAnalytics)}
            className="flex flex-col items-center gap-1 p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
          >
            <PieChart className="w-5 h-5 text-purple-600" />
            <span className="text-xs font-medium text-purple-700">
              Analytics
            </span>
          </button>
        </div>
      </div>

      <main className="flex-1 px-4 lg:px-8 py-4 lg:py-6 space-y-4 lg:space-y-6 overflow-y-auto">
        {/* Search & Filter */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="search"
              placeholder="Search guests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-lg h-12 pl-10 pr-4"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setFilterRSVP("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filterRSVP === "all"
                  ? "bg-rose-600 text-white"
                  : "bg-white text-gray-600 border border-gray-200"
              }`}
            >
              All ({stats.total})
            </button>
            <button
              onClick={() => setFilterRSVP("yes")}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filterRSVP === "yes"
                  ? "bg-green-600 text-white"
                  : "bg-white text-gray-600 border border-gray-200"
              }`}
            >
              Confirmed ({stats.confirmed})
            </button>
            <button
              onClick={() => setFilterRSVP("pending")}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filterRSVP === "pending"
                  ? "bg-amber-600 text-white"
                  : "bg-white text-gray-600 border border-gray-200"
              }`}
            >
              Pending ({stats.pending})
            </button>
            <button
              onClick={() => setFilterRSVP("no")}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filterRSVP === "no"
                  ? "bg-red-600 text-white"
                  : "bg-white text-gray-600 border border-gray-200"
              }`}
            >
              Declined ({stats.declined})
            </button>
          </div>
        </div>

        {/* Analytics Panel */}
        {showAnalytics && (
          <div className="bg-white rounded-xl shadow-md p-4 space-y-4 border-2 border-purple-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-purple-600" />
                Guest Analytics
              </h3>
              <button
                onClick={() => setShowAnalytics(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {/* Meal Preferences */}
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-2">
                Meal Preferences
              </p>
              <div className="space-y-2">
                {Object.entries(mealStats).map(
                  ([meal, count]: [string, any]) => {
                    const percentage = Math.round((count / stats.total) * 100);
                    return (
                      <div key={meal}>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600">{meal}</span>
                          <span className="font-semibold text-gray-900">
                            {count} ({percentage}%)
                          </span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full">
                          <div
                            className="h-full bg-purple-500 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>

            {/* Relationship Breakdown */}
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-2">
                Relationship Groups
              </p>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(relationshipStats).map(
                  ([rel, count]: [string, any]) => (
                    <div key={rel} className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500">{rel}</p>
                      <p className="text-xl font-bold text-gray-900">{count}</p>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-900">
                <span className="font-semibold">💡 Budget Impact:</span> With{" "}
                {stats.confirmed} confirmed guests at $85/person, estimated
                catering cost is ${(stats.confirmed * 85).toLocaleString()}.
              </p>
            </div>
          </div>
        )}

        {/* Communication Tools */}
        <div className="bg-white rounded-xl shadow-md p-4">
          <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-blue-600" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg h-10 text-sm font-medium">
              <Mail className="w-4 h-4" />
              Send Invites
            </button>
            <button className="flex items-center justify-center gap-2 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg h-10 text-sm font-medium">
              <Clock className="w-4 h-4" />
              Remind Pending
            </button>
            <button className="flex items-center justify-center gap-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg h-10 text-sm font-medium">
              <Download className="w-4 h-4" />
              Export List
            </button>
            <button className="flex items-center justify-center gap-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg h-10 text-sm font-medium">
              <QrCode className="w-4 h-4" />
              RSVP QR
            </button>
          </div>
        </div>

        {/* AI Assistant Card */}
        <div className="bg-gradient-to-br from-rose-100 to-pink-100 border-2 border-rose-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-rose-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-rose-900 mb-1">
                AI Suggestion
              </p>
              <p className="text-sm text-rose-800 mb-3">
                {stats.pending} guests haven't replied yet. Want me to send a
                friendly reminder?
              </p>
              <button className="bg-rose-600 hover:bg-rose-700 text-white rounded-full px-4 py-2 text-xs font-medium">
                Send Auto-Reminder
              </button>
            </div>
          </div>
        </div>

        {/* Guest Cards */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base lg:text-lg font-bold text-gray-900">
            Guests ({filteredGuests.length})
          </h3>
        </div>

        <div className="space-y-3 lg:space-y-0 lg:grid lg:grid-cols-2 xl:grid-cols-3 lg:gap-4">
          {filteredGuests.map((guest) => (
            <div
              key={guest.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-base font-semibold text-gray-900">
                        {guest.name}
                      </h4>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          guest.rsvpStatus === "yes"
                            ? "bg-green-100 text-green-700"
                            : guest.rsvpStatus === "no"
                              ? "bg-red-100 text-red-700"
                              : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {guest.rsvpStatus === "yes"
                          ? "✓ Confirmed"
                          : guest.rsvpStatus === "no"
                            ? "✗ Declined"
                            : "⏳ Pending"}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {guest.email && (
                        <p className="text-xs text-gray-500">{guest.email}</p>
                      )}
                      {guest.phone && (
                        <p className="text-xs text-gray-500">{guest.phone}</p>
                      )}
                      <div className="flex items-center gap-3 text-xs text-gray-600 mt-2">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {guest.relationship}
                        </span>
                        {guest.tableNumber && (
                          <>
                            <span>•</span>
                            <span>Table {guest.tableNumber}</span>
                          </>
                        )}
                        {guest.plusOnes > 0 && (
                          <>
                            <span>•</span>
                            <span>+{guest.plusOnes}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleOpenEditModal(guest)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <Edit2 className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleDeleteGuest(guest.id)}
                      className="p-2 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-gray-600">
                      Meal:{" "}
                      <span className="font-medium">
                        {guest.mealPreference}
                      </span>
                    </span>
                    {guest.giftStatus && guest.giftStatus !== "na" && (
                      <span
                        className={`${
                          guest.giftStatus === "received"
                            ? "text-green-600"
                            : "text-gray-500"
                        }`}
                      >
                        🎁{" "}
                        {guest.giftStatus === "received"
                          ? "Received"
                          : "Pending"}
                      </span>
                    )}
                  </div>
                  <button className="text-rose-600 hover:text-rose-700 text-xs font-medium">
                    Message
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredGuests.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600 mb-2">No guests found</p>
            <p className="text-sm text-gray-500">Try adjusting your filters</p>
          </div>
        )}

        {/* Seating Planner Teaser */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-200">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-indigo-900 mb-1">
                Ready to Plan Seating?
              </p>
              <p className="text-xs text-indigo-700 mb-3">
                Assign tables and create your seating chart
              </p>
              <button
                onClick={() => navigate("/seating-planner")}
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-4 py-2 text-xs font-medium"
              >
                Open Seating Planner
              </button>
            </div>
          </div>
        </div>

        {/* Communication Templates */}
        <div className="bg-white rounded-xl shadow-md p-4">
          <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-600" />
            Message Templates
          </h3>
          <div className="space-y-2">
            {[
              { title: "Save-the-Date", status: "Sent to 95 guests" },
              { title: "RSVP Reminder", status: "Ready to send" },
              { title: "Final Details", status: "Draft" },
              { title: "Thank You Note", status: "Not sent" },
            ].map((template) => (
              <div
                key={template.title}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {template.title}
                  </p>
                  <p className="text-xs text-gray-500">{template.status}</p>
                </div>
                <button className="text-rose-600 hover:text-rose-700 text-xs font-medium">
                  Send
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-xs text-gray-500 mb-1">Plus-Ones</p>
            <p className="text-2xl font-bold text-gray-900">
              {guests.reduce((sum, g) => sum + g.plusOnes, 0)}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-xs text-gray-500 mb-1">Tables Needed</p>
            <p className="text-2xl font-bold text-gray-900">
              {Math.ceil(stats.confirmed / 8)}
            </p>
          </div>
        </div>
      </main>

      {/* Add/Edit Guest Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">
                {editingGuest ? "Edit Guest" : "Add New Guest"}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="p-4 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                  {error}
                </div>
              )}
              <div>
                <label className="text-sm font-semibold text-gray-900 mb-2 block">
                  Full Name *
                </label>
                <Input
                  value={formData.name || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="John Doe"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg h-12 px-4"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold text-gray-900 mb-2 block">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="email@example.com"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg h-12 px-4"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-900 mb-2 block">
                    Phone
                  </label>
                  <Input
                    value={formData.phone || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="555-0100"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg h-12 px-4"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-900 mb-2 block">
                  Relationship *
                </label>
                <select
                  value={formData.relationship || "Friend"}
                  onChange={(e) =>
                    setFormData({ ...formData, relationship: e.target.value })
                  }
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg h-12 px-4"
                >
                  <option value="Family">Family</option>
                  <option value="Friend">Friend</option>
                  <option value="Colleague">Colleague</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-900 mb-2 block">
                  RSVP Status
                </label>
                <select
                  value={formData.rsvpStatus || "pending"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      rsvpStatus: e.target.value as "yes" | "no" | "pending",
                    })
                  }
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg h-12 px-4"
                >
                  <option value="pending">Pending</option>
                  <option value="yes">Confirmed</option>
                  <option value="no">Declined</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-900 mb-2 block">
                  Meal Preference
                </label>
                <select
                  value={formData.mealPreference || "Standard"}
                  onChange={(e) =>
                    setFormData({ ...formData, mealPreference: e.target.value })
                  }
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg h-12 px-4"
                >
                  <option value="Standard">Standard</option>
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Vegan">Vegan</option>
                  <option value="Gluten-Free">Gluten-Free</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-900 mb-2 block">
                  Plus-Ones
                </label>
                <Input
                  type="number"
                  min="0"
                  value={formData.plusOnes || 0}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      plusOnes: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg h-12 px-4"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-900 mb-2 block">
                  Table Number (Optional)
                </label>
                <Input
                  value={formData.tableNumber || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, tableNumber: e.target.value })
                  }
                  placeholder="e.g., 5"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg h-12 px-4"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-900 mb-2 block">
                  Notes
                </label>
                <textarea
                  value={formData.notes || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="Special dietary needs, accessibility requirements..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-4 min-h-[80px]"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  onClick={handleSaveGuest}
                  disabled={saving}
                  className="flex-1 bg-rose-600 hover:bg-rose-700 text-white rounded-full h-12 disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingGuest
                      ? "Update Guest"
                      : "Add Guest"}
                </Button>
                <Button
                  onClick={() => setShowAddModal(false)}
                  disabled={saving}
                  className="flex-1 bg-white border-2 border-gray-200 hover:bg-gray-50 text-gray-900 rounded-full h-12"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
