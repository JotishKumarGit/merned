// controllers/categoryController.js
import Category from '../models/Category.js';

// Create category (Admin only)
export const createCategory = async (req, res) => {
  try {
    const { name, description, parent, isPopular } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Category image is required" });
    }

    const category = new Category({
      name,
      description,
      image: `/uploads/${req.file.filename}`, // local image
      parent: parent || null,          // ✅ parent category
      isPopular: isPopular || false,   // ✅ popular flag
    });

    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all categories (Public)
export const getAllCategories = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalCategories = await Category.countDocuments();

    const categories = await Category.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      categories,
      currentPage: page,
      totalPages: Math.ceil(totalCategories / limit),
      totalCategories,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single category
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate("parent");

    if (!category)
      return res.status(404).json({ message: "Category not found" });

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update category (Admin only)
export const updateCategory = async (req, res) => {
  try {
    const updateData = {
      name: req.body.name,
      description: req.body.description,
      parent: req.body.parent || null,     // ✅ update parent
      isPopular: req.body.isPopular,       // ✅ update popular
    };

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!category)
      return res.status(404).json({ message: "Category not found" });

    res.status(200).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete category (Admin only)
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get categories with their products
export const getCategoriesWithProducts = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });

    // Har category ke products fetch karo
    const categoriesWithProducts = await Promise.all(
      categories.map(async (cat) => {
        const products = await Product.find({ category: cat._id }).limit(6);
        return { ...cat.toObject(), products };
      })
    );

    res.status(200).json(categoriesWithProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mega dropdown API
export const getMegaMenuCategories = async (req, res) => {
  try {
    // 1️⃣ Get popular main categories
    const parentCategories = await Category.find({
      isPopular: true,
      parent: null,
    }).sort({ name: 1 });

    const megaMenuData = await Promise.all(
      parentCategories.map(async (parent) => {

        // 2️⃣ Get sub categories
        const subCategories = await Category.find({
          parent: parent._id,
        }).sort({ name: 1 });

        // 3️⃣ Attach products to each sub category
        const subCategoriesWithProducts = await Promise.all(
          subCategories.map(async (sub) => {
            const products = await Product.find({
              subCategory: sub._id,
            })
              .limit(6)
              .select("name price image");

            return {
              _id: sub._id,
              name: sub.name,
              products,
            };
          })
        );

        return {
          _id: parent._id,
          name: parent.name,
          image: parent.image,
          subCategories: subCategoriesWithProducts,
        };
      })
    );

    res.status(200).json(megaMenuData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


