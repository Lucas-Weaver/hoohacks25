"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Bot } from "lucide-react"
import { motion } from "framer-motion"

type Message = {
  text: string
  isAi: boolean
  time: string
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hello! I'm your nutrition assistant. I can help you determine appropriate calorie and macronutrient goals based on your personal needs. What's your goal? (Weight loss, maintenance, muscle gain, etc.)",
      isAi: true,
      time: "Just now",
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (inputValue.trim() === "") return

    // Add user message
    const newMessages = [
      ...messages,
      {
        text: inputValue,
        isAi: false,
        time: "Just now",
      },
    ]

    setMessages(newMessages)
    setInputValue("")
    setIsTyping(true)

    // Simulate AI response after a short delay
    setTimeout(() => {
      let response =
        "I'll help you with that! Based on what you've shared, I would recommend calculating your daily calorie needs based on your activity level and goals. Would you like me to explain how to determine your macronutrient ratios as well?"

      if (inputValue.toLowerCase().includes("weight loss")) {
        response =
          "For weight loss, I typically recommend a moderate calorie deficit of 300-500 calories below your maintenance level. Focus on higher protein intake (around 1.6-2g per kg of body weight) to preserve muscle mass during weight loss. Would you like me to help calculate your specific needs?"
      } else if (inputValue.toLowerCase().includes("muscle") || inputValue.toLowerCase().includes("gain")) {
        response =
          "For muscle gain, you'll want to be in a slight calorie surplus of 200-300 calories above maintenance. Prioritize protein intake (1.6-2.2g per kg of body weight) and ensure adequate carbohydrates to fuel your workouts. Would you like me to help calculate your specific needs?"
      }

      setIsTyping(false)
      setMessages((prev) => [
        ...prev,
        {
          text: response,
          isAi: true,
          time: "Just now",
        },
      ])
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  return (
    <div className="flex flex-col h-[500px]">
      <div className="flex-1 overflow-y-auto p-4 bg-blue-900/30 rounded-md mb-4 border border-blue-700/50">
        {messages.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className={`mb-4 ${message.isAi ? "mr-12" : "ml-12"}`}
          >
            <div
              className={`p-3 rounded-lg ${
                message.isAi
                  ? "bg-blue-800/70 text-blue-100 border border-blue-700/50"
                  : "bg-gradient-to-r from-blue-600 to-cyan-500 text-white ml-auto shadow-[0_0_10px_rgba(0,149,255,0.3)]"
              } transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,149,255,0.4)]`}
            >
              {message.isAi && (
                <div className="flex items-center mb-2 text-blue-300">
                  <Bot className="h-4 w-4 mr-2" />
                  <span className="font-medium">AI Assistant</span>
                </div>
              )}
              {message.text}
            </div>
            <div className={`text-xs mt-1 text-blue-400 ${message.isAi ? "" : "text-right"}`}>{message.time}</div>
          </motion.div>
        ))}
        {isTyping && (
          <div className="mr-12 mb-4 animate-pulse">
            <div className="p-3 rounded-lg bg-blue-800/70 text-blue-100 border border-blue-700/50 inline-flex">
              <span
                className="w-2 h-2 bg-blue-400 rounded-full mr-1 animate-bounce"
                style={{ animationDelay: "0ms" }}
              ></span>
              <span
                className="w-2 h-2 bg-blue-400 rounded-full mr-1 animate-bounce"
                style={{ animationDelay: "150ms" }}
              ></span>
              <span
                className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              ></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message here..."
          className="flex-1 bg-blue-900/30 border-blue-700 focus:border-blue-400 focus:ring-blue-400/50 transition-all duration-300 hover:border-blue-500 text-blue-100 placeholder:text-blue-400"
        />
        <Button
          onClick={handleSendMessage}
          size="icon"
          className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 transition-all duration-300 shadow-[0_0_10px_rgba(0,149,255,0.3)] hover:shadow-[0_0_15px_rgba(0,149,255,0.5)]"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

