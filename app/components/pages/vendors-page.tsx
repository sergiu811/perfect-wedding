import React, { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Star,
  TrendingUp,
  Camera,
  Music,
  Utensils,
  Flower2,
  Cake,
  Mail,
  Users,
  Palette,
  Sparkles,
  ChevronRight,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useRouter } from "~/contexts/router-context";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { VENUES } from "~/constants/venues";
import { PHOTOGRAPHERS } from "~/constants/photographers";
import { MUSICIANS } from "~/constants/musicians";
import { DECORATIONS } from "~/constants/decorations";
import { SWEETS } from "~/constants/sweets";
import { INVITATIONS } from "~/constants/invitations";

const VENDOR_CATEGORIES = [
  {
    id: "venue",
    name: "Venues",
    icon: Users,
    color: "from-rose-500 to-pink-600",
    count: 145,
    route: "/venues",
  },
  {
    id: "photo-video",
    name: "Photo & Video",
    icon: Camera,
    color: "from-blue-500 to-indigo-600",
    count: 89,
    route: "/photo-video",
  },
  {
    id: "music-dj",
    name: "Music & DJ",
    icon: Music,
    color: "from-purple-500 to-violet-600",
    count: 67,
    route: "/music-dj",
  },
  {
    id: "decorations",
    name: "Decorations",
    icon: Flower2,
    color: "from-green-500 to-emerald-600",
    count: 112,
    route: "/decorations",
  },
  {
    id: "sweets",
    name: "Sweets & Cakes",
    icon: Cake,
    color: "from-amber-500 to-orange-600",
    count: 54,
    route: "/sweets",
  },
  {
    id: "invitations",
    name: "Invitations",
    icon: Mail,
    color: "from-pink-500 to-rose-600",
    count: 43,
    route: "/invitations",
  },
  {
    id: "catering",
    name: "Catering",
    icon: Utensils,
    color: "from-teal-500 to-cyan-600",
    count: 78,
    route: "/vendors",
  },
  {
    id: "planning",
    name: "Wedding Planners",
    icon: Palette,
    color: "from-fuchsia-500 to-purple-600",
    count: 34,
    route: "/vendors",
  },
];

const POPULAR_SEARCHES = [
  "Outdoor venues",
  "Vintage photography",
  "Live band",
  "Floral arrangements",
  "Custom cakes",
];

