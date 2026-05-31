import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../services/authService";

function AdminLoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginAdmin(form.email, form.password);

      localStorage.setItem("token", data.token);
      localStorage.setItem("admin", JSON.stringify(data.admin));

      navigate("/admin");
    } catch (err) {
      setError(err.message || "No se pudo iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 flex items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-md p-8">
        <h1 className="text-3xl font-bold text-pink-600 text-center">
          Panel Administrador
        </h1>
        <p className="text-gray-500 text-center mt-2">
          Inicia sesión para gestionar C&C Boutique
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Correo electrónico
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
              placeholder="admin@test.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm font-medium">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-60"
          >
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLoginPage;