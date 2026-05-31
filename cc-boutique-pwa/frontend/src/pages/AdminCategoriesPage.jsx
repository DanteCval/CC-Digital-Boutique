import { useEffect, useState } from "react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/categoryService";

function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [editingCategoryId, setEditingCategoryId] = useState(null);

  const initialForm = {
    name: "",
    slug: "",
    isActive: true,
  };

  const [form, setForm] = useState(initialForm);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch {
      setError("No se pudieron cargar las categorías");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const resetForm = () => {
    setForm(initialForm);
    setEditingCategoryId(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleNameChange = (e) => {
    const value = e.target.value;

    setForm({
      ...form,
      name: value,
      slug: value
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, ""),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      if (editingCategoryId) {
        await updateCategory(editingCategoryId, form);
        setSuccess("Categoría actualizada correctamente");
      } else {
        await createCategory(form);
        setSuccess("Categoría creada correctamente");
      }

      resetForm();
      await fetchCategories();
    } catch (err) {
      setError(err.message || "No se pudo guardar la categoría");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (category) => {
    setEditingCategoryId(category._id);
    setError("");
    setSuccess("");

    setForm({
      name: category.name || "",
      slug: category.slug || "",
      isActive: !!category.isActive,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "¿Estás seguro de que deseas eliminar esta categoría?"
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      await deleteCategory(id);
      setSuccess("Categoría eliminada correctamente");

      if (editingCategoryId === id) {
        resetForm();
      }

      await fetchCategories();
    } catch (err) {
      setError(err.message || "No se pudo eliminar la categoría");
    }
  };

  return (
    <div className="min-h-screen bg-pink-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-5">
          <h1 className="text-3xl font-bold text-pink-600">
            Gestión de categorías
          </h1>
          <p className="text-gray-500 mt-1">
            Administra las categorías del catálogo
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 grid gap-8 lg:grid-cols-2">
        <section className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {editingCategoryId ? "Editar categoría" : "Nueva categoría"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleNameChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
                placeholder="Ej. Vestidos"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slug
              </label>
              <input
                type="text"
                name="slug"
                value={form.slug}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
                placeholder="Ej. vestidos"
                required
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <label className="text-sm text-gray-700">
                Categoría activa
              </label>
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
                  : editingCategoryId
                  ? "Actualizar categoría"
                  : "Crear categoría"}
              </button>

              {editingCategoryId && (
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
            Categorías registradas
          </h2>

          {loading ? (
            <p className="text-gray-500">Cargando categorías...</p>
          ) : categories.length === 0 ? (
            <p className="text-gray-500">No hay categorías registradas.</p>
          ) : (
            <div className="space-y-3">
              {categories.map((category) => (
                <div
                  key={category._id}
                  className="border border-gray-200 rounded-xl p-4 flex items-center justify-between gap-4"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Slug: {category.slug}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs px-3 py-1 rounded-full ${
                        category.isActive
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {category.isActive ? "Activa" : "Inactiva"}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleEdit(category)}
                      className="px-3 py-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition text-sm"
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(category._id)}
                      className="px-3 py-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition text-sm"
                    >
                      Eliminar
                    </button>
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

export default AdminCategoriesPage;