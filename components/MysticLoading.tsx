"use client"

import type React from "react"
import { Typography } from "@mui/material"

interface MysticLoadingProps {
  text?: string
}

const MysticLoading: React.FC<MysticLoadingProps> = ({ text = "正在解读..." }) => {
  return (
    <div className="mt-6 shadow-lg rounded-lg p-6 animate-pulse bg-gradient-to-r from-purple-50 to-indigo-50">
      <div className="flex items-center justify-center space-x-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full animate-spin opacity-75"></div>
          <div className="absolute inset-2 bg-white rounded-full"></div>
          <div className="absolute inset-4 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full animate-pulse"></div>
        </div>
        <Typography 
          variant="h6" 
          className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 animate-pulse"
        >
          {text}
        </Typography>
      </div>
    </div>
  )
}

export default MysticLoading