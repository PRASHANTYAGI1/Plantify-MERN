import React, { useState, useContext } from "react";
import { X } from "lucide-react";
import { addProduct as apiAddProduct } from "../../api/productApi";
import { AuthContext } from "../../context/AuthContext";

export default function AddProductModal({ open, onClose }) {
  const { user } = useContext(AuthContext);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    stock: 1,
    category: "other",
    rentalAvailable: false,
    rentalPricePerDay: "",
    rentalDeposit: "",
  });

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modern error popup
  const [errorPopup, setErrorPopup] = useState("");

  if (!open) return null;

  // Pick files
  const handleFile = (e) => {
    const selected = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...selected].slice(0, 5));
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Backend-compatible submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const fd = new FormData();

      // required fields
      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("price", Number(form.price));
      fd.append("stock", Number(form.stock));
      fd.append("category", form.category);

      // rental fields -> backend expects strings
      fd.append("rentalAvailable", form.rentalAvailable ? "true" : "false");

      if (form.rentalAvailable) {
        fd.append("rentalPricePerDay", form.rentalPricePerDay);
        fd.append("rentalDeposit", form.rentalDeposit);
      }

      // images
      files.forEach((file) => fd.append("productImages", file));

      // API Call
      await apiAddProduct(fd);

      onClose();
      alert("Product added successfully!");
    } catch (err) {
      console.log("Add Product Error:", err);

      const msg = err?.response?.data?.message || "Add product failed";
      setErrorPopup(msg); // Show modern alert
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
        <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>

        <form
          onSubmit={handleSubmit}
          className="relative bg-white rounded-xl p-6 w-full max-w-3xl shadow-xl z-50"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-lg">Add Product</h2>
            <button type="button" onClick={onClose} className="hover:bg-gray-100 p-1 rounded">
              <X />
            </button>
          </div>

          {/* Form Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* LEFT SIDE */}
            <div className="space-y-3">

              {/* Title */}
              <label className="block">
                <span className="text-sm text-gray-600">Title</span>
                <input
                  required
                  className="w-full border rounded px-3 py-2 mt-1"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </label>

              {/* Description */}
              <label className="block">
                <span className="text-sm text-gray-600">Description</span>
                <textarea
                  required
                  className="w-full border rounded px-3 py-2 mt-1 h-28"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                ></textarea>
              </label>

              {/* Price + Stock */}
              <div className="grid grid-cols-2 gap-2">
                <label>
                  <span className="text-sm text-gray-600">Price</span>
                  <input
                    required
                    type="number"
                    className="w-full border rounded px-3 py-2 mt-1"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                  />
                </label>

                <label>
                  <span className="text-sm text-gray-600">Stock</span>
                  <input
                    required
                    type="number"
                    className="w-full border rounded px-3 py-2 mt-1"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  />
                </label>
              </div>

              {/* Category */}
              <label>
                <span className="text-sm text-gray-600">Category</span>
                <select
                  className="w-full border rounded px-3 py-2 mt-1"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  <option value="seeds">Seeds</option>
                  <option value="fertilizers">Fertilizers</option>
                  <option value="pesticides">Pesticides</option>
                  <option value="tools">Tools</option>
                  <option value="machinery">Machinery</option>
                  <option value="equipments">Equipments</option>
                  <option value="grains">Grains</option>
                  <option value="vegetables">Vegetables</option>
                  <option value="fruits">Fruits</option>
                  <option value="other">Other</option>
                </select>
              </label>

              {/* Rental toggle */}
              <label className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  checked={form.rentalAvailable}
                  onChange={(e) =>
                    setForm({ ...form, rentalAvailable: e.target.checked })
                  }
                />
                <span className="text-sm">Enable Rental</span>
              </label>

              {form.rentalAvailable && (
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Rent / day"
                    className="border rounded px-3 py-2"
                    value={form.rentalPricePerDay}
                    onChange={(e) =>
                      setForm({ ...form, rentalPricePerDay: e.target.value })
                    }
                  />
                  <input
                    type="number"
                    placeholder="Deposit"
                    className="border rounded px-3 py-2"
                    value={form.rentalDeposit}
                    onChange={(e) =>
                      setForm({ ...form, rentalDeposit: e.target.value })
                    }
                  />
                </div>
              )}
            </div>

            {/* RIGHT SIDE – Images */}
            <div>
              <span className="text-sm text-gray-600">Images (max 5)</span>

              <div className="border border-dashed rounded p-4 mt-2">
                <input type="file" accept="image/*" multiple onChange={handleFile} />

                <div className="flex flex-wrap gap-2 mt-3">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="relative w-24 h-24 border rounded overflow-hidden"
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt="preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs p-1"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex gap-2">
                <button
                  disabled={loading}
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg"
                >
                  {loading ? "Saving..." : "Save Product"}
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* 🔥 Modern Error Popup */}
      {errorPopup && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md animate-fadeIn text-center">
            <h2 className="text-xl font-semibold text-red-600">Action Required</h2>
            <p className="text-gray-700 mt-2">{errorPopup}</p>

            <button
              onClick={() => setErrorPopup("")}
              className="mt-4 px-5 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              Okay
            </button>
          </div>
        </div>
      )}
    </>
  );
}
