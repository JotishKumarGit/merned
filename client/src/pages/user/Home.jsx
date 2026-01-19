import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/apiClient";

import ProductCard from "../../components/ui/ProductCard";
import Banner from "./Banner";
import CategorySlider from "../user/CategorySlider";
import WhyChooseUs from "./WhyChooseUs";
import OfferBanner from "./OfferBanner";
import Testimonials from "./Testimonials";
import Newsletter from "./Newsletter";
import { useThemeStore } from "../../stores/themeStore";

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [catProducts, setCatProducts] = useState({});
  const navigate = useNavigate();
  const theme = useThemeStore((state) => state.theme);

  // 🔹 Load categories + top products
  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/categories");
        const cats = res.data.categories || [];
        setCategories(cats);

        const topCats = cats.slice(0, 6);
        const requests = topCats.map((c) =>
          api.get(`/products?category=${c._id}&limit=4`)
        );

        const responses = await Promise.all(requests);
        const map = {};

        responses.forEach((r, i) => {
          map[topCats[i]._id] = r.data.products || [];
        });

        setCatProducts(map);
      } catch (err) {
        console.error("Home load failed", err);
      }
    };

    load();
  }, []);

  return (
    <div className="container-fluid p-0">
      <Banner />

      {/* 🔹 CATEGORY SLIDER */}
      <CategorySlider categories={categories} theme={useThemeStore((s) => s.theme)} onSelect={(id) => navigate(`/shop?category=${id}`)} />

      {/* 🔹 TOP CATEGORIES */}
      <div className={`container-fluid py-5 ${theme === "dark" ? "bg-dark text-light" : ""}`} style={{ background: theme === "dark" ? "#121212" : "#f9f2f2", }} >
        <div className="container">
          <h4 className={`mb-4 ${theme === "dark" ? "text-light" : ""}`}> Top Categories </h4>
          {categories.slice(0, 6).map((cat) => (
            <section key={cat._id} className={`mb-4 p-3 rounded-4 ${theme === "dark" ? "bg-secondary text-light" : "bg-white shadow-sm"}`} >
              {/* 🔹 CATEGORY HEADER */}
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className={theme === "dark" ? "text-light" : ""}> {cat.name} </h5>

                <button className={`btn btn-sm ${theme === "dark" ? "btn-outline-light" : "btn-link text-primary"}`} onClick={() => navigate(`/shop?category=${cat._id}`)} > View more → </button>
              </div>
              {/* 🔹 PRODUCTS */}
              <div className="row g-3">
                {(catProducts[cat._id] || []).map((p) => (
                  <div className="col-6 col-md-3" key={p._id}>
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      <WhyChooseUs />
      <OfferBanner />
      <Testimonials />
      <Newsletter />
    </div>
  );
}
