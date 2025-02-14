"use client"

import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'

interface TypewriterEffectProps {
  text: string
  delay?: number
  className?: string
  storageKey?: string
  isActive?: boolean
}

const TypewriterEffect: React.FC<TypewriterEffectProps> = ({
  text,
  delay = 50,
  className = '',
  storageKey,
  isActive = true
}) => {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    if (storageKey) {
      const savedText = sessionStorage.getItem(`typewriter_${storageKey}_text`)
      const completed = sessionStorage.getItem(`typewriter_${storageKey}_completed`)
      const savedIndex = sessionStorage.getItem(`typewriter_${storageKey}_index`)

      if (completed === 'true' && savedText === text) {
        setDisplayText(text)
        setCurrentIndex(text.length)
        setIsCompleted(true)
      } else if (savedText === text && savedIndex) {
        const index = parseInt(savedIndex, 10)
        setDisplayText(text.substring(0, index))
        setCurrentIndex(index)
      }
    }
  }, [])

  useEffect(() => {
    if (!isMounted) return

    let timer: NodeJS.Timeout

    if (!isCompleted && currentIndex < text.length && isActive) {
      timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
        
        if (storageKey) {
          sessionStorage.setItem(`typewriter_${storageKey}_text`, text)
          sessionStorage.setItem(`typewriter_${storageKey}_index`, (currentIndex + 1).toString())
          
          if (currentIndex + 1 === text.length) {
            sessionStorage.setItem(`typewriter_${storageKey}_completed`, 'true')
            setIsCompleted(true)
          }
        }
      }, delay)

      return () => clearTimeout(timer)
    }

    return () => {
      if (timer) {
        clearTimeout(timer)
      }
    }
  }, [currentIndex, delay, text, storageKey, isCompleted, isActive, isMounted])

  if (!isMounted) {
    return <div className={`whitespace-pre-line ${className}`}></div>
  }

  return (
    <div className={`whitespace-pre-line ${className}`}>
      <ReactMarkdown
        components={{
          h1: ({node, ...props}) => <h1 className="text-2xl font-bold mt-6 mb-4 text-left text-purple-800" {...props} />,
          h2: ({node, ...props}) => <h2 className="text-xl font-bold mt-5 mb-3 text-left text-purple-700" {...props} />,
          h3: ({node, ...props}) => <h3 className="text-lg font-bold mt-4 mb-2 text-left text-purple-600" {...props} />,
          p: ({node, ...props}) => <p className="my-2 text-left" {...props} />,
          ul: ({node, ...props}) => <ul className="list-disc pl-5 my-2 text-left text-purple-900" {...props} />,
          ol: ({node, ...props}) => <ol className="list-decimal pl-5 my-2 text-left text-purple-900" {...props} />,
          li: ({node, ...props}) => <li className="my-1 text-left text-purple-900" {...props} />,
        }}
      >
        {displayText}
      </ReactMarkdown>
    </div>
  )
}

export default TypewriterEffect
