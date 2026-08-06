"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  IconSettings,
  IconCheck,
  IconBuildingStore,
  IconMapPin,
  IconPhone,
  IconMail,
  IconClock,
  IconBrandFacebook,
  IconBrandTwitter,
  IconBrandLinkedin,
  IconBrandYoutube,
} from "@tabler/icons-react";
import {
  fetchSiteSettings,
  updateSiteSettings,
  SiteSettingsData,
} from "../lib/services/siteSettingsService";

export function WebsiteSettingsPanel() {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<SiteSettingsData>({
    siteName: "Sg Pay 4u",
    address:
      "PLOT NO 112/39, SECTOR 11, PRATAP NAGAR, SANGANER, JAIPUR, RAJASTHAN 302033",
    phone: "+91 9887199532",
    phoneRaw: "+91-9887199532",
    email: "info@sgpay4u.com",
    workingHours: "9.00 am - 9.00 pm",
    facebookUrl: "https://facebook.com",
    twitterUrl: "https://twitter.com",
    linkedinUrl: "https://linkedin.com",
    youtubeUrl: "https://youtube.com",
  });

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["admin-site-settings"],
    queryFn: fetchSiteSettings,
  });

  useEffect(() => {
    if (data) {
      setFormData({
        siteName: data.siteName || "Sg Pay 4u",
        address: data.address || "",
        phone: data.phone || "",
        phoneRaw: data.phoneRaw || "",
        email: data.email || "",
        workingHours: data.workingHours || "",
        facebookUrl: data.facebookUrl || "",
        twitterUrl: data.twitterUrl || "",
        linkedinUrl: data.linkedinUrl || "",
        youtubeUrl: data.youtubeUrl || "",
      });
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: updateSiteSettings,
    onSuccess: (updated) => {
      queryClient.setQueryData(["admin-site-settings"], updated);
      toast.success("Website settings updated successfully!");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to update website settings");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-slate-500">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-emerald-500 border-t-transparent mb-2"></div>
        <p>Loading website settings...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 bg-red-50 text-red-700 rounded-lg border border-red-200 mb-6">
        <p className="font-medium">Failed to load website settings</p>
        <p className="text-sm mt-1">{(error as Error)?.message || "Please check backend connection."}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <IconSettings className="w-7 h-7 text-emerald-600" />
            Website Settings
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage site name, contact details, working hours, and social links displayed across the public website.
          </p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={mutation.isPending}
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-5 py-2.5 rounded-lg transition shadow-sm disabled:opacity-50"
        >
          {mutation.isPending ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <IconCheck className="w-5 h-5" />
          )}
          Save Changes
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Brand Info */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
            <IconBuildingStore className="w-5 h-5 text-emerald-600" />
            General Branding
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Site / Company Name
              </label>
              <input
                type="text"
                name="siteName"
                value={formData.siteName}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="e.g. Sg Pay 4u"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Working Hours
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="workingHours"
                  value={formData.workingHours}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 pl-9 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="e.g. 9.00 am - 9.00 pm"
                />
                <IconClock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
            <IconPhone className="w-5 h-5 text-emerald-600" />
            Contact Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2 pl-9 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="info@sgpay4u.com"
                />
                <IconMail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Display Phone Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2 pl-9 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="+91 9887199532"
                />
                <IconPhone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Raw Phone Number (for WhatsApp / dialer)
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="phoneRaw"
                  value={formData.phoneRaw}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2 pl-9 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="+91-9887199532"
                />
                <IconPhone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Full Physical Address
              </label>
              <div className="relative">
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3.5 py-2 pl-9 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="PLOT NO 112/39, SECTOR 11, PRATAP NAGAR, SANGANER, JAIPUR, RAJASTHAN 302033"
                />
                <IconMapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
            <IconBrandFacebook className="w-5 h-5 text-emerald-600" />
            Social Media Links
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Facebook URL
              </label>
              <div className="relative">
                <input
                  type="url"
                  name="facebookUrl"
                  value={formData.facebookUrl}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 pl-9 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="https://facebook.com"
                />
                <IconBrandFacebook className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Twitter / X URL
              </label>
              <div className="relative">
                <input
                  type="url"
                  name="twitterUrl"
                  value={formData.twitterUrl}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 pl-9 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="https://twitter.com"
                />
                <IconBrandTwitter className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                LinkedIn URL
              </label>
              <div className="relative">
                <input
                  type="url"
                  name="linkedinUrl"
                  value={formData.linkedinUrl}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 pl-9 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="https://linkedin.com"
                />
                <IconBrandLinkedin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                YouTube URL
              </label>
              <div className="relative">
                <input
                  type="url"
                  name="youtubeUrl"
                  value={formData.youtubeUrl}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 pl-9 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="https://youtube.com"
                />
                <IconBrandYoutube className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-3 rounded-lg transition shadow-md disabled:opacity-50"
          >
            {mutation.isPending ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <IconCheck className="w-5 h-5" />
            )}
            Save All Settings
          </button>
        </div>
      </form>
    </div>
  );
}
