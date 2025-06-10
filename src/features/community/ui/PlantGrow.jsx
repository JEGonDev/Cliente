import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";

// Partículas flotando (polen)
const Pollen = ({ count = 10 }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <motion.circle
        key={i}
        cx={60 + Math.sin((i / count) * Math.PI * 2) * 30}
        cy={125 + Math.cos((i / count) * Math.PI * 2) * 22}
        r={Math.random() * 2.2 + 1.2}
        fill="#fef9c3"
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: [0, 1, 0],
          scale: [0.8, 1.2, 0.8],
          cy: [125 + Math.cos((i / count) * Math.PI * 2) * 22, 90, 125],
        }}
        transition={{
          delay: 5 + i * 0.3,
          duration: 6 + Math.random() * 2,
          repeat: Infinity,
          repeatDelay: 3 + Math.random(),
        }}
        style={{ pointerEvents: "none" }}
      />
    ))}
  </>
);

const BudPulse = () => {
  const controls = useAnimation();
  useEffect(() => {
    controls.start({
      scale: [1, 1.15, 0.95, 1],
      filter: [
        "drop-shadow(0 0 14px #cff09e99)",
        "drop-shadow(0 0 30px #a3e635cc)",
        "drop-shadow(0 0 18px #a3e63599)",
        "drop-shadow(0 0 14px #cff09e99)",
      ],
      transition: { repeat: Infinity, duration: 5, delay: 6 },
    });
  }, [controls]);
  return (
    <motion.circle
      cx="60"
      cy="45"
      r="12"
      fill="url(#budGradient)"
      animate={controls}
      initial={{ scale: 1, filter: "drop-shadow(0 0 12px #a3e63599)" }}
      style={{ zIndex: 2 }}
    />
  );
};

export const PlantGrow = ({ className = "" }) => (
  <motion.svg
    viewBox="0 0 120 180"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    initial="hidden"
    animate="visible"
    style={{ overflow: "visible" }}
  >
    <defs>
      <linearGradient id="stemGradient" x1="60" y1="160" x2="60" y2="20" gradientUnits="userSpaceOnUse">
        <stop stopColor="#166534" />
        <stop offset="1" stopColor="#22c55e" />
      </linearGradient>
      <radialGradient id="budGradient" cx="60" cy="45" r="20" gradientUnits="userSpaceOnUse">
        <stop stopColor="#eaffb0" />
        <stop offset="0.7" stopColor="#a3e635" />
      </radialGradient>
    </defs>

    {/* Sombra */}
    <motion.ellipse
      cx="60"
      cy="167"
      rx="38"
      ry="12"
      fill="#0005"
      initial={{ opacity: 0, scaleX: 0.4 }}
      animate={{ opacity: 0.15, scaleX: 1 }}
      transition={{ delay: 2, duration: 1.2 }}
    />

    {/* Tallo central */}
    <motion.path
      d="M60 160 C61 110 59 80 60 58"
      stroke="url(#stemGradient)"
      strokeWidth={18}
      strokeLinecap="round"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{
        duration: 4,
        type: "spring",
        stiffness: 60,
        damping: 8,
      }}
    />

    {/* Hojas muy grandes */}
    {/* Hoja izquierda inferior */}
    <motion.path
      d="M60 110 Q-10 160 52 58 Q130 85 60 110 Z"
      fill="#b9fbc0"
      initial={{ scale: 0.4, opacity: 0, rotate: -45, originX: "60", originY: "110" }}
      animate={{ scale: 1, opacity: 1, rotate: 0 }}
      transition={{
        duration: 3.2,
        delay: 2.8,
        type: "spring",
        bounce: 0.25,
      }}
    />
    {/* Vena hoja izquierda inferior */}
    <motion.path
      d="M60 110 Q30 140 57 75"
      stroke="#63b76c"
      strokeWidth={8}
      fill="none"
      strokeLinecap="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 2, delay: 5.1 }}
    />

    {/* Hoja derecha inferior */}
    <motion.path
      d="M60 110 Q130 160 68 58 Q-10 85 60 110 Z"
      fill="#b9fbc0"
      initial={{ scale: 0.4, opacity: 0, rotate: 45, originX: "60", originY: "110" }}
      animate={{ scale: 1, opacity: 1, rotate: 0 }}
      transition={{
        duration: 3.2,
        delay: 3.3,
        type: "spring",
        bounce: 0.25,
      }}
    />
    {/* Vena hoja derecha inferior */}
    <motion.path
      d="M60 110 Q90 140 63 75"
      stroke="#63b76c"
      strokeWidth={8}
      fill="none"
      strokeLinecap="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 2, delay: 5.5 }}
    />

    {/* Hoja izquierda superior */}
    <motion.path
      d="M60 60 Q-20 20 75 45 Q130 70 60 60 Z"
      fill="#b9fbc0"
      initial={{ scale: 0.4, opacity: 0, rotate: -18, originX: "60", originY: "60" }}
      animate={{ scale: 1, opacity: 1, rotate: 0 }}
      transition={{
        duration: 2.8,
        delay: 3.8,
        type: "spring",
        bounce: 0.25,
      }}
    />
    {/* Vena hoja izquierda superior */}
    <motion.path
      d="M60 60 Q32 25 72 40"
      stroke="#63b76c"
      strokeWidth={6}
      fill="none"
      strokeLinecap="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 1.6, delay: 6.1 }}
    />

    {/* Hoja derecha superior */}
    <motion.path
      d="M60 60 Q140 20 45 45 Q-10 70 60 60 Z"
      fill="#b9fbc0"
      initial={{ scale: 0.4, opacity: 0, rotate: 18, originX: "60", originY: "60" }}
      animate={{ scale: 1, opacity: 1, rotate: 0 }}
      transition={{
        duration: 2.8,
        delay: 4.3,
        type: "spring",
        bounce: 0.25,
      }}
    />
    {/* Vena hoja derecha superior */}
    <motion.path
      d="M60 60 Q88 25 48 40"
      stroke="#63b76c"
      strokeWidth={6}
      fill="none"
      strokeLinecap="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 1.6, delay: 6.4 }}
    />

    {/* Brote principal con pulso */}
    <BudPulse />
    {/* Brillo al brote */}
    <motion.ellipse
      cx="60"
      cy="42"
      rx="8"
      ry="3"
      fill="#eaffb0"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: [0, 1, 0], scale: [0.85, 1.1, 0.9] }}
      transition={{
        delay: 7,
        duration: 3,
        repeat: Infinity,
        repeatDelay: 4.2,
      }}
      style={{ mixBlendMode: "screen" }}
    />
    {/* Polen animado */}
    <Pollen count={14} />
  </motion.svg>
);