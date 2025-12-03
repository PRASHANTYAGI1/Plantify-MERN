// src/components/products/ProductsTable.jsx
import React, { useEffect, useState, useContext, useMemo } from "react";
import { getAllProducts } from "../../api/productApi";
import { AuthContext } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  List,
  Grid,
  ArrowUpDown,
  Eye,
} from "lucide-react";
import StatusBadge from "./StatusBadge";
import { useNavigate } from "react-router-dom";

const PAGE_SIZE = 8;

export default function ProductsTable() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // UI states
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("newest"); // newest, price_asc, price_desc
  const [viewGrid, setViewGrid] = useState(true);
  const [page, setPage] = useState(1);

  // fetch
  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getAllProducts();
        if (!mounted) return;
        setProducts(res.products || []);
      } catch (err) {
        console.warn("Products load failed", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  // Filtered & sorted list (memoized)
  const filtered = useMemo(() => {
    let list = (products || []).slice();

    if (query && query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          (p.title || "").toLowerCase().includes(q) ||
          (p.description || "").toLowerCase().includes(q) ||
          (p.category || "").toLowerCase().includes(q)
      );
    }

    if (sort === "price_asc") {
      list.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    } else if (sort === "price_desc") {
      list.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    } else {
      // newest
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return list;
  }, [products, query, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  useEffect(() => {
    if (page > pageCount) setPage(1);
  }, [pageCount]);

  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-[320px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search products, categories, descriptions..."
              className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-1 focus:ring-emerald-300"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewGrid(true)}
              className={`p-2 rounded ${viewGrid ? "bg-gray-100" : "hover:bg-gray-50"}`}
              title="Grid view"
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setViewGrid(false)}
              className={`p-2 rounded ${!viewGrid ? "bg-gray-100" : "hover:bg-gray-50"}`}
              title="List view"
            >
              <List size={16} />
            </button>

            <div className="relative">
              <select
                value={sort}
                onChange={(e) => { setSort(e.target.value); setPage(1); }}
                className="pl-3 pr-8 py-2 border rounded-lg"
              >
                <option value="newest">Newest</option>
                <option value="price_asc">Price: Low → High</option>
                <option value="price_desc">Price: High → Low</option>
              </select>
              <ArrowUpDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-600">{filtered.length} items</div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500">
            <div className="px-2 py-1 bg-gray-100 rounded">Page {page} / {pageCount}</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div>
        {loading ? (
          <div className="py-12 text-center text-gray-500">Loading products...</div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-gray-500">No products match your search.</div>
        ) : viewGrid ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {pageItems.map((p) => (
                <motion.div
                  key={p._id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="bg-white border rounded-lg p-3 shadow-sm hover:shadow-md transition"
                >
                  <div className="relative">
                    <img
                      src={p.productImages?.[0] || "/placeholder.png"}
                      alt={p.title}
                      className="w-full h-40 object-cover rounded"
                    />
                    <div className="absolute top-3 left-3 bg-white/80 px-2 py-1 rounded text-xs font-semibold">
                      {p.category}
                    </div>
                  </div>

                  <div className="mt-3 flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{p.title}</div>
                      <div className="text-xs text-gray-500 line-clamp-2 mt-1">{p.description}</div>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="font-semibold">₹{p.price}</div>
                        <StatusBadge stock={p.stock} isOutdated={p.isOutdated} />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 items-end">
                      <button
                        onClick={() => navigate(`/product/${p._id}`)}
                        className="p-2 rounded bg-gray-50 hover:bg-gray-100"
                        title="View product"
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {pageItems.map((p) => (
                <motion.div
                  key={p._id}
                  layout
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  className="flex items-center gap-4 bg-white border rounded-lg p-3 hover:shadow-md transition"
                >
                  <img
                    src={p.productImages?.[0] || "/placeholder.png"}
                    alt={p.title}
                    className="w-20 h-20 object-cover rounded"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-4">
                      <div className="font-medium truncate">{p.title}</div>
                      <div className="text-sm font-semibold">₹{p.price}</div>
                    </div>

                    <div className="text-xs text-gray-500 mt-1 truncate">{p.description}</div>

                    <div className="mt-2 flex items-center gap-2">
                      <StatusBadge stock={p.stock} isOutdated={p.isOutdated} />
                      <div className="text-xs text-gray-400">{p?.seller?.name || "Seller"}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/product/${p._id}`)}
                      className="p-2 rounded bg-gray-50 hover:bg-gray-100"
                      title="View"
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filtered.length > PAGE_SIZE && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-600">Showing {Math.min(filtered.length, (page)*PAGE_SIZE)} of {filtered.length}</div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="p-2 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-40"
              disabled={page === 1}
            >
              <ChevronLeft size={16} />
            </button>

            {/* simple page numbers */}
            <div className="hidden sm:flex items-center gap-1">
              {Array.from({ length: pageCount }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`px-3 py-1 rounded ${page === i + 1 ? "bg-emerald-600 text-white" : "bg-gray-100 hover:bg-gray-200"}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
              className="p-2 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-40"
              disabled={page === pageCount}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
