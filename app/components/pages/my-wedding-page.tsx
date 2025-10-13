import React, { useState } from "react";
import {
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Heart,
  CheckCircle,
  Circle,
  Edit2,
  Plus,
  MessageCircle,
  FileText,
  TrendingUp,
  Clock,
  Camera,
  QrCode,
  Download,
  Sparkles,
  ChevronRight,
  Music,
  Flower2,
  Cake,
  Mail,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { useRouter } from "~/contexts/router-context";
import { usePlanning } from "~/contexts/planning-context";

export const MyWeddingPage = () => {
  const { navigate } = useRouter();
  const { formData } = usePlanning();
  const [showAIChat, setShowAIChat] = useState(false);

  // Calculate days until wedding
  const getDaysUntilWedding = () => {
    if (!formData.weddingDate) return null;
    const wedding = new Date(formData.weddingDate);
    const today = new Date();
    const diff = Math.ceil(
      (wedding.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diff > 0 ? diff : 0;
  };

  const daysLeft = getDaysUntilWedding();

  // Sample tasks data
  const tasks = [
    {
      id: 1,
      title: "Book Venue",
      category: "Venue",
      completed: true,
      dueDate: "2024-12-15",
    },
    {
      id: 2,
      title: "Book Photographer",
      category: "Photo & Video",
      completed: true,
      dueDate: "2025-01-10",
    },
    {
      id: 3,
      title: "Book DJ/Band",
      category: "Music",
      completed: false,
      dueDate: "2025-02-01",
    },
    {
      id: 4,
      title: "Send Save-the-Dates",
      category: "Guests",
      completed: false,
      dueDate: "2025-03-01",
    },
    {
      id: 5,
      title: "Order Wedding Cake",
      category: "Sweets",
      completed: false,
      dueDate: "2025-04-15",
    },
    {
      id: 6,
      title: "Book Florist",
      category: "Decorations",
      completed: false,
      dueDate: "2025-04-20",
    },
  ];

  const completedTasks = tasks.filter((t) => t.completed).length;
  const progressPercent = Math.round((completedTasks / tasks.length) * 100);

  // Booked vendors
  const bookedVendors = [
    {
      id: 1,
      name: "Grand Ballroom Venue",
      category: "Venue",
      status: "Confirmed",
      image:
        "https://images.unsplash.com/photo-1519167758481-83f29da8fd36?w=200&q=80",
      contact: "info@grandballroom.com",
    },
    {
      id: 2,
      name: "Captured Moments Photo",
      category: "Photo & Video",
      status: "Pending",
      image:
        "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=200&q=80",
      contact: "hello@capturedmoments.com",
    },
  ];

  // Suggested vendors
  const suggestedVendors = [
    {
      id: 1,
      name: "DJ SoundWave",
      category: "Music & DJ",
      rating: 4.8,
      price: "$800-1200",
      match: 95,
    },
    {
      id: 2,
      name: "Sweet Dreams Bakery",
      category: "Sweets",
      rating: 4.9,
      price: "$500-800",
      match: 92,
    },
    {
      id: 3,
      name: "Bloom & Petal Florist",
      category: "Decorations",
      rating: 4.7,
      price: "$600-1000",
      match: 88,
    },
  ];

  // Budget breakdown
  const budgetAllocated = 28500;
  const budgetTotal = formData.budgetMax ? parseInt(formData.budgetMax) : 35000;
  const budgetPercent = Math.round((budgetAllocated / budgetTotal) * 100);

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col bg-pink-50 pb-20">
      {/* Header & Summary Banner */}
      <div className="bg-gradient-to-br from-rose-500 to-pink-600 text-white p-6 rounded-b-3xl shadow-lg">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">
              Welcome back, {formData.partner1Name || "Sarah"} 💍
            </h1>
            {daysLeft !== null && (
              <p className="text-white/90 text-sm">
                {daysLeft} days left until your big day!
              </p>
            )}
          </div>
          <button
            onClick={() => navigate("/planning/step-1")}
            className="bg-white/20 hover:bg-white/30 p-2 rounded-full backdrop-blur-sm"
          >
            <Edit2 className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Ring */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/90 text-sm mb-1">Planning Progress</p>
              <p className="text-2xl font-bold">{progressPercent}%</p>
            </div>
            <div className="relative">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="6"
                  fill="none"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="white"
                  strokeWidth="6"
                  fill="none"
                  strokeDasharray={`${progressPercent * 1.76} 176`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <CheckCircle className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
        {/* Wedding Overview Card */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-rose-50 to-pink-50 p-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-600" />
              Wedding Overview
            </h2>
          </div>
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-gray-500 uppercase font-medium">
                  Date
                </p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-rose-600" />
                  <p className="text-sm font-semibold text-gray-900">
                    {formData.weddingDate
                      ? new Date(formData.weddingDate).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )
                      : "Not set"}
                  </p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-500 uppercase font-medium">
                  Location
                </p>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-rose-600" />
                  <p className="text-sm font-semibold text-gray-900">
                    {formData.location || "TBD"}
                  </p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-500 uppercase font-medium">
                  Guests
                </p>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-rose-600" />
                  <p className="text-sm font-semibold text-gray-900">
                    {formData.guestCount || "—"}
                  </p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-500 uppercase font-medium">
                  Budget
                </p>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-rose-600" />
                  <p className="text-sm font-semibold text-gray-900">
                    {formData.budgetMin && formData.budgetMax
                      ? `$${parseInt(
                          formData.budgetMin
                        ).toLocaleString()}-${parseInt(
                          formData.budgetMax
                        ).toLocaleString()}`
                      : "—"}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                onClick={() => navigate("/planning/step-1")}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white rounded-full h-10 text-sm"
              >
                Edit Details
              </Button>
              <Button className="flex-1 bg-white border-2 border-gray-200 hover:bg-gray-50 text-gray-900 rounded-full h-10 text-sm">
                View Moodboard
              </Button>
            </div>
          </div>
        </div>

        {/* Planning Progress & Tasks */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                Planning Tasks
              </h2>
              <span className="text-sm font-medium text-blue-600">
                {completedTasks}/{tasks.length}
              </span>
            </div>
          </div>
          <div className="p-4 space-y-3">
            {/* AI Suggestion */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <div className="flex items-start gap-2">
                <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-blue-900 font-medium">
                    AI Suggestion
                  </p>
                  <p className="text-sm text-blue-800 mt-1">
                    Book your DJ/Band this month to secure your date!
                  </p>
                </div>
              </div>
            </div>

            {/* Task List */}
            <div className="space-y-2">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    className="w-5 h-5 rounded text-rose-600"
                    readOnly
                  />
                  <div className="flex-1">
                    <p
                      className={`text-sm font-medium ${
                        task.completed
                          ? "line-through text-gray-400"
                          : "text-gray-900"
                      }`}
                    >
                      {task.title}
                    </p>
                    <p className="text-xs text-gray-500">{task.category}</p>
                  </div>
                  <Clock className="w-4 h-4 text-gray-400" />
                </div>
              ))}
            </div>

            <button
              onClick={() => {}}
              className="flex items-center gap-2 text-sm font-medium text-rose-600 hover:text-rose-700 mt-3"
            >
              <Plus className="w-4 h-4" />
              Add Custom Task
            </button>
          </div>
        </div>

        {/* Booked Vendors */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-green-600" />
              Booked Vendors
            </h2>
          </div>
          <div className="p-4 space-y-3">
            {bookedVendors.map((vendor) => (
              <div
                key={vendor.id}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <div
                  className="w-12 h-12 bg-cover bg-center rounded-lg flex-shrink-0"
                  style={{ backgroundImage: `url(${vendor.image})` }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {vendor.name}
                  </p>
                  <p className="text-xs text-gray-500">{vendor.category}</p>
                  <span
                    className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                      vendor.status === "Confirmed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {vendor.status}
                  </span>
                </div>
                <button className="p-2 hover:bg-gray-200 rounded-full">
                  <MessageCircle className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            ))}

            <button
              onClick={() => navigate("/vendors")}
              className="flex items-center justify-center gap-2 w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-rose-400 hover:text-rose-600 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Add Vendor</span>
            </button>
          </div>
        </div>

        {/* Suggested Vendors */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                Recommended For You
              </h2>
              <button
                onClick={() => navigate("/vendors")}
                className="text-sm font-medium text-purple-600 hover:text-purple-700"
              >
                View All
              </button>
            </div>
          </div>
          <div className="p-4 space-y-3">
            {suggestedVendors.map((vendor) => (
              <div
                key={vendor.id}
                className="p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100 hover:border-rose-300 transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-gray-900">
                        {vendor.name}
                      </p>
                      <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                        {vendor.match}% match
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-1">
                      {vendor.category}
                    </p>
                    <div className="flex items-center gap-3 text-xs">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">★</span>
                        <span className="font-medium">{vendor.rating}</span>
                      </div>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-600">{vendor.price}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (vendor.category === "Music & DJ") navigate("/music-dj");
                    else if (vendor.category === "Sweets") navigate("/sweets");
                    else if (vendor.category === "Decorations")
                      navigate("/decorations");
                  }}
                  className="flex items-center justify-center gap-1 w-full bg-rose-600 hover:bg-rose-700 text-white rounded-full h-9 text-sm font-medium mt-2"
                >
                  View Profile
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Budget Overview */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                Budget Tracker
              </h2>
              <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
                Details
              </button>
            </div>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Allocated</span>
                <span className="text-sm font-semibold text-gray-900">
                  ${budgetAllocated.toLocaleString()} of $
                  {budgetTotal.toLocaleString()}
                </span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-green-500 rounded-full transition-all"
                  style={{ width: `${budgetPercent}%` }}
                />
              </div>
            </div>

            {/* Expense Breakdown */}
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-900">Breakdown</p>
              {[
                { category: "Venue", amount: 12000, color: "bg-rose-500" },
                {
                  category: "Photo & Video",
                  amount: 5000,
                  color: "bg-blue-500",
                },
                { category: "Catering", amount: 8000, color: "bg-green-500" },
                { category: "Music/DJ", amount: 2000, color: "bg-purple-500" },
                { category: "Other", amount: 1500, color: "bg-yellow-500" },
              ].map((item) => (
                <div
                  key={item.category}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                    <span className="text-gray-600">{item.category}</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    ${item.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <button className="flex items-center justify-center gap-2 w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg h-10 text-sm font-medium mt-3">
              <FileText className="w-4 h-4" />
              Export Budget Report
            </button>
          </div>
        </div>

        {/* Timeline Milestones */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-600" />
              Timeline Milestones
            </h2>
          </div>
          <div className="p-4">
            <div className="relative space-y-4">
              {[
                { month: "Dec 2024", task: "Book Venue", done: true },
                { month: "Jan 2025", task: "Book Photographer", done: true },
                { month: "Feb 2025", task: "Book DJ/Band", done: false },
                { month: "Mar 2025", task: "Send Invitations", done: false },
                {
                  month: "May 2025",
                  task: "Final Vendor Meetings",
                  done: false,
                },
              ].map((milestone, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        milestone.done
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      {milestone.done ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </div>
                    {idx < 4 && <div className="w-0.5 h-8 bg-gray-200 my-1" />}
                  </div>
                  <div className="flex-1 pb-2">
                    <p className="text-sm font-semibold text-gray-900">
                      {milestone.task}
                    </p>
                    <p className="text-xs text-gray-500">{milestone.month}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Guest QR & Gallery */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Camera className="w-5 h-5 text-pink-600" />
              Guest Gallery
            </h2>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  <QrCode className="w-7 h-7 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Guest Upload QR
                  </p>
                  <p className="text-xs text-gray-500">
                    Let guests share photos
                  </p>
                </div>
              </div>
              <button className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-4 py-2 text-sm font-medium">
                Generate
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center"
                >
                  <Camera className="w-6 h-6 text-gray-400" />
                </div>
              ))}
            </div>

            <button className="flex items-center justify-center gap-2 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg h-10 text-sm font-medium">
              <Download className="w-4 h-4" />
              Download All Photos
            </button>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden border-2 border-rose-200">
          <div className="bg-gradient-to-r from-rose-100 to-pink-100 p-4 border-b border-rose-200">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-rose-600" />
              AI Wedding Assistant
            </h2>
          </div>
          <div className="p-4 space-y-3">
            <div className="space-y-3">
              <div className="bg-rose-50 border border-rose-200 rounded-lg p-3">
                <p className="text-sm text-rose-900 font-medium mb-2">
                  💡 Weekly Insight
                </p>
                <p className="text-sm text-rose-800">
                  3 new vendors matching your style added near Los Angeles this
                  week!
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-900 font-medium mb-2">
                  ⏰ Timeline Alert
                </p>
                <p className="text-sm text-blue-800">
                  It's time to finalize your guest list and start sending
                  Save-the-Dates.
                </p>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                <p className="text-sm text-purple-900 font-medium mb-2">
                  ✨ Smart Recommendation
                </p>
                <p className="text-sm text-purple-800">
                  Based on your romantic theme, we found 5 florists specializing
                  in rose arrangements.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4">
              <button
                onClick={() => setShowAIChat(!showAIChat)}
                className="bg-rose-600 hover:bg-rose-700 text-white rounded-full h-10 text-sm font-medium"
              >
                Ask AI
              </button>
              <button className="bg-white border-2 border-gray-200 hover:bg-gray-50 text-gray-900 rounded-full h-10 text-sm font-medium">
                Optimize Plan
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate("/vendors")}
            className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-all"
          >
            <Users className="w-8 h-8 text-rose-600 mb-2" />
            <p className="text-sm font-semibold text-gray-900">Find Vendors</p>
          </button>
          <button className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-all">
            <Calendar className="w-8 h-8 text-blue-600 mb-2" />
            <p className="text-sm font-semibold text-gray-900">Timeline</p>
          </button>
          <button className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-all">
            <Users className="w-8 h-8 text-green-600 mb-2" />
            <p className="text-sm font-semibold text-gray-900">Guest List</p>
          </button>
          <button className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-all">
            <TrendingUp className="w-8 h-8 text-purple-600 mb-2" />
            <p className="text-sm font-semibold text-gray-900">Analytics</p>
          </button>
        </div>
      </main>

      {/* AI Chat Bubble (Floating) */}
      {showAIChat && (
        <div className="fixed bottom-24 right-4 left-4 max-w-md mx-auto bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 z-40">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <p className="font-semibold text-gray-900">AI Assistant</p>
            </div>
            <button
              onClick={() => setShowAIChat(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          <div className="space-y-2 mb-3 max-h-48 overflow-y-auto">
            <div className="bg-gray-100 rounded-lg p-3">
              <p className="text-sm text-gray-800">
                Hi! I can help you with vendor recommendations, budget planning,
                or timeline suggestions. What would you like to know?
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ask me anything..."
              className="flex-1 bg-gray-50 border border-gray-200 rounded-full h-10 px-4 text-sm"
            />
            <button className="bg-rose-600 hover:bg-rose-700 text-white rounded-full w-10 h-10 flex items-center justify-center">
              →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
