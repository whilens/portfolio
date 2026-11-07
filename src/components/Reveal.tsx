"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  from?: "up" | "left" | "right";
  instant?: boolean;
};

export function Reveal({
  children,
  className,
  delay = 0,
  from = "up",
  instant = false,
}: RevealProps) {
  const reducePref = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const reduce = mounted && Boolean(reducePref);
  const offset =
    from === "left" ? { x: -56, y: 0 } : from === "right" ? { x: 56, y: 0 } : { x: 0, y: 20 };
  const visible = { opacity: 1, x: 0, y: 0 };

  return (
    <motion.div
      className={className}
      initial={reduce || instant ? visible : { opacity: 0, ...offset }}
      animate={instant ? visible : undefined}
      whileInView={instant ? undefined : visible}
      viewport={instant ? undefined : { once: true, amount: 0.35 }}
      transition={{ duration: reduce ? 0 : 0.8, delay, ease: [0.2, 0.7, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}
