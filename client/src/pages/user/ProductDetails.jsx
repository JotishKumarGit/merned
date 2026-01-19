import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { useCartStore } from "../../stores/cartStore";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCartStore();

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });

    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/products/${id}`
        );
        const data = await res.json();
        setProduct(data);

        if (data?.category?._id) {
          fetchRelatedProducts(data.category._id, data._id);
        }

        setTimeout(() => AOS.refresh(), 100);
      } catch (error) {
        console.error("Product fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const fetchRelatedProducts = async (categoryId, currentProductId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/products?category=${categoryId}`
      );
      const data = await res.json();

      const filtered = data.filter(
        (item) => item._id !== currentProductId
      );

      setRelatedProducts(filtered.slice(0, 4));
    } catch (error) {
      console.error("Related products error:", error);
    }
  };

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.name} added to cart 🛒`, {
      position: "top-right",
      autoClose: 3000,
      theme: "colored",
    });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  if (!product) {
    return <h2 className="text-center mt-5">Product not found</h2>;
  }
  const imageSrc = product.image ? `http://localhost:5000${product.image}` : "/placeholder.png";
  const categoryName = typeof product.category === "object" ? product.category?.name : product.category;

  return (
    <>
      {/* 🔥 HERO BANNER */}
      <div
        className="text-white text-center d-flex flex-column justify-content-center align-items-center"
        style={{
          minHeight: "50vh",
          background: `linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)),
          url(${imageSrc}) center/cover no-repeat`,
        }}
      >
        <h1 className="fw-bold display-5" data-aos="fade-down">
          {product.name}
        </h1>
        <p className="lead mt-3" style={{ maxWidth: "700px" }}>
          {product.description?.substring(0, 120)}...
        </p>
      </div>

      {/* 🔥 PRODUCT DETAILS */}
      <div className="container py-5">
        <div className="row g-5 align-items-center">
          <div className="col-md-6 text-center">
            <img
              src={imageSrc}
              alt={product.name}
              className="img-fluid rounded-4 shadow"
              style={{ maxHeight: "450px", objectFit: "contain" }}
            />
          </div>

          <div className="col-md-6">
            <h2 className="fw-bold">{product.name}</h2>

            <p className="text-muted">
              Category:{" "}
              <span className="fw-semibold">{categoryName}</span>
            </p>

            <h3 className="text-success fw-bold">
              ₹{product.price}
            </h3>

            <p className="mt-3">{product.description}</p>

            <p
              className={`fw-semibold ${
                product.stock > 0 ? "text-success" : "text-danger"
              }`}
            >
              {product.stock > 0 ? "✔ In Stock" : "❌ Out of Stock"}
            </p>

            <div className="d-flex gap-3 mt-4">
              <button
                className="btn btn-primary rounded-pill px-4"
                disabled={product.stock === 0}
                onClick={handleAddToCart}
              >
                🛒 Add to Cart
              </button>

              <Link
                to="/"
                className="btn btn-outline-secondary rounded-pill px-4"
              >
                ⬅ Back
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 🔥 RELATED PRODUCTS */}
      <div className="bg-light py-5">
        <div className="container">
          <h3 className="fw-bold mb-4">Related Products</h3>

          <div className="row g-4">
            {relatedProducts.length > 0 ? (
              relatedProducts.map((item) => {
                const img = item.image
                  ? `http://localhost:5000${item.image}`
                  : "/placeholder.png";

                return (
                  <div className="col-md-3" key={item._id}>
                    <div className="card h-100 shadow-sm border-0 rounded-4">
                      <img
                        src={img}
                        className="card-img-top"
                        alt={item.name}
                        style={{
                          height: "200px",
                          objectFit: "contain",
                        }}
                      />

                      <div className="card-body text-center">
                        <h6 className="fw-semibold">{item.name}</h6>
                        <p className="text-success fw-bold">
                          ₹{item.price}
                        </p>

                        <Link
                          to={`/product/${item._id}`}
                          className="btn btn-sm btn-primary rounded-pill"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-muted">
                No related products found
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductDetails;
