import React, { useState, useEffect, useMemo } from "react";
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
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Toggle } from "~/components/ui/toggle";

const VENDOR_CATEGORIES = [
  {
    id: "venue",
    name: "Venues",
    icon: Users,
    color: "from-rose-500 to-pink-600",
    route: "/venues",
  },
  {
    id: "photo_video",
    name: "Photo & Video",
    icon: Camera,
    color: "from-blue-500 to-indigo-600",
    route: "/photo-video",
  },
  {
    id: "music_dj",
    name: "Music & DJ",
    icon: Music,
    color: "from-purple-500 to-violet-600",
    route: "/music-dj",
  },
  {
    id: "decorations",
    name: "Decorations",
    icon: Flower2,
    color: "from-green-500 to-emerald-600",
    route: "/decorations",
  },
  {
    id: "sweets",
    name: "Sweets & Cakes",
    icon: Cake,
    color: "from-amber-500 to-orange-600",
    route: "/sweets",
  },
  {
    id: "invitations",
    name: "Invitations",
    icon: Mail,
    color: "from-pink-500 to-rose-600",
    route: "/invitations",
  },
];

const POPULAR_SEARCHES = [
  "Outdoor venues",
  "Vintage photography",
  "Live band",
  "Floral arrangements",
  "Custom cakes",
];

interface Service {
  id: string;
  vendor_id: string;
  title: string;
  category: string;
  description: string;
  price_min: number | null;
  price_max: number | null;
  location: string;
  images: string[] | null;
  rating: number | null;
  review_count: number | null;
  tags: string[] | null;
  vendor?: {
    id: string;
    business_name: string | null;
    avatar_url: string | null;
  };
}

