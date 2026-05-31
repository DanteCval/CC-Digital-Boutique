import Product from "../models/product.model.js";

export const getProducts = async (req, res) => {
  try {
    const { categoryId, q, isAvailable, isFeatured } = req.query;

    const filters = {};

    if (categoryId) filters.categoryId = categoryId;
    if (isAvailable !== undefined) filters.isAvailable = isAvailable === "true";
    if (isFeatured !== undefined) filters.isFeatured = isFeatured === "true";

    if (q) {
      filters.name = { $regex: q, $options: "i" };
    }

    const products = await Product.find(filters)
      .populate("categoryId", "name slug")
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener productos",
      error: error.message,
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id).populate("categoryId", "name slug");

    if (!product) {
      return res.status(404).json({
        message: "Producto no encontrado",
      });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener producto",
      error: error.message,
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      categoryId,
      colors,
      sizes,
      stock,
      isAvailable,
      isFeatured,
      isOnSale,
      salePrice,
      images,
    } = req.body;

    const product = new Product({
      name,
      description,
      price,
      categoryId,
      colors,
      sizes,
      stock,
      isAvailable,
      isFeatured,
      isOnSale,
      salePrice,
      images,
    });

    await product.save();

    res.status(201).json({
      message: "Producto creado correctamente",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al crear producto",
      error: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({
        message: "Producto no encontrado",
      });
    }

    res.json({
      message: "Producto actualizado correctamente",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar producto",
      error: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({
        message: "Producto no encontrado",
      });
    }

    res.json({
      message: "Producto eliminado correctamente",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar producto",
      error: error.message,
    });
  }
};