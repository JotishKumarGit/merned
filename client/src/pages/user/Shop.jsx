import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../../api/apiClient";

import CategorySidebar from "../../components/ui/CategorySidebar";
import FiltersPanel from "../../components/ui/FiltersPanel";
import ProductCard from "../../components/ui/ProductCard";
import Pagination from "../../components/ui/Pagination";
import LoadingPage from "../../components/ui/LoaderPage";

export default function Shop() {
    const [searchParams, setSearchParams] = useSearchParams();

    const [categories, setCategories] = useState([]);
    const [data, setData] = useState({ products: [], total: 0, page: 1, pages: 1, });
    const [loading, setLoading] = useState(false);
    const categoryId = searchParams.get("category") || "";
    const activeCategory = categories.find((c) => c._id === categoryId);

    // helper
    const getParam = (k) => searchParams.get(k) || "";

    // 🔹 Load categories (for sidebar)
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const res = await api.get("/categories");
                setCategories(res.data.categories || []);
            } catch (err) {
                console.error("Category load failed", err);
            }
        };
        loadCategories();
    }, []);

    // 🔹 Load products (based on URL params)
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const qs = searchParams.toString();
                const res = await api.get(`/products?${qs}`);
                setData({
                    products: res.data.products || [],
                    total: res.data.total || 0,
                    page: res.data.page || 1,
                    pages: res.data.pages || 1,
                });
            } catch (err) {
                console.error("Products fetch error", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [searchParams]);

    // 🔹 Update URL param
    const updateParam = (key, value) => {
        const params = new URLSearchParams(searchParams);

        if (!value) params.delete(key);
        else params.set(key, value);

        // reset page on filter change
        if (key !== "page") params.delete("page");

        setSearchParams(params);
    };

    return (
        <div className="container-fluid py-0 px-0" style={{ background: "#f6f6f6" }}>
            {/* banner */}
            {activeCategory && (
                <div className="text-white text-center d-flex flex-column justify-content-center align-items-center shadow-lg mb-4"
                    style={{ minHeight: "38vh", background: `linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.85)), url(${import.meta.env.VITE_API_URL}${activeCategory.bannerImage || activeCategory.image}) center/cover no-repeat`, }}>
                    <h1 className="fw-bold display-4" data-aos="fade-down" data-aos-delay="200" > {activeCategory.name} </h1>
                    {activeCategory.description && (
                        <p className="lead mt-3" data-aos="fade-up" data-aos-delay="400" style={{ maxWidth: "720px" }} >
                            {activeCategory.description.length > 140 ? activeCategory.description.substring(0, 140) + "..." : activeCategory.description}
                        </p>
                    )}
                </div>
            )}
            <div className="container">
                {/* bread crumb */}
                <nav aria-label="breadcrumb" className="mb-3">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <Link to="/">Home</Link>
                        </li>
                        <li className="breadcrumb-item">
                            <Link to="/shop">Shop</Link>
                        </li>
                        {activeCategory && (
                            <li className="breadcrumb-item active" aria-current="page">
                                {activeCategory.name}
                            </li>
                        )}
                    </ol>
                </nav>
                <div className="row">
                    {/* LEFT SIDEBAR */}
                    <div className="col-md-3 mb-4">
                        <CategorySidebar categories={categories} selected={getParam("category")} onSelect={(id) => updateParam("category", id)} />
                        <FiltersPanel query={{ minPrice: getParam("minPrice"), maxPrice: getParam("maxPrice"), minRating: getParam("minRating"), sort: getParam("sort"), }} onChangeParam={updateParam} />
                    </div>
                    {/* RIGHT PRODUCTS */}
                    <div className="col-md-9">
                        {loading ? (<LoadingPage />
                        ) : (
                            <>
                                {data.products.length === 0 ? (
                                    <div className="text-center py-5">
                                        <h5>No products found</h5>
                                    </div>
                                ) : (
                                    <div className="row g-3">
                                        {data.products.map((p) => (
                                            <div className="col-6 col-md-4" key={p._id}>
                                                <ProductCard product={p} />
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <div className="mt-4 d-flex justify-content-center">
                                    <Pagination page={data.page} pages={data.pages} onPage={(p) => updateParam("page", p)} />
                                </div>
                                {categoryId && data.total > data.products.length && (
                                    <div className="text-center mt-4">
                                        <button className="btn btn-outline-primary" onClick={() => { const params = new URLSearchParams(searchParams); params.delete("page"); params.set("limit", data.total); setSearchParams(params); }} >View all products in {activeCategory?.name} </button>
                                    </div>
                                )}

                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
