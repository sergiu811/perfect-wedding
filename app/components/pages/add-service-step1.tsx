import { ArrowLeft, ChevronDown, X } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useRouter } from "~/contexts/router-context";
import { useServiceForm } from "~/contexts/service-context";

export const AddServiceStep1 = () => {
  const { navigate } = useRouter();
  const { updateFormData, formData } = useServiceForm();
  const [selectedCategory, setSelectedCategory] = useState(
    formData.category || ""
  );
  const [tags, setTags] = useState<string[]>(formData.tags || []);
  const [currentTag, setCurrentTag] = useState("");

  const handleContinue = () => {
    const form = document.querySelector("form");
    if (!form) return;

    const formDataObj = new FormData(form);

    updateFormData({
      category: selectedCategory,
      title: formDataObj.get("title") as string,
      description: formDataObj.get("description") as string,
      priceMin: formDataObj.get("priceMin") as string,
      priceMax: formDataObj.get("priceMax") as string,
      location: formDataObj.get("location") as string,
      contactMethod: formDataObj.get("contactMethod") as string,
      tags,
    });

    navigate("/add-service/step-2");
  };

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="min-h-screen flex flex-col bg-pink-50 pb-20 px-4 lg:px-8">
      {/* Header */}
      <header className="flex items-center p-4 lg:p-6 bg-white border-b border-gray-200 -mx-4 lg:-mx-8">
        <button
          onClick={() => navigate("/vendor-dashboard")}
          className="text-gray-900"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg lg:text-xl font-bold text-center flex-1 text-gray-900 pr-6">
          Add New Service
        </h1>
      </header>

      {/* Progress Indicator */}
      <div className="py-4 lg:py-5 bg-white border-b border-gray-100 -mx-4 lg:-mx-8 px-4 lg:px-8">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-rose-600 rounded-full" />
          <div className="flex-1 h-1.5 bg-gray-200 rounded-full" />
          <div className="flex-1 h-1.5 bg-gray-200 rounded-full" />
          <div className="flex-1 h-1.5 bg-gray-200 rounded-full" />
        </div>
        <p className="text-sm lg:text-base text-gray-600 mt-2 text-center font-medium">
          Step 1 of 4: Basic Information
        </p>
      </div>

      <main className="flex-1 py-6 lg:py-8 space-y-6 overflow-y-auto">
        <form className="space-y-6">
          {/* Service Title */}
          <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
            <label className="text-base font-bold text-gray-900">
              Service Title *
            </label>
            <Input
              name="title"
              defaultValue={formData.title}
              className="w-full bg-gray-50 text-gray-900 placeholder:text-gray-500 border border-gray-200 rounded-lg h-12 px-4 focus:ring-2 focus:ring-rose-600 focus:border-transparent"
              placeholder="e.g., Full Wedding Photography Package"
              type="text"
              required
            />
            <p className="text-xs text-gray-500">
              Make it clear and descriptive
            </p>
          </div>

          {/* Category */}
          <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
            <label className="text-base font-bold text-gray-900">
              Service Category *
            </label>
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none w-full bg-gray-50 text-gray-900 border border-gray-200 rounded-lg h-12 px-4 focus:ring-2 focus:ring-rose-600 focus:border-transparent"
                required
              >
                <option value="" disabled>
                  Select a category
                </option>
                <option value="venue">Venue</option>
                <option value="photo-video">Photo &amp; Video</option>
                <option value="music-dj">Music/DJ</option>
                <option value="decorations">Decorations</option>
                <option value="invitations">Invitations</option>
                <option value="sweets">Sweets</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
            <label className="text-base font-bold text-gray-900">
              Short Description *
            </label>
            <textarea
              name="description"
              defaultValue={formData.description}
              className="w-full bg-gray-50 text-gray-900 placeholder:text-gray-500 border border-gray-200 rounded-lg min-h-[120px] p-4 focus:ring-2 focus:ring-rose-600 focus:border-transparent"
              placeholder="Describe what makes your service unique and special..."
              required
            />
            <p className="text-xs text-gray-500">
              Highlight your unique selling points
            </p>
          </div>

          {/* Price Range */}
          <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
            <label className="text-base font-bold text-gray-900">
              Price Range *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Input
                  name="priceMin"
                  defaultValue={formData.priceMin}
                  className="w-full bg-gray-50 text-gray-900 placeholder:text-gray-500 border border-gray-200 rounded-lg h-12 px-4 focus:ring-2 focus:ring-rose-600"
                  placeholder="Min ($)"
                  type="number"
                  min="0"
                  required
                />
              </div>
              <div>
                <Input
                  name="priceMax"
                  defaultValue={formData.priceMax}
                  className="w-full bg-gray-50 text-gray-900 placeholder:text-gray-500 border border-gray-200 rounded-lg h-12 px-4 focus:ring-2 focus:ring-rose-600"
                  placeholder="Max ($)"
                  type="number"
                  min="0"
                  required
                />
              </div>
            </div>
          </div>

          {/* Service Location */}
          <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
            <label className="text-base font-bold text-gray-900">
              Service Location *
            </label>
            <Input
              name="location"
              defaultValue={formData.location}
              className="w-full bg-gray-50 text-gray-900 placeholder:text-gray-500 border border-gray-200 rounded-lg h-12 px-4 focus:ring-2 focus:ring-rose-600"
              placeholder="City, State or Full Address"
              type="text"
              required
            />
            <p className="text-xs text-gray-500">
              Where you provide this service
            </p>
          </div>

          {/* Tags/Keywords */}
          <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
            <label className="text-base font-bold text-gray-900">
              Tags / Keywords
            </label>
            <div className="flex gap-2">
              <Input
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
                className="flex-1 bg-gray-50 text-gray-900 placeholder:text-gray-500 border border-gray-200 rounded-lg h-12 px-4"
                placeholder="Add a tag..."
                type="text"
              />
              <Button
                type="button"
                onClick={addTag}
                className="bg-rose-600 hover:bg-rose-700 text-white h-12 px-6"
              >
                Add
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:bg-rose-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <p className="text-xs text-gray-500">
              Add keywords to help couples find your service
            </p>
          </div>

          {/* Contact Method */}
          <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
            <label className="text-base font-bold text-gray-900">
              Preferred Contact Method *
            </label>
            <select
              name="contactMethod"
              defaultValue={formData.contactMethod || ""}
              className="w-full bg-gray-50 text-gray-900 border border-gray-200 rounded-lg h-12 px-4 focus:ring-2 focus:ring-rose-600"
              required
            >
              <option value="" disabled>
                Select contact method
              </option>
              <option value="phone">Phone</option>
              <option value="email">Email</option>
              <option value="both">Both</option>
              <option value="message">Message Only</option>
            </select>
          </div>
        </form>
      </main>

      {/* Footer */}
      <footer className="p-4 lg:p-6 space-y-3 bg-white border-t border-gray-200 sticky bottom-0 -mx-4 lg:-mx-8">
        <Button
          onClick={handleContinue}
          className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-full h-14 lg:h-16 text-base lg:text-lg shadow-lg"
        >
          Continue to Category Details
        </Button>
        <button
          onClick={() => navigate("/vendor-dashboard")}
          className="w-full text-sm font-medium text-gray-600 hover:text-rose-600"
        >
          Cancel
        </button>
      </footer>
    </div>
  );
};
