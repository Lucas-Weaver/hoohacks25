"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"

export default function IntroAnimation() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Twice as fast animation - 2 seconds total
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 50) {
          // Only go to 50% (middle of screen where the text is)
          clearInterval(interval)
          return 50
        }
        return prev + 5 // Faster increment (5 instead of 2.5)
      })
    }, 100)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-blue-950 z-50">
      <div className="relative w-full h-60 mb-8">
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 animate-pulse"
          >
            MEAL MENTOR
          </motion.h1>
        </div>

        <div className="absolute top-0 left-0 w-full h-full">
          <div className="relative w-full h-full">
            <motion.div
              className="absolute top-1/2 transform -translate-y-1/2 transition-all duration-3000 ease-in-out"
              style={{
                left: `${progress}%`,
                transform: `translateX(-50%) translateY(-50%)`,
                filter: "drop-shadow(0 0 15px rgba(0, 149, 255, 0.7))",
              }}
            >
              <div className="relative w-48 h-48 animate-bounce-slow">
                <Image
                  src="/images/robot-mascot.png"
                  alt="Meal Mentor Robot Mascot"
                  width={192}
                  height={192}
                  priority
                  className="object-contain"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="w-80 h-3 bg-blue-900 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-400 to-cyan-300 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress * 2}%` }} // Double the progress for the bar
        />
      </div>
      <p className="text-blue-300 mt-4 text-lg animate-pulse">Loading your nutrition assistant...</p>
    </div>
  )
}

