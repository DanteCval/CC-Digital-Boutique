import { useEffect, useMemo, useState } from "react";
import { getProducts } from "../services/productService";
import { getCategories } from "../services/categoryService";
import ProductCard from "../components/ProductCard";

function CatalogPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);

        setProducts(productsData);
        setCategories(categoriesData);
      } catch {
        setError("No se pudo cargar la información del catálogo");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = useMemo(() => {
  return products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "" ||
      product.categoryId?._id === selectedCategory ||
      product.categoryId === selectedCategory;

    const matchesAvailability =
      availabilityFilter === "" ||
      (availabilityFilter === "available" && product.isAvailable === true) ||
      (availabilityFilter === "unavailable" && product.isAvailable === false);

    const matchesPrice =
      priceFilter === "" ||
      (priceFilter === "under300" && product.price < 300) ||
      (priceFilter === "between300and500" &&
        product.price >= 300 &&
        product.price <= 500) ||
      (priceFilter === "over500" && product.price > 500);

    return (
      matchesSearch &&
      matchesCategory &&
      matchesAvailability &&
      matchesPrice
    );
  });
}, [
  products,
  searchTerm,
  selectedCategory,
  availabilityFilter,
  priceFilter,
]);

  const featuredProducts = filteredProducts.filter((product) => product.isFeatured);
  const regularProducts = filteredProducts.filter((product) => !product.isFeatured);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        Cargando productos...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-5">
          <h1 className="text-3xl font-bold text-pink-600">C&C Boutique</h1>
          <p className="text-gray-500 mt-1">Catálogo de ropa para dama</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <section className="bg-white rounded-2xl shadow-sm p-5 mb-8">
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar producto
              </label>
              <input
                type="text"
                placeholder="Ej. vestido, blusa, conjunto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filtrar por categoría
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
              >
                <option value="">Todas las categorías</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Disponibilidad
              </label>
              <select
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
              >
                <option value="">Todos</option>
                <option value="available">Disponibles</option>
                <option value="unavailable">No disponibles</option>
              </select>
            </div>
            <div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Precio
  </label>
  <select
    value={priceFilter}
    onChange={(e) => setPriceFilter(e.target.value)}
    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
  >
    <option value="">Todos</option>
    <option value="under300">Menores a $300</option>
    <option value="between300and500">$300 a $500</option>
    <option value="over500">Mayores a $500</option>
  </select>
</div>
          </div>
          <div className="mt-4">
  <button
    onClick={() => {
      setSearchTerm("");
      setSelectedCategory("");
      setAvailabilityFilter("");
      setPriceFilter("");
    }}
    className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 transition"
  >
    Limpiar filtros
  </button>
</div>
        </section>

        {featuredProducts.length > 0 && (
          <section className="mb-12">
            <div className="mb-5">
              <h2 className="text-2xl font-bold text-gray-800">
                Productos destacados
              </h2>
              <p className="text-gray-500 mt-1">
                Selección especial de C&C Boutique
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </section>
        )}

        <section>
          <div className="mb-5">
            <h2 className="text-2xl font-bold text-gray-800">
              Todos los productos
            </h2>
            <p className="text-gray-500 mt-1">
              Explora el catálogo completo
            </p>
          </div>

          {filteredProducts.length === 0 ? (
            <p className="text-center text-gray-500">
              No se encontraron productos con los filtros seleccionados.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {regularProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default CatalogPage;