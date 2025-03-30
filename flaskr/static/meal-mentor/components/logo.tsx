"use client"

import Image from "next/image"
import { motion } from "framer-motion"

export function Logo() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col md:flex-row items-center justify-center gap-4"
    >
      <div className="text-center md:text-left">
        <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
          MEAL
          <br />
          MENTOR
        </h1>
      </div>
      <div className="relative w-40 h-40 animate-float">
        <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-xl animate-pulse"></div>
        <Image
          src="/images/robot-mascot.png"
          alt="Meal Mentor Robot Mascot"
          width={160}
          height={160}
          priority
          className="relative z-10 drop-shadow-[0_0_8px_rgba(0,149,255,0.7)] object-contain"
        />
      </div>
    </motion.div>
  )
}

