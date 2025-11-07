import React, { useState } from "react";
import {
  Sparkles,
  User,
  Heart,
  Calendar,
  Users,
  CheckCircle,
  Star,
  ArrowRight,
  Search,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  SearchBar,
  CategoryCard,
  PageContainer,
  type Category,
} from "~/components/common";
import { CATEGORIES } from "~/constants";
import { useRouter } from "~/contexts/router-context";
import { useAuth } from "~/contexts/auth-context";

export const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { navigate } = useRouter();
  const { user } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSignOut = async () => {
    try {
      const response = await fetch("/api/auth/signout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to sign out");
      }

      setShowUserMenu(false);
      // Force a full page reload to clear auth state and navigate to login
      window.location.href = "/login";
    } catch (error) {
      console.error("Sign out error:", error);
      alert("Failed to sign out. Please try again.");
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search submitted:", searchQuery);
    if (searchQuery.trim()) {
      const url = `/vendors?q=${encodeURIComponent(searchQuery.trim())}`;
      console.log("Navigating to:", url);
      navigate(url);
    } else {
      console.log("Navigating to: /vendors");
      navigate("/vendors");
    }
  };

  const handleCategoryClick = (category: Category) => {
    console.log("Category clicked:", category.name);

    if (category.id === "venue") {
      navigate("/venues");
    } else if (category.id === "photo-video") {
      navigate("/photo-video");
    } else if (category.id === "music-dj") {
      navigate("/music-dj");
    } else if (category.id === "decorations") {
      navigate("/decorations");
    } else if (category.id === "invitations") {
      navigate("/invitations");
    } else if (category.id === "sweets") {
      navigate("/sweets");
    }
  };

  const features = [
    {
      icon: Calendar,
      title: "Smart Planning",
      description:
        "AI-powered timeline and checklist tailored to your wedding date",
    },
    {
      icon: Users,
      title: "Vendor Marketplace",
      description: "Connect with verified vendors and compare quotes instantly",
    },
    {
      icon: Heart,
      title: "Guest Management",
      description: "Track RSVPs, dietary preferences, and seating arrangements",
    },
  ];

  const stats = [
    { number: "10,000+", label: "Happy Couples" },
    { number: "5,000+", label: "Verified Vendors" },
    { number: "50,000+", label: "Successful Events" },
  ];

  return (
    <PageContainer className="bg-gradient-to-b from-pink-50 via-white to-pink-50/30">
      {/* Top Right Buttons */}
      <div className="fixed top-4 right-4 lg:top-8 lg:right-8 z-20 flex items-center gap-3">
        {/* User Menu - Only show if logged in */}
        {user && (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 px-4 py-2 lg:px-5 lg:py-3 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-all duration-200 hover:scale-105"
            >
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-indigo-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
              </div>
              <ChevronDown
                className={`w-4 h-4 text-gray-600 transition-transform hidden lg:block ${
                  showUserMenu ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-20">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      Signed in as
                    </p>
                    <p className="text-sm text-gray-600 truncate">
                      {user.email}
                    </p>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors text-red-600"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm font-medium">Sign Out</span>
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Hero Section */}
      <div className="relative min-h-[70vh] lg:min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-center bg-cover"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-pink-50" />

        {/* Hero Content */}
        <div className="relative z-10 text-center px-5 lg:px-8 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full mb-6 shadow-lg">
            <Sparkles className="w-4 h-4 text-rose-600" />
            <span className="text-sm font-semibold text-gray-900">
              Your Dream Wedding Starts Here
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Plan Your Perfect
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-300">
              Wedding Day
            </span>
          </h1>

          <p className="text-lg lg:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Connect with top vendors, manage your guest list, and create
            unforgettable memories—all in one place.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              onClick={() => navigate("/planning/step-1")}
              className="rounded-full bg-rose-600 hover:bg-rose-700 h-14 lg:h-16 px-8 text-white text-base lg:text-lg font-bold shadow-2xl hover:shadow-rose-500/50 transition-all duration-200 hover:scale-105"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Start Planning Free
            </Button>
            <Button
              onClick={() => navigate("/vendors")}
              className="rounded-full bg-white/95 backdrop-blur-sm hover:bg-white h-14 lg:h-16 px-8 text-gray-900 text-base lg:text-lg font-bold shadow-2xl transition-all duration-200 hover:scale-105"
              variant="outline"
            >
              <Search className="w-5 h-5 mr-2" />
              Browse Vendors
            </Button>
          </div>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSearchSubmit}>
              <SearchBar
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchQuery(e.target.value)
                }
                placeholder="Search for venues, photographers, DJs, and more..."
              />
            </form>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-12 lg:py-16 px-5 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-3 gap-8 lg:gap-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-5xl font-bold text-rose-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-sm lg:text-base text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 lg:py-20 px-5 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
              Everything You Need in One Place
            </h2>
            <p className="text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
              From planning to execution, we've got you covered every step of
              the way
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 lg:p-8 rounded-2xl bg-gradient-to-br from-pink-50 to-rose-50 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="w-16 h-16 lg:w-20 lg:h-20 bg-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <feature.icon className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
                </div>
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-base lg:text-lg">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="py-12 lg:py-20 px-5 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
              Browse by Category
            </h2>
            <p className="text-lg lg:text-xl text-gray-600">
              Find the perfect vendors for every aspect of your wedding
            </p>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 lg:gap-6">
            {CATEGORIES.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onClick={handleCategoryClick}
              />
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 lg:py-24 px-5 lg:px-8 bg-gradient-to-r from-rose-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
            Ready to Start Planning?
          </h2>
          <p className="text-lg lg:text-xl text-white/90 mb-8">
            Join thousands of couples who planned their dream wedding with us
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate("/planning/step-1")}
              className="rounded-full bg-white hover:bg-gray-50 h-14 lg:h-16 px-8 text-rose-600 text-base lg:text-lg font-bold shadow-2xl transition-all duration-200 hover:scale-105"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              onClick={() => navigate("/join-vendor")}
              className="rounded-full bg-transparent border-2 border-white hover:bg-white/10 h-14 lg:h-16 px-8 text-white text-base lg:text-lg font-bold transition-all duration-200"
              variant="outline"
            >
              Join as Vendor
            </Button>
          </div>
        </div>
      </div>

      {/* Social Proof */}
      <div className="py-12 lg:py-16 px-5 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-6 h-6 fill-yellow-400 text-yellow-400"
              />
            ))}
          </div>
          <p className="text-xl lg:text-2xl text-gray-900 font-semibold mb-2">
            "The best wedding planning platform we've used!"
          </p>
          <p className="text-gray-600">Rated 4.9/5 by over 10,000 couples</p>
        </div>
      </div>
    </PageContainer>
  );
};
