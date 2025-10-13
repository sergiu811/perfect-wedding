import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useRouter } from "~/contexts/router-context";

export const VendorDashboard = () => {
  const { navigate } = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");

  // Sample listings data
  const listings = [
    {
      id: 1,
      name: "Full Wedding Package",
      price: "$5,000",
      image:
        "https://images.unsplash.com/photo-1519167758481-83f29da8fd36?w=400&q=80",
    },
    {
      id: 2,
      name: "Day-of Coordination",
      price: "$1,500",
      image:
        "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&q=80",
    },
    {
      id: 3,
      name: "Venue Selection",
      price: "$800",
      image:
        "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80",
    },
  ];

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col justify-between overflow-x-hidden bg-pink-50">
      <div>
        {/* Header */}
        <header className="flex items-center bg-pink-50 p-4 pb-2 justify-between sticky top-0 z-10">
          <button onClick={() => navigate("/")} className="text-gray-900">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold text-gray-900 leading-tight flex-1 text-center pr-6">
            Vendor Dashboard
          </h1>
        </header>

        <main className="p-4 space-y-6">
          {/* Profile Card */}
          <div className="rounded-xl bg-white p-4 shadow-sm space-y-4">
            <div className="flex items-stretch justify-between gap-4">
              <div className="flex flex-col gap-1.5 flex-1">
                <p className="text-rose-600/70 text-sm font-normal">
                  Wedding Planner
                </p>
                <p className="text-gray-900 text-lg font-bold leading-tight">
                  Elegant Events Co.
                </p>
                <p className="text-rose-600/70 text-sm font-normal mt-1">
                  Specializing in luxury weddings, Elegant Events Co. offers
                  bespoke planning services.
                </p>
              </div>
              <div
                className="w-24 h-24 bg-center bg-no-repeat bg-cover rounded-lg flex-shrink-0"
                style={{
                  backgroundImage:
                    'url("https://images.unsplash.com/photo-1519167758481-83f29da8fd36?w=400&q=80")',
                }}
              />
            </div>
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              className="w-full border-2 border-rose-600 text-rose-600 hover:bg-rose-50 font-semibold rounded-lg h-11"
            >
              View Public Profile
            </Button>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-rose-600/20">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex-1 py-3 text-center text-sm font-bold ${
                activeTab === "dashboard"
                  ? "text-rose-600 border-b-2 border-rose-600"
                  : "text-rose-600/70"
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab("listings")}
              className={`flex-1 py-3 text-center text-sm font-medium ${
                activeTab === "listings"
                  ? "text-rose-600 border-b-2 border-rose-600"
                  : "text-rose-600/70"
              }`}
            >
              My Listings
            </button>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <Button className="flex items-center justify-center rounded-lg h-12 px-4 bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold">
              <span className="truncate">Edit Profile</span>
            </Button>
            <Button
              onClick={() => navigate("/add-service/step-1")}
              className="flex items-center justify-center rounded-lg h-12 px-4 bg-rose-600/20 hover:bg-rose-600/30 text-rose-600 text-sm font-bold"
            >
              <span className="truncate">Add New Service</span>
            </Button>
          </div>

          {/* My Listings */}
          <h2 className="text-gray-900 text-xl font-bold leading-tight pt-2">
            My Listings
          </h2>

          <div className="space-y-4">
            {listings.map((listing) => (
              <div
                key={listing.id}
                className="bg-white rounded-xl shadow-sm p-4 flex gap-4 items-center"
              >
                <div
                  className="w-24 h-24 bg-cover bg-center rounded-lg flex-shrink-0"
                  style={{ backgroundImage: `url('${listing.image}')` }}
                />
                <div className="flex-1">
                  <p className="text-gray-900 font-bold text-lg">
                    {listing.name}
                  </p>
                  <p className="text-rose-600 font-semibold">{listing.price}</p>
                  <div className="flex gap-2 mt-2">
                    <button className="px-4 py-2 text-xs font-bold bg-rose-600/20 text-rose-600 rounded-md hover:bg-rose-600/30">
                      Edit
                    </button>
                    <button className="px-4 py-2 text-xs font-bold bg-red-100 text-red-500 rounded-md hover:bg-red-200">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};
