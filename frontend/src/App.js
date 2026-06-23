import { useEffect, useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
const API_URL = process.env.REACT_APP_API_URL;

function App() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("");
  const [cursor, setCursor] = useState(null);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [newCategory, setNewCategory] = useState("");

  const [search, setSearch] = useState("");

  const categories = [
    "",
    "Electronics",
    "Clothing",
    "Books",
    "Sports",
    "Furniture",
  ];

  async function fetchProducts(reset = false) {
    try {
      setLoading(true);

      let url = `${API_URL}/products?limit=20`;

      if (category) {
        url += `&category=${category}`;
      }

      if (!reset && cursor) {
        url += `&updated_at=${encodeURIComponent(
          cursor.updated_at,
        )}&id=${cursor.id}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (reset) {
        setProducts(data.products || []);
      } else {
        setProducts((prev) => [...prev, ...(data.products || [])]);
      }

      setCursor(data.nextCursor || null);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  async function addProduct() {
    try {
      await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          category: newCategory,
          price,
        }),
      });

      setName("");
      setPrice("");
      setNewCategory("");

      setCursor(null);
      fetchProducts(true);
    } catch (err) {
      console.log(err);
    }
  }

  async function deleteProduct(id) {
    try {
      await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
      });

      setProducts((prev) => prev.filter((product) => product.id !== id));
    } catch (err) {
      console.log(err);
    }
  }

  async function searchProduct() {
    try {
      if (!search.trim()) {
        setCursor(null);
        fetchProducts(true);
        return;
      }

      const response = await fetch(
        `${API_URL}/products/search?keyword=${encodeURIComponent(search)}`,
      );

      const data = await response.json();

      setProducts(data || []);
      setCursor(null);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    setCursor(null);
    fetchProducts(true);
  }, [category]);

  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="bg-blue-100 text-gray-800 border-b">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <h1 className="text-4xl font-bold mb-4">
            Product Management Dashboard
          </h1>

          <p className="text-lg text-gray-600 max-w-2xl">
            Manage products, search inventory, filter categories and monitor
            your business efficiently.
          </p>
        </div>
      </section>

      <div className="min-h-screen bg-blue-50">
        <div className="text-center py-8">
          <h1 className="text-3xl font-bold text-gray-800">Product Browser</h1>
        </div>

        <div className="max-w-7xl mx-auto p-5">
          {/* Category Filter */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl shadow-sm p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <select
                className="border p-3 rounded-lg flex-1"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat || "All Categories"}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Search products..."
                className="border p-3 rounded-lg flex-1"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <button
                onClick={searchProduct}
                className="bg-green-600 hover:bg-green-700 text-white px-8 rounded-lg"
              >
                Search
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="bg-blue-50 border border-blue-200 rounded-xl shadow-sm p-6">
              <h3 className="text-gray-500">Total Products</h3>
              <p className="text-4xl font-bold text-blue-600 mt-2">
                {products.length}
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl shadow-sm p-6">
              <h3 className="text-gray-500">Categories</h3>
              <p className="text-4xl font-bold text-green-600 mt-2">
                {categories.length - 1}
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl shadow-sm p-6">
              <h3 className="text-gray-500">Active Filter</h3>
              <p className="text-2xl font-bold text-purple-600 mt-2">
                {category || "All"}
              </p>
            </div>
          </div>

          {/* Add Product */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl shadow-sm p-6 mb-10">
            <h2 className="text-2xl font-bold mb-5 text-gray-800">
              Add New Product
            </h2>

            <div className="flex flex-wrap gap-4">
              <input
                type="text"
                placeholder="Product Name"
                className="border p-3 rounded-lg flex-1 min-w-[220px]"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <input
                type="number"
                placeholder="Price"
                className="border p-3 rounded-lg flex-1 min-w-[180px]"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />

              <select
                className="border p-3 rounded-lg flex-1 min-w-[220px]"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              >
                <option value="">Select Category</option>
                <option>Electronics</option>
                <option>Clothing</option>
                <option>Books</option>
                <option>Sports</option>
                <option>Furniture</option>
              </select>

              <button
                onClick={addProduct}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-lg font-semibold"
              >
                Add Product
              </button>
            </div>
          </div>

          {/* Products */}
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white border border-blue-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="h-2 bg-blue-400"></div>

                <div className="p-5">
                  <h2 className="text-xl font-bold text-gray-800">
                    {product.name}
                  </h2>

                  <p className="text-blue-600 mt-2">{product.category}</p>

                  <p className="text-green-600 text-lg font-semibold mt-2">
                    ₹{product.price}
                  </p>

                  <div className="mt-4 text-sm text-gray-500">
                    Updated:
                    <br />
                    {new Date(product.updated_at).toLocaleDateString()}
                  </div>

                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded mt-4 w-full"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="flex justify-center mt-10">
            {cursor && (
              <button
                onClick={() => fetchProducts(false)}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
              >
                {loading ? "Loading..." : "Load More"}
              </button>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default App;
