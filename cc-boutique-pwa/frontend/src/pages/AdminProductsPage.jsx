import { useEffect, useState } from "react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/productService";
import { getCategories } from "../services/categoryService";

function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);

  const initialForm = {
    name: "",
    description: "",
    price: "",
    categoryId: "",
    colors: "",
    sizes: "",
    stock: "",
    isAvailable: true,
    isFeatured: false,
    isOnSale: false,
    salePrice: "",
    images: "",
  };

  const [form, setForm] = useState(initialForm);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchData = async () => {
    try {
      const [productsData, categoriesData] = await Promise.all([
        getProducts(),
        getCategories(),
      ]);

      setProducts(productsData);
      setCategories(categoriesData);
    } catch {
      setError("No se pudo cargar la información");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setForm(initialForm);
    setEditingProductId(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const buildProductData = () => ({
    name: form.name,
    description: form.description,
    price: Number(form.price),
    categoryId: form.categoryId,
    colors: form.colors
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    sizes: form.sizes
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    stock: Number(form.stock),
    isAvailable: form.isAvailable,
    isFeatured: form.isFeatured,
    isOnSale: form.isOnSale,
    salePrice: form.salePrice ? Number(form.salePrice) : null,
    images: form.images
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const productData = buildProductData();

      if (editingProductId) {
        await updateProduct(editingProductId, productData);
        setSuccess("Producto actualizado correctamente");
      } else {
        await createProduct(productData);
        setSuccess("Producto creado correctamente");
      }

      resetForm();
      await fetchData();
    } catch (err) {
      setError(err.message || "No se pudo guardar el producto");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProductId(product._id);
    setError("");
    setSuccess("");

    setForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price ?? "",
      categoryId: product.categoryId?._id || product.categoryId || "",
      colors: product.colors?.join(", ") || "",
      sizes: product.sizes?.join(", ") || "",
      stock: product.stock ?? "",
      isAvailable: !!product.isAvailable,
      isFeatured: !!product.isFeatured,
      isOnSale: !!product.isOnSale,
      salePrice: product.salePrice ?? "",
      images: product.images?.join(", ") || "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "¿Estás seguro de que deseas eliminar este producto?"
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      await deleteProduct(id);
      setSuccess("Producto eliminado correctamente");

      if (editingProductId === id) {
        resetForm();
      }

      await fetchData();
    } catch (err) {
      setError(err.message || "No se pudo eliminar el producto");
    }
  };

  return (
    <div className="min-h-screen bg-pink-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <h1 className="text-3xl font-bold text-pink-600">
            Gestión de productos
          </h1>
          <p className="text-gray-500 mt-1">
            Administra los productos del catálogo
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 grid gap-8 xl:grid-cols-2">
        <section className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {editingProductId ? "Editar producto" : "Nuevo producto"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Nombre del producto"
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-3"
              required
            />

            <textarea
              name="description"
              placeholder="Descripción"
              value={form.description}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-3"
              rows="3"
              required
            />

            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="number"
                name="price"
                placeholder="Precio"
                value={form.price}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3"
                required
              />

              <input
                type="number"
                name="stock"
                placeholder="Stock"
                value={form.stock}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3"
                required
              />
            </div>

            <select
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-3"
              required
            >
              <option value="">Selecciona una categoría</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>

            <input
              type="text"
              name="colors"
              placeholder="Colores separados por comas"
              value={form.colors}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-3"
            />

            <input
              type="text"
              name="sizes"
              placeholder="Tallas separadas por comas"
              value={form.sizes}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-3"
            />

            <input
              type="text"
              name="images"
              placeholder="URLs de imágenes separadas por comas"
              value={form.images}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-3"
            />

            <div className="grid md:grid-cols-2 gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isAvailable"
                  checked={form.isAvailable}
                  onChange={handleChange}
                />
                Disponible
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={form.isFeatured}
                  onChange={handleChange}
                />
                Destacado
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isOnSale"
                  checked={form.isOnSale}
                  onChange={handleChange}
                />
                En oferta
              </label>

              <input
                type="number"
                name="salePrice"
                placeholder="Precio de oferta"
                value={form.salePrice}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3"
              />
            </div>

            {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
            {success && (
              <p className="text-green-600 text-sm font-medium">{success}</p>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-60"
              >
                {saving
                  ? "Guardando..."
                  : editingProductId
                  ? "Actualizar producto"
                  : "Crear producto"}
              </button>

              {editingProductId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-5 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 transition"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Productos registrados
          </h2>

          {loading ? (
            <p className="text-gray-500">Cargando productos...</p>
          ) : products.length === 0 ? (
            <p className="text-gray-500">No hay productos registrados.</p>
          ) : (
            <div className="space-y-4">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="border border-gray-200 rounded-xl p-4 flex gap-4"
                >
                  <img
                    src={
                      product.images && product.images.length > 0
                        ? product.images[0]
                        : "https://via.placeholder.com/100x120?text=Sin+imagen"
                    }
                    alt={product.name}
                    className="w-24 h-28 object-cover rounded-lg"
                  />

                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {product.description}
                    </p>
                    <p className="text-pink-600 font-bold mt-2">
                      ${product.price}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Categoría: {product.categoryId?.name || "Sin categoría"}
                    </p>

                    <div className="flex gap-2 mt-3">
                      <button
                        type="button"
                        onClick={() => handleEdit(product)}
                        className="px-3 py-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition text-sm"
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(product._id)}
                        className="px-3 py-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition text-sm"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    {product.isFeatured && (
                      <span className="text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded-full">
                        Destacado
                      </span>
                    )}
                    {product.isAvailable ? (
                      <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                        Disponible
                      </span>
                    ) : (
                      <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                        No disponible
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default AdminProductsPage;