export const VendorsPage = () => {
  const { navigate } = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get search query from URL parameter on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const query = params.get("q") || "";
      setSearchQuery(query);
    }
  }, []);

  // Fetch services from database
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/services");

        if (!response.ok) {
          throw new Error("Failed to load vendors");
        }

        const data = await response.json();
        setServices(data.services || []);
      } catch (err: any) {
        console.error("Error fetching services:", err);
        setError(err.message || "Failed to load vendors");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Get category counts from real data
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    services.forEach((service) => {
      counts[service.category] = (counts[service.category] || 0) + 1;
    });
    return counts;
  }, [services]);

  // Get unique vendors (grouped by vendor_id)
  const uniqueVendors = useMemo(() => {
    const vendorMap = new Map<string, Service[]>();
    services.forEach((service) => {
      const existing = vendorMap.get(service.vendor_id) || [];
      vendorMap.set(service.vendor_id, [...existing, service]);
    });
    return Array.from(vendorMap.entries()).map(([vendorId, vendorServices]) => {
      const firstService = vendorServices[0];
      const avgRating =
        vendorServices.reduce((sum, s) => sum + (s.rating || 0), 0) /
        vendorServices.filter((s) => s.rating).length || 0;
      const totalReviews = vendorServices.reduce(
        (sum, s) => sum + (s.review_count || 0),
        0
      );
      const minPrice = Math.min(
        ...vendorServices
          .map((s) => s.price_min)
          .filter((p): p is number => p !== null)
      );

      return {
        vendorId,
        vendorName: firstService.vendor?.business_name || "Vendor",
        vendorAvatar:
          firstService.vendor?.avatar_url ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            firstService.vendor?.business_name || "Vendor"
          )}`,
        services: vendorServices,
        category: firstService.category,
        location: firstService.location,
        rating: avgRating || null,
        reviewCount: totalReviews,
        minPrice: isFinite(minPrice) ? minPrice : null,
        image:
          firstService.images?.[0] || firstService.vendor?.avatar_url || "",
      };
    });
  }, [services]);

  // Filter vendors by search query, location, price, and rating
  const filteredVendors = useMemo(() => {
    let filtered = uniqueVendors;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((vendor) => {
        return (
          vendor.vendorName.toLowerCase().includes(query) ||
          vendor.services.some(
            (s) =>
              s.title.toLowerCase().includes(query) ||
              s.description.toLowerCase().includes(query) ||
              s.tags?.some((tag) => tag.toLowerCase().includes(query))
          ) ||
          vendor.location.toLowerCase().includes(query)
        );
      });
    }

    // Location filter
    if (selectedLocation) {
      const location = selectedLocation.toLowerCase();
      filtered = filtered.filter((vendor) =>
        vendor.location.toLowerCase().includes(location)
      );
    }

    // Price filter
    if (priceRange.length > 0) {
      filtered = filtered.filter((vendor) => {
        if (!vendor.minPrice) return false;
        return priceRange.some((range) => {
          const maxPrice = range.length * 5000; // $ = 0-5k, $$ = 5k-10k, etc.
          const minPrice = (range.length - 1) * 5000;
          return vendor.minPrice! >= minPrice && vendor.minPrice! < maxPrice;
        });
      });
    }

    // Rating filter
    if (selectedRating !== null) {
      filtered = filtered.filter(
        (vendor) => vendor.rating && vendor.rating >= selectedRating
      );
    }

    return filtered;
  }, [
    uniqueVendors,
    searchQuery,
    selectedLocation,
    priceRange,
    selectedRating,
  ]);

  // Filter categories by search
  const filteredCategories = VENDOR_CATEGORIES.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryLabel = (category: string) => {
    const categoryMap: Record<string, string> = {
      venue: "Venues",
      photo_video: "Photo & Video",
      music_dj: "Music & DJ",
      sweets: "Sweets & Cakes",
      decorations: "Decorations",
      invitations: "Invitations",
    };
    return categoryMap[category] || category;
  };

  const getCategoryRoute = (category: string, serviceId: string) => {
    const routeMap: Record<string, string> = {
      venue: "/venues",
      photo_video: "/photo-video",
      music_dj: "/music-dj",
      sweets: "/sweets",
      decorations: "/decorations",
      invitations: "/invitations",
    };
    return `${routeMap[category] || "/vendors"}/${serviceId}`;
  };

  const togglePriceRange = (range: string) => {
    setPriceRange((prev) =>
      prev.includes(range) ? prev.filter((r) => r !== range) : [...prev, range]
    );
  };

  // Calculate stats
  const stats = useMemo(() => {
    const totalVendors = uniqueVendors.length;
    const avgRating =
      uniqueVendors.reduce((sum, v) => sum + (v.rating || 0), 0) /
      uniqueVendors.filter((v) => v.rating).length || 0;
    const totalReviews = uniqueVendors.reduce(
      (sum, v) => sum + (v.reviewCount || 0),
      0
    );
    return { totalVendors, avgRating, totalReviews };
  }, [uniqueVendors]);

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
              : "Discover the perfect professionals for your big day"}
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
              <Button
                variant="ghost"
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 h-10 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors ${showFilters
                    ? "bg-white text-rose-600"
                    : "bg-white/20 text-white hover:bg-white/30"
                  }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </Button>
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
                    <Toggle
                      key={range}
                      pressed={priceRange.includes(range)}
                      onPressedChange={() => togglePriceRange(range)}
                      className="px-3 py-1 rounded-full text-xs font-medium data-[state=on]:bg-white data-[state=on]:text-rose-600 data-[state=off]:bg-white/20 data-[state=off]:text-white hover:bg-white/30"
                    >
                      {range}
                    </Toggle>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div>
                <p className="text-sm font-semibold mb-2">Minimum Rating</p>
                <div className="flex gap-2">
                  {[5, 4, 3].map((rating) => (
                    <Toggle
                      key={rating}
                      pressed={selectedRating === rating}
                      onPressedChange={() =>
                        setSelectedRating(
                          selectedRating === rating ? null : rating
                        )
                      }
                      className="px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 data-[state=on]:bg-white data-[state=on]:text-rose-600 data-[state=off]:bg-white/20 data-[state=off]:text-white hover:bg-white/30"
                    >
                      <Star className="w-3 h-3 fill-current" />
                      {rating}+
                    </Toggle>
                  ))}
                </div>
              </div>

              <Button
                variant="link"
                onClick={() => {
                  setPriceRange([]);
                  setSelectedRating(null);
                }}
                className="text-xs text-white/80 hover:text-white underline h-auto p-0"
              >
                Clear all filters
              </Button>
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
                <Badge
                  key={search}
                  variant="secondary"
                  className="px-3 py-1.5 cursor-pointer hover:bg-rose-50 hover:text-rose-600 transition-colors"
                  onClick={() => setSearchQuery(search)}
                >
                  {search}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Vendor Results */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium">Loading vendors...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-red-400" />
            </div>
            <p className="text-gray-600 font-medium">{error}</p>
            <Button
              variant="link"
              onClick={() => window.location.reload()}
              className="mt-4 text-rose-600 hover:text-rose-700 font-medium"
            >
              Try again
            </Button>
          </div>
        ) : searchQuery && filteredVendors.length > 0 ? (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Vendor Results ({filteredVendors.length})
              </h3>
              <Button
                variant="ghost"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedLocation("");
                  setPriceRange([]);
                  setSelectedRating(null);
                }}
                className="text-sm text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1 h-auto p-0"
              >
                <X className="w-4 h-4" />
                Clear
              </Button>
            </div>

            <div className="space-y-3">
              {filteredVendors.map((vendor) => {
                const firstService = vendor.services[0];
                return (
                  <Card
                    key={vendor.vendorId}
                    className="cursor-pointer hover:shadow-xl transition-all group"
                    onClick={() =>
                      navigate(
                        getCategoryRoute(vendor.category, firstService.id)
                      )
                    }
                  >
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <img
                          src={vendor.image || vendor.vendorAvatar}
                          alt={vendor.vendorName}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-gray-900 truncate group-hover:text-rose-600 transition-colors">
                                {vendor.vendorName}
                              </h4>
                              <Badge variant="secondary" className="text-xs mt-0.5">
                                {getCategoryLabel(vendor.category)}
                              </Badge>
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
                            {vendor.rating && (
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                <span className="text-sm font-semibold text-gray-900">
                                  {vendor.rating.toFixed(1)}
                                </span>
                                {vendor.reviewCount > 0 && (
                                  <span className="text-xs text-gray-500">
                                    ({vendor.reviewCount})
                                  </span>
                                )}
                              </div>
                            )}
                            {vendor.minPrice && (
                              <span className="text-xs text-gray-600">
                                From ${vendor.minPrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ) : searchQuery && filteredVendors.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium">No vendors found</p>
            <p className="text-sm text-gray-500 mt-1">
              Try adjusting your search or filters
            </p>
            <Button
              variant="link"
              onClick={() => {
                setSearchQuery("");
                setSelectedLocation("");
                setPriceRange([]);
                setSelectedRating(null);
              }}
              className="mt-4 text-rose-600 hover:text-rose-700 font-medium"
            >
              Clear search
            </Button>
          </div>
        ) : null}

        {/* Category Cards */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">
              {searchQuery && filteredVendors.length === 0
                ? "No Vendors Found - Browse Categories"
                : searchQuery
                  ? "Categories"
                  : "Browse by Category"}
            </h3>
            {searchQuery && filteredVendors.length === 0 && (
              <Button
                variant="ghost"
                onClick={() => setSearchQuery("")}
                className="text-sm text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1 h-auto p-0"
              >
                <X className="w-4 h-4" />
                Clear
              </Button>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
            {filteredCategories.map((category) => {
              const Icon = category.icon;
              const count = categoryCounts[category.id] || 0;
              return (
                <Card
                  key={category.id}
                  className="group relative cursor-pointer hover:shadow-xl transition-all overflow-hidden"
                  onClick={() => navigate(category.route)}
                >
                  {/* Gradient Background */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity`}
                  />

                  {/* Content */}
                  <CardContent className="relative p-4 space-y-3">
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
                        {count} {count === 1 ? "vendor" : "vendors"}
                      </p>
                    </div>
                    <ChevronRight className="absolute top-4 right-4 w-5 h-5 text-gray-400 group-hover:text-rose-600 transition-colors" />
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600 font-medium">No categories found</p>
              <p className="text-sm text-gray-500 mt-1">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-rose-600">
                {stats.totalVendors}+
              </p>
              <p className="text-xs text-gray-600 mt-1">Vendors</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">
                {stats.avgRating > 0 ? stats.avgRating.toFixed(1) : "—"}
              </p>
              <p className="text-xs text-gray-600 mt-1">Avg Rating</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-600">
                {stats.totalReviews}+
              </p>
              <p className="text-xs text-gray-600 mt-1">Reviews</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};
