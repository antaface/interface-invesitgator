import { motion } from "framer-motion";

export default function CaseClosedBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="absolute -top-[32px] left-0
                 w-full h-[64px] rounded-xl backdrop-blur-lg
                 bg-emerald-500/25 border border-emerald-200/30
                 text-white text-center font-extrabold tracking-wider
                 flex flex-col items-center justify-center leading-tight
                 shadow-xl z-20 pointer-events-none"
    >
      <span className="text-lg">CASE</span>
      <span className="text-lg">CLOSED&nbsp;✅</span>
    </motion.div>
  );
}