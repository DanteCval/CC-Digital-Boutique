import { Link, useNavigate } from "react-router-dom";

function AdminDashboardPage() {
  const navigate = useNavigate();
  const admin = JSON.parse(localStorage.getItem("admin"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-pink-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-pink-600">
              Panel de Administración
            </h1>
            <p className="text-gray-500 mt-1">
              Bienvenido{admin?.name ? `, ${admin.name}` : ""}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-xl transition"
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid gap-6 md:grid-cols-2">
          <Link to="/admin/categories">
            <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition cursor-pointer">
              <h2 className="text-xl font-semibold text-gray-800">
                Gestión de categorías
              </h2>
              <p className="text-gray-500 mt-2">
                Administra las categorías del catálogo.
              </p>
            </div>
          </Link>

          <Link to="/admin/products">
            <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition cursor-pointer">
              <h2 className="text-xl font-semibold text-gray-800">
                Gestión de productos
              </h2>
              <p className="text-gray-500 mt-2">
                Administra los productos e imágenes del catálogo.
              </p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboardPage;