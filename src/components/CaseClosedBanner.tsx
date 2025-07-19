import { motion } from "framer-motion";

export default function CaseClosedBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed top-8 left-1/2 -translate-x-1/2 w-[350px] rounded-xl backdrop-blur-md bg-emerald-600/30 border border-emerald-200/40 text-xl text-white text-center font-extrabold tracking-wider py-4 shadow-xl z-50"
    >
      CASE<br />CLOSED&nbsp;
    </motion.div>
  );
}