import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProductById } from "../services/productService";

function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
        if (data.images && data.images.length > 0) {
          setSelectedImage(data.images[0]);
        }
      } catch {
        setError("No se pudo cargar el producto");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        Cargando producto...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-lg">
        {error || "Producto no encontrado"}
      </div>
    );
  }

  const phoneNumber = "524494958896";
  const whatsappMessage = `Hola, me interesa el producto: ${product.name}`;
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <div className="min-h-screen bg-pink-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-pink-600">C&C Boutique</h1>
            <p className="text-gray-500 mt-1">Detalle del producto</p>
          </div>

          <Link
            to="/"
            className="text-pink-600 font-medium hover:underline"
          >
            Volver al catálogo
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-2 gap-10">
        <div>
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <img
              src={selectedImage || "https://via.placeholder.com/500x700?text=Sin+imagen"}
              alt={product.name}
              className="w-full h-[500px] object-cover"
            />
          </div>

          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3 mt-4">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(img)}
                  className={`rounded-lg overflow-hidden border-2 ${
                    selectedImage === img
                      ? "border-pink-500"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Vista ${index + 1}`}
                    className="w-full h-24 object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-3xl font-bold text-gray-800">{product.name}</h2>

          <p className="text-pink-600 text-2xl font-semibold mt-3">
            ${product.price}
          </p>

          <p className="text-gray-600 mt-6 leading-relaxed">
            {product.description}
          </p>

          <div className="mt-6">
            <h3 className="font-semibold text-gray-800">Colores disponibles:</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {product.colors?.length > 0 ? (
                product.colors.map((color, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm"
                  >
                    {color}
                  </span>
                ))
              ) : (
                <span className="text-gray-500 text-sm">No especificado</span>
              )}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold text-gray-800">Tallas disponibles:</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {product.sizes?.length > 0 ? (
                product.sizes.map((size, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {size}
                  </span>
                ))
              ) : (
                <span className="text-gray-500 text-sm">No especificado</span>
              )}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold text-gray-800">Disponibilidad:</h3>
            <p className="mt-2 text-sm">
              {product.isAvailable ? (
                <span className="text-green-600 font-medium">Disponible</span>
              ) : (
                <span className="text-red-500 font-medium">No disponible</span>
              )}
            </p>
          </div>

          <div className="mt-8">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block w-full text-center bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-xl transition"
            >
              Contactar por WhatsApp
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
export default ProductDetailPage;