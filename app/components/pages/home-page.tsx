import React, { useState } from "react";
import { Sparkles, User } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Hero,
  SearchBar,
  CategoryCard,
  SectionTitle,
  PageContainer,
  type Category,
} from "~/components/common";
import { CATEGORIES } from "~/constants";
import { useRouter } from "~/contexts/router-context";

export const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { navigate } = useRouter();

  const handleCategoryClick = (category: Category) => {
    console.log("Category clicked:", category.name);

    // Navigate to appropriate page based on category
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

  return (
    <PageContainer className="">
      {/* Vendor Dashboard Access Button */}
      <button
        onClick={() => navigate("/vendor-dashboard")}
        className="fixed top-4 right-4 z-20 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-rose-600 hover:bg-rose-50 transition-all duration-200 hover:scale-110"
        aria-label="Vendor Dashboard"
      >
        <User className="w-6 h-6" />
      </button>

      <Hero />

      <div className="px-5 -mt-16 z-10 relative mb-8">
        <SearchBar
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearchQuery(e.target.value)
          }
          placeholder="Find your perfect wedding venue, photographer, or DJ..."
        />
      </div>

      <div className="px-5 mb-5">
        <SectionTitle className="">Quick Categories</SectionTitle>
      </div>

      <div className="px-5 mb-8">
        <div className="grid grid-cols-3 gap-5">
          {CATEGORIES.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onClick={handleCategoryClick}
            />
          ))}
        </div>
      </div>

      <div className="px-5 mb-4">
        <Button
          className="flex w-full items-center justify-center gap-3 rounded-full bg-rose-600/10 hover:bg-rose-600/20 h-14 px-6 text-rose-600 text-base font-bold transition-all duration-200 shadow-sm hover:shadow-md"
          variant="ghost"
        >
          <Sparkles className="h-5 w-5" />
          <span>Plan My Perfect Wedding (AI)</span>
        </Button>
      </div>

      <div className="px-5">
        <div className="flex gap-4">
          <Button
            onClick={() => navigate("/planning/step-1")}
            className="flex-1 rounded-full bg-rose-600 hover:bg-rose-700 h-14 px-6 text-white text-base font-bold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Start Planning
          </Button>
          <Button
            onClick={() => navigate("/join-vendor")}
            className="flex-1 rounded-full bg-white hover:bg-gray-50 h-14 px-6 text-gray-900 text-base font-bold shadow-lg hover:shadow-xl transition-all duration-200 border-2 border-gray-100"
            variant="outline"
          >
            Join as Vendor
          </Button>
        </div>
      </div>
    </PageContainer>
  );
};
