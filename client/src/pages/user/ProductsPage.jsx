// src/pages/ProductsPage.jsx
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import FiltersPanel from "../components/FiltersPanel";
import api from "../api/apiClient";

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);

  // query params ko object me convert karo
  const query = Object.fromEntries([...searchParams]);

  // filters apply/update karna
  const handleChangeParam = (key, value) => {
    if (value) {
      searchParams.set(key, value);
    } else {
      searchParams.delete(key);
    }
    setSearchParams(searchParams);
  };

  // products load karna
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get(`/products?${searchParams.toString()}`);
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to load products", err);
      }
    };
    fetchProducts();
  }, [searchParams]);

  return (
    <div className="container my-4">
      <div className="row">
        {/* Left side - Filters */}
        <div className="col-md-3">
          <FiltersPanel query={query} onChangeParam={handleChangeParam} />
        </div>

        {/* Right side - Products list */}
        <div className="col-md-9">
          <h4>Products</h4>
          <div className="row">
            {products.length > 0 ? (
              products.map((p) => (
                <div className="col-md-4 mb-3" key={p._id}>
                  <div className="card h-100">
                    <img src={p.image || "https://via.placeholder.com/200"} className="card-img-top" alt={p.name} />
                    <div className="card-body">
                      <h6>{p.name}</h6>
                      <p>₹{p.price}</p>
                      <p>⭐ {p.rating}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No products found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
