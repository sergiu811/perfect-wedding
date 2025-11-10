import React, { useState } from "react";
import { ArrowLeft, ChevronDown, Upload, X } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useRouter } from "~/contexts/router-context";
import { useAuth } from "~/contexts/auth-context";

export const VendorEditProfile = () => {
  const { navigate } = useRouter();
  const { profile, user, updateProfile } = useAuth();
  
  const [businessName, setBusinessName] = useState(profile?.business_name || "");
  const [contactPerson, setContactPerson] = useState(profile?.first_name || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [location, setLocation] = useState(profile?.location || "");
  
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("wedding_planner");
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const result = await updateProfile({
        business_name: businessName,
        first_name: contactPerson,
        phone: phone,
        bio: bio,
        location: location,
      });
      
      if (result.error) {
        console.error("Error updating profile:", result.error);
        alert("Failed to update profile. Please try again.");
        setSaving(false);
        return;
      }
      
      console.log("Profile updated successfully!");
      navigate("/vendor-dashboard");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to update profile. Please try again.");
      setSaving(false);
    }
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
          Edit Profile
        </h1>
      </header>

      <main className="flex-1 py-6 lg:py-8 space-y-6 overflow-y-auto">
        <form onSubmit={handleSave} className="space-y-6">
          {/* Profile Photo */}
          <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
            <label className="text-base font-bold text-gray-900">
              Profile Photo
            </label>
            <div className="flex items-center gap-4">
              <div
                className="w-24 h-24 bg-center bg-no-repeat bg-cover rounded-lg flex-shrink-0"
                style={{
                  backgroundImage:
                    'url("https://images.unsplash.com/photo-1519167758481-83f29da8fd36?w=400&q=80")',
                }}
              />
              <Button
                type="button"
                variant="outline"
                className="flex items-center gap-2 border-2 border-rose-600 text-rose-600 hover:bg-rose-50 font-semibold rounded-lg h-11"
              >
                <Upload className="w-4 h-4" />
                Change Photo
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Recommended: Square image, at least 400x400px
            </p>
          </div>

          {/* Business Name */}
          <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
            <label className="text-base font-bold text-gray-900">
              Business Name *
            </label>
            <Input
              name="businessName"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full bg-gray-50 text-gray-900 placeholder:text-gray-500 border border-gray-200 rounded-lg h-12 px-4 focus:ring-2 focus:ring-rose-600 focus:border-transparent"
              placeholder="Your business name"
              type="text"
              required
            />
          </div>

          {/* Business Category */}
          <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
            <label className="text-base font-bold text-gray-900">
              Business Category *
            </label>
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none w-full bg-gray-50 text-gray-900 border border-gray-200 rounded-lg h-12 px-4 focus:ring-2 focus:ring-rose-600 focus:border-transparent"
                required
              >
                <option value="wedding_planner">Wedding Planner</option>
                <option value="venue">Venue</option>
                <option value="photo_video">Photo &amp; Video</option>
                <option value="music_dj">Music/DJ</option>
                <option value="decorations">Decorations</option>
                <option value="invitations">Invitations</option>
                <option value="sweets">Sweets</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Business Description */}
          <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
            <label className="text-base font-bold text-gray-900">
              Business Description *
            </label>
            <textarea
              name="description"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-gray-50 text-gray-900 placeholder:text-gray-500 border border-gray-200 rounded-lg min-h-[120px] p-4 focus:ring-2 focus:ring-rose-600 focus:border-transparent"
              placeholder="Describe your business and services..."
              required
            />
            <p className="text-xs text-gray-500">
              This will appear on your public profile
            </p>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-gray-900">
              Contact Information
            </h3>
            
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700">
                Contact Person *
              </label>
              <Input
                name="contactPerson"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className="w-full bg-gray-50 text-gray-900 placeholder:text-gray-500 border border-gray-200 rounded-lg h-12 px-4 focus:ring-2 focus:ring-rose-600"
                placeholder="Your name"
                type="text"
                required
              />
            </div>
            
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700">
                Email Address *
              </label>
              <Input
                name="email"
                value={user?.email || ""}
                className="w-full bg-gray-100 text-gray-600 placeholder:text-gray-500 border border-gray-200 rounded-lg h-12 px-4"
                placeholder="your@email.com"
                type="email"
                disabled
                required
              />
              <p className="text-xs text-gray-500">Email cannot be changed</p>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700">
                Phone Number *
              </label>
              <Input
                name="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-gray-50 text-gray-900 placeholder:text-gray-500 border border-gray-200 rounded-lg h-12 px-4 focus:ring-2 focus:ring-rose-600"
                placeholder="+1 (555) 000-0000"
                type="tel"
                required
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700">
                Website
              </label>
              <Input
                name="website"
                defaultValue="www.elegantevents.com"
                className="w-full bg-gray-50 text-gray-900 placeholder:text-gray-500 border border-gray-200 rounded-lg h-12 px-4 focus:ring-2 focus:ring-rose-600"
                placeholder="www.yourwebsite.com"
                type="url"
              />
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
            <label className="text-base font-bold text-gray-900">
              Business Location *
            </label>
            <Input
              name="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-gray-50 text-gray-900 placeholder:text-gray-500 border border-gray-200 rounded-lg h-12 px-4 focus:ring-2 focus:ring-rose-600"
              placeholder="City, State"
              type="text"
              required
            />
            <p className="text-xs text-gray-500">
              Where your business is located
            </p>
          </div>

          {/* Service Areas */}
          <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
            <label className="text-base font-bold text-gray-900">
              Service Areas
            </label>
            <Input
              name="serviceAreas"
              defaultValue="New York, New Jersey, Connecticut"
              className="w-full bg-gray-50 text-gray-900 placeholder:text-gray-500 border border-gray-200 rounded-lg h-12 px-4 focus:ring-2 focus:ring-rose-600"
              placeholder="Areas you serve (comma separated)"
              type="text"
            />
            <p className="text-xs text-gray-500">
              List all areas where you provide services
            </p>
          </div>

          {/* Specialties/Tags */}
          <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
            <label className="text-base font-bold text-gray-900">
              Specialties / Tags
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
                placeholder="Add a specialty..."
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
              Help couples find you by adding relevant specialties
            </p>
          </div>

          {/* Years of Experience */}
          <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
            <label className="text-base font-bold text-gray-900">
              Years of Experience
            </label>
            <Input
              name="experience"
              defaultValue="10"
              className="w-full bg-gray-50 text-gray-900 placeholder:text-gray-500 border border-gray-200 rounded-lg h-12 px-4 focus:ring-2 focus:ring-rose-600"
              placeholder="Years in business"
              type="number"
              min="0"
            />
          </div>

          {/* Starting Price */}
          <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
            <label className="text-base font-bold text-gray-900">
              Starting Price
            </label>
            <Input
              name="startingPrice"
              defaultValue="5000"
              className="w-full bg-gray-50 text-gray-900 placeholder:text-gray-500 border border-gray-200 rounded-lg h-12 px-4 focus:ring-2 focus:ring-rose-600"
              placeholder="Starting price ($)"
              type="number"
              min="0"
            />
            <p className="text-xs text-gray-500">
              Your minimum service price
            </p>
          </div>

          {/* Social Media */}
          <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-gray-900">
              Social Media (Optional)
            </h3>
            
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700">
                Instagram
              </label>
              <Input
                name="instagram"
                defaultValue="@elegantevents"
                className="w-full bg-gray-50 text-gray-900 placeholder:text-gray-500 border border-gray-200 rounded-lg h-12 px-4 focus:ring-2 focus:ring-rose-600"
                placeholder="@username"
                type="text"
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700">
                Facebook
              </label>
              <Input
                name="facebook"
                defaultValue="facebook.com/elegantevents"
                className="w-full bg-gray-50 text-gray-900 placeholder:text-gray-500 border border-gray-200 rounded-lg h-12 px-4 focus:ring-2 focus:ring-rose-600"
                placeholder="facebook.com/yourpage"
                type="text"
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700">
                Pinterest
              </label>
              <Input
                name="pinterest"
                defaultValue="pinterest.com/elegantevents"
                className="w-full bg-gray-50 text-gray-900 placeholder:text-gray-500 border border-gray-200 rounded-lg h-12 px-4 focus:ring-2 focus:ring-rose-600"
                placeholder="pinterest.com/yourpage"
                type="text"
              />
            </div>
          </div>

          {/* Business Hours */}
          <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
            <label className="text-base font-bold text-gray-900">
              Business Hours
            </label>
            <textarea
              name="businessHours"
              defaultValue="Monday - Friday: 9:00 AM - 6:00 PM&#10;Saturday: 10:00 AM - 4:00 PM&#10;Sunday: Closed"
              className="w-full bg-gray-50 text-gray-900 placeholder:text-gray-500 border border-gray-200 rounded-lg min-h-[100px] p-4 focus:ring-2 focus:ring-rose-600 focus:border-transparent"
              placeholder="Enter your business hours..."
            />
          </div>
        </form>
      </main>

      {/* Footer */}
      <footer className="p-4 lg:p-6 space-y-3 bg-white border-t border-gray-200 sticky bottom-0 -mx-4 lg:-mx-8">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-full h-14 lg:h-16 text-base lg:text-lg shadow-lg disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </Button>
        <button
          onClick={() => navigate("/vendor-dashboard")}
          disabled={saving}
          className="w-full text-sm font-medium text-gray-600 hover:text-rose-600 disabled:opacity-50"
        >
          Cancel
        </button>
      </footer>
    </div>
  );
};
