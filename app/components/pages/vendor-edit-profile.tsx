import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft, ChevronDown, Upload, X } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useRouter } from "~/contexts/router-context";
import { useAuth } from "~/contexts/auth-context";
import { useSupabase } from "~/lib/supabase.client";

export const VendorEditProfile = () => {
  const { navigate } = useRouter();
  const { profile, user, updateProfile } = useAuth();
  const supabase = useSupabase();

  const [businessName, setBusinessName] = useState(
    profile?.business_name || ""
  );
  const [contactPerson, setContactPerson] = useState(profile?.first_name || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [location, setLocation] = useState(profile?.location || "");
  const [website, setWebsite] = useState(profile?.website || "");
  const [instagram, setInstagram] = useState(profile?.instagram || "");
  const [facebook, setFacebook] = useState(profile?.facebook || "");
  const [businessHours, setBusinessHours] = useState(
    profile?.business_hours || ""
  );

  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("wedding_planner");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "");
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const businessNameRef = useRef<HTMLInputElement>(null);
  const contactPersonRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const bioRef = useRef<HTMLTextAreaElement>(null);
  const locationRef = useRef<HTMLInputElement>(null);

  const fieldRefs = {
    businessName: businessNameRef,
    contactPerson: contactPersonRef,
    phone: phoneRef,
    bio: bioRef,
    location: locationRef,
  } as const;

  // Sync state when profile loads or changes
  useEffect(() => {
    if (profile) {
      setBusinessName(profile.business_name || "");
      setContactPerson(profile.first_name || "");
      setPhone(profile.phone || "");
      setBio(profile.bio || "");
      setLocation(profile.location || "");
      setWebsite(profile.website || "");
      setInstagram(profile.instagram || "");
      setFacebook(profile.facebook || "");
      setBusinessHours(profile.business_hours || "");
      setAvatarUrl(profile.avatar_url || "");
    }
  }, [profile]);

  const clearError = (field: keyof typeof fieldRefs | string) => {
    if (!errors[field]) return;
    setErrors((prev) => {
      const { [field]: _removed, ...rest } = prev;
      return rest;
    });
  };

  const extractPathFromPublicUrl = (url: string) => {
    const marker = "/object/public/avatars/";
    const index = url.indexOf(marker);
    if (index === -1) return "";
    return url.slice(index + marker.length);
  };

  const handleAvatarChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!user?.id) {
      setAvatarError("You need to be signed in to change your profile photo.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setAvatarError("Profile photos must be smaller than 5MB.");
      return;
    }

    setIsUploadingAvatar(true);
    setAvatarError(null);

    const fileExt = file.name.split(".").pop();
    const fileName = `avatar-${Date.now()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;
    const previousPath = avatarUrl ? extractPathFromPublicUrl(avatarUrl) : "";

    try {
      const { error } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
          contentType: file.type,
        });

      if (error) {
        throw error;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      if (publicUrl) {
        setAvatarUrl(publicUrl);
        if (previousPath && previousPath !== filePath) {
          await supabase.storage
            .from("avatars")
            .remove([previousPath])
            .catch(() => undefined);
        }
      }
    } catch (error: any) {
      console.error("Error uploading avatar:", error);
      setAvatarError(
        error?.message || "Failed to upload profile photo. Please try again."
      );
    } finally {
      setIsUploadingAvatar(false);
      if (event.target) {
        event.target.value = "";
      }
    }
  };

  const validateFields = () => {
    const requiredFields = [
      {
        name: "businessName",
        label: "Business Name",
        value: businessName.trim(),
        ref: businessNameRef,
      },
      {
        name: "contactPerson",
        label: "Contact Person",
        value: contactPerson.trim(),
        ref: contactPersonRef,
      },
      {
        name: "phone",
        label: "Phone Number",
        value: phone.trim(),
        ref: phoneRef,
      },
      {
        name: "bio",
        label: "Business Description",
        value: bio.trim(),
        ref: bioRef,
      },
      {
        name: "location",
        label: "Business Location",
        value: location.trim(),
        ref: locationRef,
      },
    ] as const;

    const nextErrors: Record<string, string> = {};

    requiredFields.forEach((field) => {
      if (!field.value) {
        nextErrors[field.name] = `${field.label} is required.`;
      }
    });

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      const firstField = requiredFields.find((field) => nextErrors[field.name]);
      const target = firstField?.ref.current;
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "center" });
        target.focus();
      }
      return false;
    }

    setErrors({});
    return true;
  };

  const handleSave = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (saving) return;

    if (isUploadingAvatar) {
      setAvatarError("Please wait until the profile photo finishes uploading.");
      return;
    }

    const isValid = validateFields();
    if (!isValid) {
      return;
    }

    setSaving(true);
    setAvatarError(null);

    try {
      const result = await updateProfile({
        business_name: businessName.trim(),
        first_name: contactPerson.trim(),
        phone: phone.trim(),
        bio: bio.trim(),
        location: location.trim(),
        avatar_url: avatarUrl || profile?.avatar_url || null,
        website: website.trim() || null,
        instagram: instagram.trim() || null,
        facebook: facebook.trim() || null,
        business_hours: businessHours.trim() || null,
      });

      if (result.error) {
        console.error("Error updating profile:", result.error);
        alert("Failed to update profile. Please try again.");
        return;
      }

      navigate("/vendor-dashboard");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
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

  const fallbackAvatar = `https://ui-avatars.com/api/?background=FCE7F3&color=BE123C&name=${encodeURIComponent(
    businessName || contactPerson || profile?.business_name || "Vendor"
  )}`;

  const previewAvatar = avatarUrl || profile?.avatar_url || fallbackAvatar;

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
              <div className="relative h-24 w-24 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                <img
                  src={previewAvatar}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
                {isUploadingAvatar && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/70 text-xs font-semibold text-rose-600">
                    Uploading...
                  </div>
                )}
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => avatarInputRef.current?.click()}
                disabled={isUploadingAvatar || saving}
                className="flex items-center gap-2 border-2 border-rose-600 text-rose-600 hover:bg-rose-50 font-semibold rounded-lg h-11 disabled:opacity-60"
              >
                <Upload className="w-4 h-4" />
                {isUploadingAvatar ? "Uploading..." : "Change Photo"}
              </Button>
            </div>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
            {avatarError && (
              <p className="text-xs text-red-600">{avatarError}</p>
            )}
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
              ref={businessNameRef}
              name="businessName"
              value={businessName}
              onChange={(e) => {
                setBusinessName(e.target.value);
                clearError("businessName");
              }}
              className={`w-full bg-gray-50 text-gray-900 placeholder:text-gray-500 border border-gray-200 rounded-lg h-12 px-4 focus:ring-2 focus:ring-rose-600 focus:border-transparent ${
                errors.businessName ? "border-red-500 focus:ring-red-500" : ""
              }`}
              placeholder="Your business name"
              type="text"
              required
            />
            {errors.businessName && (
              <p className="text-xs text-red-600">{errors.businessName}</p>
            )}
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
              ref={bioRef}
              name="description"
              value={bio}
              onChange={(e) => {
                setBio(e.target.value);
                clearError("bio");
              }}
              className={`w-full bg-gray-50 text-gray-900 placeholder:text-gray-500 border border-gray-200 rounded-lg min-h-[120px] p-4 focus:ring-2 focus:ring-rose-600 focus:border-transparent ${
                errors.bio ? "border-red-500 focus:ring-red-500" : ""
              }`}
              placeholder="Describe your business and services..."
              required
            />
            {errors.bio && <p className="text-xs text-red-600">{errors.bio}</p>}
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
                ref={contactPersonRef}
                name="contactPerson"
                value={contactPerson}
                onChange={(e) => {
                  setContactPerson(e.target.value);
                  clearError("contactPerson");
                }}
                className={`w-full bg-gray-50 text-gray-900 placeholder:text-gray-500 border border-gray-200 rounded-lg h-12 px-4 focus:ring-2 focus:ring-rose-600 ${
                  errors.contactPerson
                    ? "border-red-500 focus:ring-red-500"
                    : ""
                }`}
                placeholder="Your name"
                type="text"
                required
              />
              {errors.contactPerson && (
                <p className="text-xs text-red-600">{errors.contactPerson}</p>
              )}
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
                ref={phoneRef}
                name="phone"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  clearError("phone");
                }}
                className={`w-full bg-gray-50 text-gray-900 placeholder:text-gray-500 border border-gray-200 rounded-lg h-12 px-4 focus:ring-2 focus:ring-rose-600 ${
                  errors.phone ? "border-red-500 focus:ring-red-500" : ""
                }`}
                placeholder="+1 (555) 000-0000"
                type="tel"
                required
              />
              {errors.phone && (
                <p className="text-xs text-red-600">{errors.phone}</p>
              )}
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700">
                Website
              </label>
              <Input
                name="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
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
              ref={locationRef}
              name="location"
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                clearError("location");
              }}
              className={`w-full bg-gray-50 text-gray-900 placeholder:text-gray-500 border border-gray-200 rounded-lg h-12 px-4 focus:ring-2 focus:ring-rose-600 ${
                errors.location ? "border-red-500 focus:ring-red-500" : ""
              }`}
              placeholder="City, State"
              type="text"
              required
            />
            {errors.location && (
              <p className="text-xs text-red-600">{errors.location}</p>
            )}
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
            <p className="text-xs text-gray-500">Your minimum service price</p>
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
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
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
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
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
              value={businessHours}
              onChange={(e) => setBusinessHours(e.target.value)}
              className="w-full bg-gray-50 text-gray-900 placeholder:text-gray-500 border border-gray-200 rounded-lg min-h-[100px] p-4 focus:ring-2 focus:ring-rose-600 focus:border-transparent"
              placeholder="Enter your business hours..."
            />
          </div>
        </form>
      </main>

      {/* Footer */}
      <footer className="p-4 lg:p-6 space-y-3 bg-white border-t border-gray-200 sticky bottom-0 -mx-4 lg:-mx-8">
        <Button
          type="button"
          onClick={handleSave}
          disabled={saving || isUploadingAvatar}
          className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-full h-14 lg:h-16 text-base lg:text-lg shadow-lg disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </Button>
        <button
          type="button"
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
