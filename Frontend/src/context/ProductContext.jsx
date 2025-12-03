import { createContext, useContext, useState, useEffect } from "react";
import {
  addProduct as apiAddProduct,
  updateProduct as apiUpdateProduct,
  deleteProduct as apiDeleteProduct,
  getAllProducts,
  getSingleProduct,
} from "../api/productApi";
import { AuthContext } from "./AuthContext";

export const ProductContext = createContext();

export function ProductProvider({ children }) {
  const { user } = useContext(AuthContext);

  const [products, setProducts] = useState([]);
  const [myProducts, setMyProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // --------------------------
  // Fetch ALL PRODUCTS
  // --------------------------
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await getAllProducts();
      setProducts(res.products || []);
    } catch (err) {
      console.log("Fetch products error:", err);
    } finally {
      setLoading(false);
    }
  };

  // --------------------------
  // Fetch ONLY seller-owned products
  // --------------------------
  const fetchMyProducts = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const res = await getAllProducts(); // backend does not have /my route
      const owned = (res.products || []).filter(
        (p) => p.seller && p.seller === user?._id
      );
      setMyProducts(owned);
    } catch (err) {
      console.log("Fetch my products error:", err);
    } finally {
      setLoading(false);
    }
  };

  // --------------------------
  // ADD PRODUCT
  // --------------------------
  const addProduct = async (formData) => {
    const res = await apiAddProduct(formData);
    await fetchProducts();
    if (user?.role === "seller") await fetchMyProducts();
    return res;
  };

  // --------------------------
  // UPDATE PRODUCT
  // --------------------------
  const updateProduct = async (id, formData) => {
    const res = await apiUpdateProduct(id, formData);
    await fetchProducts();
    if (user?.role === "seller") await fetchMyProducts();
    return res;
  };

  // --------------------------
  // DELETE PRODUCT
  // --------------------------
  const deleteProduct = async (id) => {
    const res = await apiDeleteProduct(id);
    setProducts((prev) => prev.filter((p) => p._id !== id));
    setMyProducts((prev) => prev.filter((p) => p._id !== id));
    return res;
  };

  // --------------------------
  // Load products initially
  // --------------------------
  useEffect(() => {
    fetchProducts();
    if (user?.role === "seller") fetchMyProducts();
  }, [user]);

  return (
    <ProductContext.Provider
      value={{
        products,
        myProducts,
        loading,
        fetchProducts,
        fetchMyProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        getSingleProduct

      }}
    >
      {children}
    </ProductContext.Provider>
  );
}
