import Product from "../models/Product.js";

// Create a product
const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, countInStock } = req.body;

    if (!name || !price || !image) {
      return res.status(400).json({ message: "Missing required product fields" });
    }

    const product = new Product({
      name,
      description,
      price,
      image,
      countInStock,
      user: req.user._id,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all products
const getProducts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 6;
    const search = req.query.search;

    const query = {};
    if (search) query.name = { $regex: search, $options: "i" };

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({ products, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get single product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    await product.deleteOne();
    res.json({ message: "Product removed" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const { name, description, price, image, countInStock } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.image = image || product.image;
    product.countInStock = countInStock || product.countInStock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get products created by logged-in user
const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ user: req.user._id });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Add review to product
const addReview = async (req, res) => {
  try {
    const { name, rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: "Product not found" });
    if (!rating || !comment || !name) {
      return res.status(400).json({ message: "Name, rating, and comment are required" });
    }

    const alreadyReviewed = product.reviews.find((r) => r.name === name);
    if (alreadyReviewed) {
      return res.status(400).json({ message: "You have already reviewed this product" });
    }

    product.reviews.push({ name, rating: Number(rating), comment: comment.trim() });
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.numReviews;

    const updatedProduct = await product.save();
    res.status(201).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Export products as CSV
async function exportProducts(req, res) {
  try {
    const products = await Product.find({});
    const csv = products
      .map((p) => `"${p.name}","${p.price}"`)
      .join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=products.csv");
    res.send("Name,Price\n" + csv);
  } catch (error) {
    res.status(500).json({ message: "Export failed", error: error.message });
  }
}

export {
  createProduct,
  getProducts,
  getProductById,
  deleteProduct,
  updateProduct,
  getMyProducts,
  addReview,
  exportProducts,
};