import { motion } from "framer-motion";

const reviews = [
  {
    name: "Rahul Sharma",
    text: "Amazing quality products and fast delivery!",
  },
  {
    name: "Priya Singh",
    text: "Best shopping experience. Highly recommended.",
  },
  {
    name: "Amit Kumar",
    text: "Customer support is very helpful 👍",
  },
];

export default function Testimonials() {
  return (
    <div className="container my-5">
      <h2 className="text-center fw-bold mb-4">What Our Customers Say</h2>

      <div className="row g-4">
        {reviews.map((r, i) => (
          <motion.div key={i} className="col-md-4" whileHover={{ y: -10 }} >
            <div className="card shadow-sm h-100 border-0 rounded-4">
              <div className="card-body">
                <p className="text-muted">"{r.text}"</p>
                <h6 className="fw-bold mt-3 mb-0">{r.name}</h6>
                <div className="text-warning"> ★★★★☆ </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
