import Category from "../models/category.model.js";

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener categorías",
      error: error.message,
    });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, slug, isActive } = req.body;

    const existingCategory = await Category.findOne({
      $or: [{ name }, { slug }],
    });

    if (existingCategory) {
      return res.status(400).json({
        message: "La categoría ya existe",
      });
    }

    const category = new Category({
      name,
      slug,
      isActive,
    });

    await category.save();

    res.status(201).json({
      message: "Categoría creada correctamente",
      category,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al crear categoría",
      error: error.message,
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, isActive } = req.body;

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name, slug, isActive },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({
        message: "Categoría no encontrada",
      });
    }

    res.json({
      message: "Categoría actualizada correctamente",
      category: updatedCategory,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar categoría",
      error: error.message,
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({
        message: "Categoría no encontrada",
      });
    }

    res.json({
      message: "Categoría eliminada correctamente",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar categoría",
      error: error.message,
    });
  }
};