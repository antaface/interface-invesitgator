import { motion } from "framer-motion";

export default function CaseClosedRibbon() {
  return (
    <motion.div
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -80, opacity: 0 }}
      transition={{ type: "spring", stiffness: 120 }}
      className="fixed top-6 left-1/2 -translate-x-1/2 bg-green-600 text-white px-6 py-2 rounded-lg shadow-lg z-50 uppercase tracking-wide font-bold"
    >
      Case&nbsp;Closed ✅
    </motion.div>
  );
}