export const VendorsPage = () => {
  const { navigate } = useRouter();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  // Get search query from URL parameter on mount
  useEffect(() => {
    console.log("VendorsPage mounted");
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const query = params.get("q") || "";
      console.log("Search query from URL:", query);
      setSearchQuery(query);
    }
  }, []);

  // Combine all vendors into one searchable list
  const allVendors = [
    ...VENUES.map(v => ({ ...v, category: 'venue', categoryName: 'Venues', route: `/venues/${v.id}` })),
    ...PHOTOGRAPHERS.map(v => ({ ...v, category: 'photo-video', categoryName: 'Photo & Video', route: `/photo-video/${v.id}` })),
    ...MUSICIANS.map(v => ({ ...v, category: 'music-dj', categoryName: 'Music & DJ', route: `/music-dj/${v.id}` })),
    ...DECORATIONS.map(v => ({ ...v, category: 'decorations', categoryName: 'Decorations', route: `/decorations/${v.id}` })),
    ...SWEETS.map(v => ({ ...v, category: 'sweets', categoryName: 'Sweets & Cakes', route: `/sweets/${v.id}` })),
    ...INVITATIONS.map(v => ({ ...v, category: 'invitations', categoryName: 'Invitations', route: `/invitations/${v.id}` })),
  ];

  // Filter vendors by search query
  const filteredVendors = searchQuery
    ? allVendors.filter((vendor: any) => {
        const query = searchQuery.toLowerCase();
        return (
          vendor.name.toLowerCase().includes(query) ||
          vendor.categoryName.toLowerCase().includes(query) ||
          (vendor.location && vendor.location.toLowerCase().includes(query)) ||
          (vendor.description && vendor.description.toLowerCase().includes(query)) ||
          (vendor.shortDescription && vendor.shortDescription.toLowerCase().includes(query))
        );
      })
    : [];

  const filteredCategories = VENDOR_CATEGORIES.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const togglePriceRange = (range: string) => {
    setPriceRange((prev) =>
      prev.includes(range) ? prev.filter((r) => r !== range) : [...prev, range]
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-pink-50 pb-20 lg:pb-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-rose-500 to-pink-600 text-white p-6 lg:p-8 rounded-b-3xl shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl lg:text-4xl font-bold mb-2">
            {searchQuery ? "Search Results" : "Find Your Vendors"}
          </h1>
          <p className="text-white/90 text-sm lg:text-base">
            {searchQuery 
              ? `Showing results for "${searchQuery}"`
              : "Discover the perfect professionals for your big day"
            }
          </p>

          {/* Search Bar */}
          <div className="mt-6 space-y-3 max-w-4xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search vendors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pl-12 pr-4 rounded-xl bg-white text-gray-900 placeholder:text-gray-500 border-0 shadow-md"
              />
            </div>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Location"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full h-10 pl-10 pr-3 rounded-lg bg-white text-gray-900 text-sm placeholder:text-gray-500 border-0"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 h-10 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors ${
                  showFilters
                    ? "bg-white text-rose-600"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </button>
            </div>
          </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 space-y-4">
            {/* Price Range */}
            <div>
              <p className="text-sm font-semibold mb-2">Price Range</p>
              <div className="flex flex-wrap gap-2">
                {["$", "$$", "$$$", "$$$$"].map((range) => (
                  <button
                    key={range}
                    onClick={() => togglePriceRange(range)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      priceRange.includes(range)
                        ? "bg-white text-rose-600"
                        : "bg-white/20 text-white hover:bg-white/30"
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div>
              <p className="text-sm font-semibold mb-2">Minimum Rating</p>
              <div className="flex gap-2">
                {[5, 4, 3].map((rating) => (
                  <button
                    key={rating}
                    onClick={() =>
                      setSelectedRating(selectedRating === rating ? null : rating)
                    }
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors flex items-center gap-1 ${
                      selectedRating === rating
                        ? "bg-white text-rose-600"
                        : "bg-white/20 text-white hover:bg-white/30"
                    }`}
                  >
                    <Star className="w-3 h-3 fill-current" />
                    {rating}+
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                setPriceRange([]);
                setSelectedRating(null);
              }}
              className="text-xs text-white/80 hover:text-white underline"
            >
              Clear all filters
            </button>
          </div>
        )}
        </div>
      </div>

      <main className="flex-1 px-4 lg:px-8 py-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Popular Searches */}
        {!searchQuery && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-rose-600" />
              Popular Searches
            </h3>
            <div className="flex flex-wrap gap-2">
              {POPULAR_SEARCHES.map((search) => (
                <button
                  key={search}
                  onClick={() => setSearchQuery(search)}
                  className="px-3 py-1.5 bg-white rounded-full text-xs font-medium text-gray-700 hover:bg-rose-50 hover:text-rose-600 transition-colors shadow-sm"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Vendor Results */}
        {searchQuery && filteredVendors.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Vendor Results ({filteredVendors.length})
              </h3>
              <button
                onClick={() => setSearchQuery("")}
                className="text-sm text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            </div>

            <div className="space-y-3">
              {filteredVendors.map((vendor: any) => (
                <button
                  key={`${vendor.category}-${vendor.id}`}
                  onClick={() => navigate(vendor.route)}
                  className="w-full bg-white rounded-xl p-4 shadow-md hover:shadow-xl transition-all text-left group"
                >
                  <div className="flex gap-4">
                    <img
                      src={vendor.image}
                      alt={vendor.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-900 truncate group-hover:text-rose-600 transition-colors">
                            {vendor.name}
                          </h4>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {vendor.categoryName}
                          </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-rose-600 transition-colors flex-shrink-0" />
                      </div>
                      {vendor.location && (
                        <div className="flex items-center gap-1 mt-2 text-xs text-gray-600">
                          <MapPin className="w-3 h-3" />
                          {vendor.location}
                        </div>
                      )}
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          <span className="text-sm font-semibold text-gray-900">
                            {vendor.rating}
                          </span>
                          <span className="text-xs text-gray-500">
                            ({vendor.reviewCount})
                          </span>
                        </div>
                        {vendor.pricing && (
                          <span className="text-xs text-gray-600">
                            {typeof vendor.pricing === 'string' 
                              ? vendor.pricing 
                              : Array.isArray(vendor.pricing) && vendor.pricing[0]
                              ? `From ${vendor.pricing[0].price}`
                              : ''}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Category Cards */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">
              {searchQuery && filteredVendors.length === 0 ? "No Vendors Found - Browse Categories" : searchQuery ? "Categories" : "Browse by Category"}
            </h3>
            {searchQuery && filteredVendors.length === 0 && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-sm text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
            {filteredCategories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => navigate(category.route)}
                  className="group relative bg-white rounded-2xl p-4 shadow-md hover:shadow-xl transition-all overflow-hidden"
                >
                  {/* Gradient Background */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity`}
                  />

                  {/* Content */}
                  <div className="relative space-y-3">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-bold text-gray-900 text-sm leading-tight mb-1">
                        {category.name}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {category.count} vendors
                      </p>
                    </div>
                    <ChevronRight className="absolute top-4 right-0 w-5 h-5 text-gray-400 group-hover:text-rose-600 transition-colors" />
                  </div>
                </button>
              );
            })}
          </div>

          {filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600 font-medium">No vendors found</p>
              <p className="text-sm text-gray-500 mt-1">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>

        {/* Featured Vendors */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5 border border-purple-100">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-bold text-gray-900">Featured Vendors</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Handpicked professionals with exceptional reviews
          </p>
          <Button
            onClick={() => navigate("/venues")}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl h-11 font-semibold shadow-md"
          >
            View Featured
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-rose-600">500+</p>
            <p className="text-xs text-gray-600 mt-1">Vendors</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-blue-600">4.8</p>
            <p className="text-xs text-gray-600 mt-1">Avg Rating</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-green-600">1000+</p>
            <p className="text-xs text-gray-600 mt-1">Reviews</p>
          </div>
        </div>
      </main>
    </div>
  );
};
