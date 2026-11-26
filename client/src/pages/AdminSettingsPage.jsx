import { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { toast } from "react-hot-toast";
import {
  FiSave,
  FiUser,
  FiMail,
  FiMapPin,
} from "react-icons/fi";

import ImageUploader from "../components/admin/ImageUploader";
import AdminPageHeader from "../components/admin/AdminPageHeader";
import GlassCard from "../components/ui/GlassCard";
import Spinner from "../components/ui/Spinner";
import * as settingsService from "../services/settingsService";

const INPUT_CLASS =
  "w-full px-4 py-2.5 rounded-lg bg-dark-800 border border-dark-700 text-dark-50 placeholder-dark-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors text-sm";

const AdminSettingsPage = () => {
  const [formData, setFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profileFile, setProfileFile] = useState(null);
  const [removeProfile, setRemoveProfile] = useState(false);
  const [uploaderKey, setUploaderKey] = useState(0);

  const fetchSettings = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await settingsService.getSettings();
      const s = res.data?.data;
      setFormData({
        name: s.name || "",
        role: s.role || "",
        greeting: s.greeting || "",
        tagline: s.tagline || "",
        location: s.location || "",
        email: s.email || "",
        profileImageUrl: s.profileImageUrl || "",
        bio: (s.bio || []).join("\n\n"),
      });
    } catch {
      toast.error("Failed to load settings");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleProfileSelect = useCallback((file) => {
    setProfileFile(file);
    setRemoveProfile(false);
  }, []);

  const handleProfileRemove = useCallback(() => {
    setProfileFile(null);
    setRemoveProfile(true);
    setFormData((prev) => ({ ...prev, profileImageUrl: "" }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData) return;

    setIsSaving(true);
    try {
      await settingsService.updateSettings({
        name: formData.name,
        role: formData.role,
        greeting: formData.greeting,
        tagline: formData.tagline,
        location: formData.location,
        email: formData.email,
        bio: formData.bio
          .split("\n\n")
          .map((p) => p.trim())
          .filter(Boolean),
      });

      if (profileFile) {
        const fd = new FormData();
        fd.append("image", profileFile);
        const res = await settingsService.uploadProfileImage(fd);
        setFormData((prev) => ({
          ...prev,
          profileImageUrl: res.data?.data?.profileImageUrl || "",
        }));
      } else if (removeProfile) {
        await settingsService.deleteProfileImage().catch(() => {});
      }

      setProfileFile(null);
      setRemoveProfile(false);
      setUploaderKey((k) => k + 1);
      toast.success("Settings saved");
    } catch (error) {
      toast.error(error.message || "Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !formData) {
    return (
      <>
        <Helmet>
          <title>Settings | Admin</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <AdminPageHeader icon={FiUser} title="Student details" />
        <div className="flex items-center justify-center py-20">
          <Spinner size="lg" />
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Settings | Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <AdminPageHeader
        icon={FiUser}
        title="Student details"
        description="Personal info shown in the hero and details sections of your site"
      />

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        {/* Personal Info */}
        <GlassCard>
          <h2 className="text-sm font-semibold text-dark-300 uppercase tracking-wider mb-4">
            Personal Information
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="s-name" className="block text-sm font-medium text-dark-300 mb-1.5">
                  Name
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                  <input
                    id="s-name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    className={`${INPUT_CLASS} pl-10`}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="s-role" className="block text-sm font-medium text-dark-300 mb-1.5">
                  Role / Title
                </label>
                <input
                  id="s-role"
                  name="role"
                  type="text"
                  value={formData.role}
                  onChange={handleChange}
                  placeholder="B.Tech Student"
                  className={INPUT_CLASS}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="s-email" className="block text-sm font-medium text-dark-300 mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                  <input
                    id="s-email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    className={`${INPUT_CLASS} pl-10`}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="s-location" className="block text-sm font-medium text-dark-300 mb-1.5">
                  Location
                </label>
                <div className="relative">
                  <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                  <input
                    id="s-location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="City, Country"
                    className={`${INPUT_CLASS} pl-10`}
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="s-greeting" className="block text-sm font-medium text-dark-300 mb-1.5">
                Greeting
              </label>
              <input
                id="s-greeting"
                name="greeting"
                type="text"
                value={formData.greeting}
                onChange={handleChange}
                placeholder="Hi, I am"
                className={INPUT_CLASS}
              />
            </div>

            <div>
              <label htmlFor="s-tagline" className="block text-sm font-medium text-dark-300 mb-1.5">
                Tagline
              </label>
              <input
                id="s-tagline"
                name="tagline"
                type="text"
                value={formData.tagline}
                onChange={handleChange}
                placeholder="One place to keep college project details..."
                className={INPUT_CLASS}
              />
            </div>

            <div>
              <span className="block text-sm font-medium text-dark-300 mb-1.5">
                Profile Photo
              </span>
              <ImageUploader
                key={uploaderKey}
                currentImage={formData.profileImageUrl || null}
                onFileSelect={handleProfileSelect}
                onRemove={handleProfileRemove}
                alt="Profile preview"
                aspectClass="aspect-square"
                className="max-w-xs"
              />
            </div>
          </div>
        </GlassCard>

        {/* Bio */}
        <GlassCard>
          <h2 className="text-sm font-semibold text-dark-300 uppercase tracking-wider mb-4">
            About / Bio
          </h2>
          <div>
            <label htmlFor="s-bio" className="block text-sm font-medium text-dark-300 mb-1.5">
              Bio Paragraphs
              <span className="text-dark-500 font-normal ml-1">(separate paragraphs with a blank line)</span>
            </label>
            <textarea
              id="s-bio"
              name="bio"
              rows={8}
              value={formData.bio}
              onChange={handleChange}
              placeholder="Write about yourself..."
              className={`${INPUT_CLASS} resize-none`}
            />
          </div>
        </GlassCard>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 transition-colors disabled:opacity-50"
          >
            {isSaving ? <Spinner size="sm" /> : <FiSave className="w-4 h-4" />}
            Save details
          </button>
        </div>
      </form>
    </>
  );
};

export default AdminSettingsPage;
