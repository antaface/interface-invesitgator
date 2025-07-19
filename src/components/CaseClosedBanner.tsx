import { motion } from "framer-motion";

export default function CaseClosedBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="absolute -top-12 left-0 w-full rounded-xl
                 backdrop-blur-md bg-emerald-600/30
                 border border-emerald-200/40
                 text-white text-center font-extrabold tracking-wider
                 py-4 shadow-xl pointer-events-none"
    >
      CASE<br />CLOSED&nbsp;✅
    </motion.div>
  );
}