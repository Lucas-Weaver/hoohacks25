"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { MapPin, Navigation } from "lucide-react"
import { motion } from "framer-motion"

interface LocationSelectorProps {
  onLocationSelected: (location: { lat: number; lng: number }) => void
}

export default function LocationSelector({ onLocationSelected }: LocationSelectorProps) {
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const mapRef = useRef<HTMLDivElement>(null)

  // Simulate getting user's current location
  const getCurrentLocation = () => {
    setIsLoading(true)

    // Simulate geolocation API delay
    setTimeout(() => {
      // Random location near San Francisco
      const location = {
        lat: 37.7749 + (Math.random() * 0.02 - 0.01),
        lng: -122.4194 + (Math.random() * 0.02 - 0.01),
      }
      setSelectedLocation(location)
      setIsLoading(false)
    }, 1500)
  }

  // Handle map click to select location
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapRef.current) return

    const rect = mapRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Convert click coordinates to "latitude" and "longitude"
    // This is just a simulation - in a real app, you'd use the Google Maps API
    const mapWidth = rect.width
    const mapHeight = rect.height

    const lat = 37.7749 + ((mapHeight / 2 - y) / mapHeight) * 0.1
    const lng = -122.4194 + ((x - mapWidth / 2) / mapWidth) * 0.1

    setSelectedLocation({ lat, lng })
  }

  const handleSubmit = () => {
    if (selectedLocation) {
      onLocationSelected(selectedLocation)
    }
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full h-[400px] bg-blue-900/30 rounded-lg border border-blue-700 overflow-hidden"
        ref={mapRef}
        onClick={handleMapClick}
      >
        {/* Placeholder Map UI */}
        <div className="absolute inset-0 bg-blue-900/50">
          <div className="absolute inset-0 opacity-30">
            {/* Grid lines */}
            <div className="grid grid-cols-8 h-full">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={`col-${i}`} className="border-r border-blue-500/30"></div>
              ))}
            </div>
            <div className="grid grid-rows-8 h-full">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={`row-${i}`} className="border-b border-blue-500/30"></div>
              ))}
            </div>
          </div>

          {/* Map Features */}
          <div className="absolute inset-0 p-4">
            <div className="absolute top-1/4 left-1/4 w-20 h-8 bg-blue-800/50 rounded-md border border-blue-600/50"></div>
            <div className="absolute top-1/3 right-1/3 w-32 h-6 bg-blue-800/50 rounded-md border border-blue-600/50"></div>
            <div className="absolute bottom-1/4 left-1/2 w-24 h-10 bg-blue-800/50 rounded-md border border-blue-600/50"></div>

            {/* Roads */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-blue-400/50"></div>
            <div className="absolute top-0 bottom-0 left-1/3 w-1 bg-blue-400/50"></div>
            <div className="absolute top-0 bottom-0 right-1/4 w-1 bg-blue-400/50"></div>
            <div className="absolute bottom-1/4 left-0 right-0 h-1 bg-blue-400/50"></div>
          </div>

          {/* Selected Location Pin */}
          {selectedLocation && (
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="absolute"
              style={{
                left: `${((selectedLocation.lng + 122.4194) / 0.1 + 0.5) * 50}%`,
                top: `${(0.5 - (selectedLocation.lat - 37.7749) / 0.1) * 50}%`,
                transform: "translate(-50%, -100%)",
              }}
            >
              <MapPin className="h-8 w-8 text-red-500 drop-shadow-glow" />
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full mt-1 bg-blue-900/80 text-blue-100 text-xs px-2 py-1 rounded whitespace-nowrap">
                {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
              </div>
            </motion.div>
          )}

          <div className="absolute bottom-4 right-4 flex flex-col gap-2">
            <Button
              size="sm"
              variant="outline"
              className="bg-blue-900/80 border-blue-600 text-blue-200 hover:bg-blue-800 hover:text-blue-100"
              onClick={() => {
                // Zoom in - just for visual effect
                if (mapRef.current) {
                  mapRef.current.classList.add("scale-105")
                  setTimeout(() => {
                    mapRef.current?.classList.remove("scale-105")
                  }, 300)
                }
              }}
            >
              +
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="bg-blue-900/80 border-blue-600 text-blue-200 hover:bg-blue-800 hover:text-blue-100"
              onClick={() => {
                // Zoom out - just for visual effect
                if (mapRef.current) {
                  mapRef.current.classList.add("scale-95")
                  setTimeout(() => {
                    mapRef.current?.classList.remove("scale-95")
                  }, 300)
                }
              }}
            >
              -
            </Button>
          </div>
        </div>

        <div className="absolute top-4 left-4 text-sm text-blue-200 bg-blue-900/80 p-2 rounded">
          Click anywhere on the map to select your location
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex flex-col gap-4"
      >
        <Button
          onClick={getCurrentLocation}
          variant="outline"
          className="border-blue-700 text-blue-300 hover:bg-blue-800 hover:text-blue-100 transition-all duration-300 flex items-center gap-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin h-4 w-4 text-blue-300"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>Getting your location...</span>
            </>
          ) : (
            <>
              <Navigation className="h-4 w-4" />
              <span>Use my current location</span>
            </>
          )}
        </Button>

        <Button
          onClick={handleSubmit}
          className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 transition-all duration-300 shadow-[0_0_15px_rgba(0,149,255,0.5)] hover:shadow-[0_0_20px_rgba(0,149,255,0.7)] py-6"
          disabled={!selectedLocation}
        >
          {selectedLocation ? "Confirm Location" : "Please select a location"}
        </Button>
      </motion.div>
    </div>
  )
}

