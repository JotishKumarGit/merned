import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    image: {
      type: String,
      required: [true, "Category image is required"],
    },

    // NEW: Parent category (for sub-category)
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null, // null = main category
    },

    // NEW: Popular category (for navbar mega menu)
    isPopular: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// 🔥 Prevent duplicate category under same parent
categorySchema.index({ name: 1, parent: 1 }, { unique: true });

const Category = mongoose.model("Category", categorySchema);

export default Category;
