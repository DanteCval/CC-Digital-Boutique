const API_URL = "http://localhost:5000/api/products";

export const getProducts = async () => {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Error al obtener productos");
  }

  return await response.json();
};

export const getProductById = async (id) => {
  const response = await fetch(`${API_URL}/${id}`);

  if (!response.ok) {
    throw new Error("Error al obtener el producto");
  }

  return await response.json();
};

export const createProduct = async (productData) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al crear producto");
  }

  return data;
};

export const updateProduct = async (id, productData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al actualizar producto");
  }

  return data;
};

export const deleteProduct = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al eliminar producto");
  }

  return data;
};