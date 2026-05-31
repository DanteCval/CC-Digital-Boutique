const API_URL = "http://localhost:5000/api/categories";

export const getCategories = async () => {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Error al obtener categorías");
  }

  return await response.json();
};

export const createCategory = async (categoryData) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(categoryData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al crear categoría");
  }

  return data;
};

export const updateCategory = async (id, categoryData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(categoryData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al actualizar categoría");
  }

  return data;
};

export const deleteCategory = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al eliminar categoría");
  }

  return data;
};