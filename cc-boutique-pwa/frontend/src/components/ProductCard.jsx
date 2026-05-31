import { Link } from "react-router-dom";

function ProductCard({ product }) {
  const imageUrl =
    product.images && product.images.length > 0
      ? product.images[0]
      : "https://via.placeholder.com/300x400?text=Sin+imagen";

  return (
    <Link to={`/product/${product._id}`}>
      <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-72 object-cover"
        />

        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            {product.description}
          </p>

          <div className="mt-3 flex items-center justify-between">
            <span className="text-pink-600 font-bold text-lg">
              ${product.price}
            </span>

            {product.isFeatured && (
              <span className="text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded-full">
                Destacado
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;