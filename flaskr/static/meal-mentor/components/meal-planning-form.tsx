"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, Cpu, Utensils, Dumbbell } from "lucide-react"
import { motion } from "framer-motion"

interface MealPlanningFormProps {
  onSubmitForm: () => void
}

export default function MealPlanningForm({ onSubmitForm }: MealPlanningFormProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsGenerating(true)

    // Simulate API call delay
    setTimeout(() => {
      setIsGenerating(false)
      onSubmitForm()
    }, 1000)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="group"
        >
          <Label htmlFor="calories" className="text-blue-200 flex items-center">
            <Dumbbell className="h-4 w-4 mr-2 text-blue-400" />
            Daily Calories
          </Label>
          <Input
            type="number"
            id="calories"
            name="calories"
            min="500"
            max="5000"
            placeholder="e.g., 2000"
            required
            className="mt-2 bg-blue-900/30 border-blue-700 focus:border-blue-400 focus:ring-blue-400/50 transition-all duration-300 hover:border-blue-500"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="group"
        >
          <Label className="text-blue-200 flex items-center">
            <Utensils className="h-4 w-4 mr-2 text-blue-400" />
            Primary Macronutrients (grams per day)
          </Label>
          <div className="grid grid-cols-4 gap-4 mt-2">
            <div>
              <Label htmlFor="protein" className="text-blue-300">
                Protein (g)
              </Label>
              <Input
                type="number"
                id="protein"
                name="protein"
                min="0"
                max="300"
                placeholder="e.g., 50"
                className="mt-1 bg-blue-900/30 border-blue-700 focus:border-blue-400 focus:ring-blue-400/50 transition-all duration-300 hover:border-blue-500"
              />
            </div>
            <div>
              <Label htmlFor="carbs" className="text-blue-300">
                Carbs (g)
              </Label>
              <Input
                type="number"
                id="carbs"
                name="carbs"
                min="0"
                max="500"
                placeholder="e.g., 200"
                className="mt-1 bg-blue-900/30 border-blue-700 focus:border-blue-400 focus:ring-blue-400/50 transition-all duration-300 hover:border-blue-500"
              />
            </div>
            <div>
              <Label htmlFor="fat" className="text-blue-300">
                Fat (g)
              </Label>
              <Input
                type="number"
                id="fat"
                name="fat"
                min="0"
                max="200"
                placeholder="e.g., 70"
                className="mt-1 bg-blue-900/30 border-blue-700 focus:border-blue-400 focus:ring-blue-400/50 transition-all duration-300 hover:border-blue-500"
              />
            </div>
            <div>
              <Label htmlFor="sugar" className="text-blue-300">
                Sugar (g)
              </Label>
              <Input
                type="number"
                id="sugar"
                name="sugar"
                min="0"
                max="200"
                placeholder="e.g., 30"
                className="mt-1 bg-blue-900/30 border-blue-700 focus:border-blue-400 focus:ring-blue-400/50 transition-all duration-300 hover:border-blue-500"
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="group"
        >
          <Label htmlFor="meals" className="text-blue-200">
            Number of Meals per Day
          </Label>
          <Select defaultValue="3">
            <SelectTrigger
              id="meals"
              className="mt-2 bg-blue-900/30 border-blue-700 focus:border-blue-400 focus:ring-blue-400/50 transition-all duration-300 hover:border-blue-500"
            >
              <SelectValue placeholder="Select meals per day" />
            </SelectTrigger>
            <SelectContent className="bg-blue-900 border-blue-700">
              <SelectItem value="3">3 (Breakfast, Lunch, Dinner)</SelectItem>
              <SelectItem value="4">4 (Includes Afternoon Snack)</SelectItem>
              <SelectItem value="5">5 (Includes Morning & Afternoon Snacks)</SelectItem>
              <SelectItem value="6">6 (Includes 3 Snacks)</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Collapsible className="w-full group">
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-blue-800/50 rounded-md border border-blue-700/50 hover:bg-blue-800 transition-all duration-300">
              <span className="font-medium text-blue-200 flex items-center">
                <Cpu className="h-4 w-4 mr-2 text-blue-400" />
                Additional Nutritional Goals
              </span>
              <ChevronDown className="h-4 w-4 text-blue-400 transition-transform duration-300 group-data-[state=open]:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="p-3 space-y-4 mt-2 bg-blue-900/30 rounded-md border border-blue-800 animate-slideDown">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="fiber" className="text-blue-300">
                    Fiber (g)
                  </Label>
                  <Input
                    type="number"
                    id="fiber"
                    name="fiber"
                    min="0"
                    max="100"
                    placeholder="e.g., 25"
                    className="mt-1 bg-blue-900/30 border-blue-700 focus:border-blue-400 focus:ring-blue-400/50 transition-all duration-300 hover:border-blue-500"
                  />
                </div>
                <div>
                  <Label htmlFor="sodium" className="text-blue-300">
                    Sodium (mg)
                  </Label>
                  <Input
                    type="number"
                    id="sodium"
                    name="sodium"
                    min="0"
                    max="5000"
                    placeholder="e.g., 2300"
                    className="mt-1 bg-blue-900/30 border-blue-700 focus:border-blue-400 focus:ring-blue-400/50 transition-all duration-300 hover:border-blue-500"
                  />
                </div>
                <div>
                  <Label htmlFor="water" className="text-blue-300">
                    Water (oz)
                  </Label>
                  <Input
                    type="number"
                    id="water"
                    name="water"
                    min="0"
                    max="200"
                    placeholder="e.g., 64"
                    className="mt-1 bg-blue-900/30 border-blue-700 focus:border-blue-400 focus:ring-blue-400/50 transition-all duration-300 hover:border-blue-500"
                  />
                </div>
              </div>
              <p className="text-sm text-blue-400">Leave blank for any fields you don't wish to specify</p>
            </CollapsibleContent>
          </Collapsible>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 transition-all duration-300 shadow-[0_0_15px_rgba(0,149,255,0.5)] hover:shadow-[0_0_20px_rgba(0,149,255,0.7)] disabled:opacity-70 text-lg py-6"
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                Processing...
              </>
            ) : (
              "Continue to Location"
            )}
          </Button>
        </motion.div>
      </div>
    </form>
  )
}

