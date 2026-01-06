import React from "react";
import "./User.css";

const features = [
  {
    icon: "bi-truck",
    title: "Fast Delivery",
    desc: "Quick and reliable delivery across all locations with real-time tracking.",
  },
  {
    icon: "bi-shield-check",
    title: "Secure Payments",
    desc: "100% secure payment gateways with multiple payment options.",
  },
  {
    icon: "bi-award",
    title: "Best Quality",
    desc: "We ensure premium quality products directly from trusted sellers.",
  },
  {
    icon: "bi-headset",
    title: "24/7 Support",
    desc: "Our support team is always available to help you anytime.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="why-choose-us container my-5">
      <div className="text-center mb-5">
        <h2 className="fw-bold">Why Choose Us</h2>
        <p className="text-muted">
          We provide the best service with trust, quality and speed
        </p>
      </div>

      <div className="row g-4">
        {features.map((item, index) => (
          <div key={index} className="col-12 col-sm-6 col-lg-3">
            <div className="why-card h-100">
              <div className="icon-box">
                <i className={`bi ${item.icon}`}></i>
              </div>
              <h5 className="mt-3">{item.title}</h5>
              <p className="text-muted">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyChooseUs;
