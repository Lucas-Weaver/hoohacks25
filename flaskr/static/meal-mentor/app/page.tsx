"use client"

import { useState, useEffect } from "react"
import MealPlanningForm from "@/components/meal-planning-form"
import { Logo } from "@/components/logo"
import IntroAnimation from "@/components/intro-animation"
import ChatInterface from "@/components/chat-interface"
import LocationSelector from "@/components/location-selector"
import { Button } from "@/components/ui/button"
import { ArrowRight, ArrowLeft, ChevronDown, MapPin } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(0)
  const [mealPlans, setMealPlans] = useState<string[][]>([])
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null)

  useEffect(() => {
    // Simulate loading time for the intro animation - twice as fast
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000) // Animation takes 2 seconds now

    return () => clearTimeout(timer)
  }, [])

  const handleGenerateMealPlan = (plans: string[][]) => {
    setMealPlans(plans)
    setCurrentStep(3) // Now step 3 is the meal plan results
  }

  const handleLocationSelected = (location: { lat: number; lng: number }) => {
    setSelectedLocation(location)
    // After location is selected, move to meal plan results
    setCurrentStep(3)
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            key="chat-step"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-4xl mx-auto"
          >
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 mb-4">
                Chat with Your Nutrition AI Assistant
              </h2>
              <p className="text-blue-200">
                Tell our AI about your nutrition goals and get personalized recommendations
              </p>
            </div>

            <div className="bg-blue-950/50 backdrop-blur-md rounded-xl shadow-[0_0_15px_rgba(0,149,255,0.3)] border border-blue-500/30 p-6 mb-6">
              <ChatInterface />
            </div>

            <div className="flex justify-center">
              <Button
                onClick={() => setCurrentStep(1)}
                className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 transition-all duration-300 shadow-[0_0_15px_rgba(0,149,255,0.5)] hover:shadow-[0_0_20px_rgba(0,149,255,0.7)] text-lg px-8 py-6"
              >
                Continue to Nutritional Goals <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            <div className="flex justify-center mt-12">
              <ChevronDown className="h-8 w-8 text-blue-400 animate-bounce" />
            </div>
          </motion.div>
        )
      case 1:
        return (
          <motion.div
            key="form-step"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-4xl mx-auto"
          >
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 mb-4">
                Set Your Nutritional Goals
              </h2>
              <p className="text-blue-200">Customize your meal plan based on your specific nutritional requirements</p>
            </div>

            <div className="bg-blue-950/50 backdrop-blur-md rounded-xl shadow-[0_0_15px_rgba(0,149,255,0.3)] border border-blue-500/30 p-6 mb-6">
              <MealPlanningForm onSubmitForm={() => setCurrentStep(2)} />
            </div>

            <div className="flex justify-between">
              <Button
                onClick={() => setCurrentStep(0)}
                variant="outline"
                className="border-blue-700 text-blue-300 hover:bg-blue-800 hover:text-blue-100 transition-all duration-300"
              >
                <ArrowLeft className="mr-2 h-5 w-5" /> Back to AI Assistant
              </Button>

              <Button
                onClick={() => setCurrentStep(2)}
                className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 transition-all duration-300 shadow-[0_0_15px_rgba(0,149,255,0.5)] hover:shadow-[0_0_20px_rgba(0,149,255,0.7)]"
              >
                Continue to Location <MapPin className="ml-2 h-5 w-5" />
              </Button>
            </div>

            <div className="flex justify-center mt-12">
              <ChevronDown className="h-8 w-8 text-blue-400 animate-bounce" />
            </div>
          </motion.div>
        )
      case 2:
        return (
          <motion.div
            key="location-step"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-4xl mx-auto"
          >
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 mb-4">
                Select Your Location
              </h2>
              <p className="text-blue-200">Click on the map to help us find grocery stores and restaurants near you</p>
            </div>

            <div className="bg-blue-950/50 backdrop-blur-md rounded-xl shadow-[0_0_15px_rgba(0,149,255,0.3)] border border-blue-500/30 p-6 mb-6">
              <LocationSelector onLocationSelected={handleLocationSelected} />
            </div>

            <div className="flex justify-between">
              <Button
                onClick={() => setCurrentStep(1)}
                variant="outline"
                className="border-blue-700 text-blue-300 hover:bg-blue-800 hover:text-blue-100 transition-all duration-300"
              >
                <ArrowLeft className="mr-2 h-5 w-5" /> Back to Nutritional Goals
              </Button>

              <Button
                onClick={() => setCurrentStep(3)}
                className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 transition-all duration-300 shadow-[0_0_15px_rgba(0,149,255,0.5)] hover:shadow-[0_0_20px_rgba(0,149,255,0.7)]"
              >
                Generate Meal Plan <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            <div className="flex justify-center mt-12">
              <ChevronDown className="h-8 w-8 text-blue-400 animate-bounce" />
            </div>
          </motion.div>
        )
      case 3:
        return (
          <motion.div
            key="results-step"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-4xl mx-auto"
          >
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 mb-4">
                Your Personalized Meal Plans
              </h2>
              <p className="text-blue-200">
                Based on your nutritional goals, here are your customized meal plans
                {selectedLocation && (
                  <span className="block mt-2 text-sm">
                    Optimized for your location at coordinates: {selectedLocation.lat.toFixed(4)},{" "}
                    {selectedLocation.lng.toFixed(4)}
                  </span>
                )}
              </p>
            </div>

            <div className="bg-blue-950/50 backdrop-blur-md rounded-xl shadow-[0_0_15px_rgba(0,149,255,0.3)] border border-blue-500/30 p-6 mb-10">
              <div className="space-y-6">
                {/* Sample meal plans if none are provided */}
                {!mealPlans || mealPlans.length === 0
                  ? [
                      [
                        "Breakfast: Greek yogurt with berries and honey",
                        "Lunch: Grilled chicken salad with olive oil dressing",
                        "Dinner: Baked salmon with roasted vegetables",
                      ],
                      [
                        "Breakfast: Spinach and mushroom omelette",
                        "Lunch: Quinoa bowl with avocado and black beans",
                        "Dinner: Lean beef stir fry with brown rice",
                      ],
                    ].map((plan, planIndex) => (
                      <motion.div
                        key={planIndex}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: planIndex * 0.2, duration: 0.5 }}
                        className="p-4 bg-blue-900/30 border-blue-700 rounded-xl shadow-[0_0_10px_rgba(0,149,255,0.3)] hover:shadow-[0_0_15px_rgba(0,149,255,0.5)] transition-all duration-300"
                      >
                        <h3 className="text-xl font-semibold mb-4 text-blue-300">Plan Option {planIndex + 1}</h3>
                        <ul className="space-y-3">
                          {plan.map((meal, mealIndex) => (
                            <motion.li
                              key={mealIndex}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: planIndex * 0.2 + mealIndex * 0.1, duration: 0.5 }}
                              className="p-3 bg-blue-800/30 rounded-md border border-blue-700/50 text-blue-100 hover:bg-blue-800/50 transition-all duration-300"
                            >
                              {meal}
                            </motion.li>
                          ))}
                        </ul>
                      </motion.div>
                    ))
                  : mealPlans.map((plan, planIndex) => (
                      <motion.div
                        key={planIndex}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: planIndex * 0.2, duration: 0.5 }}
                        className="p-4 bg-blue-900/30 border-blue-700 rounded-xl shadow-[0_0_10px_rgba(0,149,255,0.3)] hover:shadow-[0_0_15px_rgba(0,149,255,0.5)] transition-all duration-300"
                      >
                        <h3 className="text-xl font-semibold mb-4 text-blue-300">Plan Option {planIndex + 1}</h3>
                        <ul className="space-y-3">
                          {plan.map((meal, mealIndex) => (
                            <motion.li
                              key={mealIndex}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: planIndex * 0.2 + mealIndex * 0.1, duration: 0.5 }}
                              className="p-3 bg-blue-800/30 rounded-md border border-blue-700/50 text-blue-100 hover:bg-blue-800/50 transition-all duration-300"
                            >
                              {meal}
                            </motion.li>
                          ))}
                        </ul>
                      </motion.div>
                    ))}
              </div>

              <div className="flex justify-center mt-8">
                <Button
                  onClick={() => setCurrentStep(0)}
                  className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 transition-all duration-300 shadow-[0_0_15px_rgba(0,149,255,0.5)] hover:shadow-[0_0_20px_rgba(0,149,255,0.7)]"
                >
                  Start Over
                </Button>
              </div>
            </div>
          </motion.div>
        )
      default:
        return null
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-950 to-blue-900 text-white overflow-hidden">
      {loading ? (
        <IntroAnimation />
      ) : (
        <div className="container mx-auto px-4 py-8 min-h-screen">
          <div className="flex flex-col items-center justify-center mb-12 pt-6">
            <Logo />
          </div>

          <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
        </div>
      )}
    </main>
  )
}

