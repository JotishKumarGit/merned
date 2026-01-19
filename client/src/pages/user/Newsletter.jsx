import { motion } from "framer-motion";

export default function Newsletter() {
  return (
    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="bg-primary text-white py-5 mt-5" >
      <div className="container text-center">
        <h3 className="fw-bold">Subscribe to our Newsletter</h3>
        <p>Get latest offers & updates directly in your inbox</p>

        <div className="d-flex justify-content-center mt-3">
          <input type="email" className="form-control w-50 me-2" placeholder="Enter your email" />
          <button className="btn btn-dark"> Subscribe</button>
        </div>
      </div>
    </motion.div>
  );
}
