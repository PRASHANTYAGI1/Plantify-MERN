import React, { useContext, useState, useEffect } from "react";
import { X, Upload, CheckCircle } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import { updateUserProfile } from "../../api/authapi";

export default function CompleteProfile({ open, onClose }) {
  const { user, setUser } = useContext(AuthContext);

  const [form, setForm] = useState({
    mobile: "",
    location: "",
    farmingType: "",
    landArea: "",
    landUnit: "acre",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [successPopup, setSuccessPopup] = useState("");

  useEffect(() => {
    if (user) {
      setForm({
        mobile: user.mobile || "",
        location: user.location || "",
        farmingType: user.agricultureProfile?.farmingType || "",
        landArea: user.agricultureProfile?.landArea || "",
        landUnit: user.agricultureProfile?.landUnit || "acre",
      });

      setPreview(user.profileImage || "");
    }
  }, [user]);

  if (!open) return null;

  /* ------------------- SUBMIT ------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const fd = new FormData();

      // Basic info
      fd.append("mobile", form.mobile);
      fd.append("location", form.location);

      // Nested Agriculture Data
      fd.append("agricultureProfile[farmingType]", form.farmingType);
      fd.append("agricultureProfile[landArea]", form.landArea);
      fd.append("agricultureProfile[landUnit]", form.landUnit);

      if (image) fd.append("profileImage", image);

      const res = await updateUserProfile(fd);

      setUser(res.user);
      localStorage.setItem("user", JSON.stringify(res.user));

      setSuccessPopup("Profile updated successfully!");

      setTimeout(() => {
        setSuccessPopup("");
        onClose();
      }, 1300);

    } catch (err) {
      alert(err?.response?.data?.message || "Profile update failed");
    } finally {
      setLoading(false);
    }
  };

  /* ------------------- UI ------------------- */
  return (
    <>
      {/* POPUP FLOATING NEAR NAVBAR */}
      <div className="fixed top-16 right-6 z-[9999]">
        <div className="bg-white w-[360px] md:w-[550px] rounded-2xl p-6 shadow-xl border animate-fadeIn relative">

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 p-2 rounded-full"
          >
            <X size={18} />
          </button>

          {/* USER INFO SECTION */}
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Complete Your Profile</h2>

            <div className="mt-2 bg-gray-50 p-3 rounded-lg border">
              <p className="text-sm text-gray-700"><b>Name:</b> {user?.name}</p>
              <p className="text-sm text-gray-700"><b>Email:</b> {user?.email}</p>
              <p className="text-sm text-gray-700 capitalize">
                <b>Role:</b> {user?.role}
              </p>
            </div>

            <p className="text-gray-600 mt-2">
              Fill the details to complete your profile.
            </p>
          </div>

          {/* SUCCESS POPUP */}
          {successPopup && (
            <div className="mb-4 flex items-center gap-2 bg-emerald-50 border border-emerald-200 p-3 rounded-lg text-emerald-700">
              <CheckCircle size={20} />
              {successPopup}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* LEFT INPUTS */}
            <div className="space-y-4">

              {/* Mobile */}
              <label className="block">
                <span className="text-sm text-gray-600">Mobile Number</span>
                <input
                  required
                  maxLength={10}
                  value={form.mobile}
                  onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                  placeholder="9876543210"
                />
              </label>

              {/* Location */}
              <label className="block">
                <span className="text-sm text-gray-600">Location</span>
                <input
                  required
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                  placeholder="Village / City"
                />
              </label>

              {/* Farming Type */}
              <label className="block">
                <span className="text-sm text-gray-600">Farming Type</span>
                <select
                  required
                  value={form.farmingType}
                  onChange={(e) => setForm({ ...form, farmingType: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                >
                  <option value="">Select</option>
                  <option value="organic">Organic</option>
                  <option value="traditional">Traditional</option>
                  <option value="mixed">Mixed</option>
                </select>
              </label>

              {/* Land Area */}
              <label className="block">
                <span className="text-sm text-gray-600">Land Area</span>
                <div className="flex gap-2">
                  <input
                    required
                    type="number"
                    value={form.landArea}
                    onChange={(e) => setForm({ ...form, landArea: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                    placeholder="e.g., 2"
                  />

                  <select
                    value={form.landUnit}
                    onChange={(e) => setForm({ ...form, landUnit: e.target.value })}
                    className="border rounded-lg px-3 py-2 mt-1"
                  >
                    <option value="acre">Acre</option>
                    <option value="hectare">Hectare</option>
                  </select>
                </div>
              </label>
            </div>

            {/* IMAGE UPLOAD */}
            <div>
              <span className="text-sm text-gray-600">Profile Image</span>

              <label className="mt-2 block w-full border-2 border-dashed rounded-xl p-5 text-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setImage(file);
                    setPreview(URL.createObjectURL(file));
                  }}
                />
                <div className="flex flex-col items-center gap-2">
                  <Upload size={30} className="text-gray-500" />
                  <span className="text-sm text-gray-600">Upload Image</span>
                </div>
              </label>

              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="mt-3 w-32 h-32 rounded-full object-cover mx-auto border"
                />
              )}

              <button
                disabled={loading}
                className="mt-6 w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg transition"
              >
                {loading ? "Saving..." : "Save Profile"}
              </button>
            </div>

          </form>

        </div>
      </div>
    </>
  );
}
