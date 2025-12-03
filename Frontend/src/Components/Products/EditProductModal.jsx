// src/components/products/EditProductModal.jsx
import React, { useState } from "react";
import { X } from "lucide-react";
import { updateProduct } from "../../api/productApi";

export default function EditProductModal({ open, product, onClose, onUpdated }) {

  if (!open || !product) return null;

  const [form, setForm] = useState({
    title: product.title,
    description: product.description,
    price: product.price,
    stock: product.stock,
    category: product.category,
    rentalAvailable: !!product.rentalAvailable,
    rentalPricePerDay: product.rentalPricePerDay,
    rentalDeposit: product.rentalDeposit,
  });

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFile = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const fd = new FormData();

      // IMPORTANT: Only send allowed fields
      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("price", form.price);
      fd.append("stock", form.stock);
      fd.append("category", form.category);
      fd.append("rentalAvailable", form.rentalAvailable ? "true" : "false");

      if (form.rentalAvailable) {
        fd.append("rentalPricePerDay", form.rentalPricePerDay);
        fd.append("rentalDeposit", form.rentalDeposit);
      }

      // Only new files
      files.forEach((file) => fd.append("productImages", file));

      await updateProduct(product._id, fd);

      alert("Updated successfully");
      onUpdated();
      onClose();

    } catch (e) {
      alert(e?.response?.data?.message || "Update failed");
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-start pt-20 z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl w-full max-w-3xl shadow-xl"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Edit Product</h2>
          <button type="button" onClick={onClose}>
            <X />
          </button>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* LEFT */}
          <div className="space-y-3">
            <input className="border p-2 w-full rounded"
              value={form.title}
              onChange={(e)=>setForm({...form, title: e.target.value})}
            />

            <textarea className="border p-2 w-full rounded"
              rows={5}
              value={form.description}
              onChange={(e)=>setForm({...form, description: e.target.value})}
            />

            <input className="border p-2 w-full rounded" type="number"
              value={form.price}
              onChange={(e)=>setForm({...form, price: e.target.value})}
            />

            <input className="border p-2 w-full rounded" type="number"
              value={form.stock}
              onChange={(e)=>setForm({...form, stock: e.target.value})}
            />

            <select className="border p-2 w-full rounded"
              value={form.category}
              onChange={(e)=>setForm({...form, category: e.target.value})}
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
          </div>

          {/* RIGHT */}
          <div>
            <div className="border-2 border-dashed p-4 rounded">
              <input type="file" multiple accept="image/*" onChange={handleFile} />

              <div className="flex flex-wrap mt-3 gap-2">
                {product.productImages.map((img, i) => (
                  <img key={i} src={img} className="w-24 h-24 rounded object-cover" />
                ))}
              </div>
            </div>
          </div>

        </div>

        <button
          disabled={loading}
          className="mt-5 px-5 py-2 bg-emerald-600 text-white rounded-lg"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>

      </form>
    </div>
  );
}
