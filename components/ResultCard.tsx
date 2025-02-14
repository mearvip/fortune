"use client"

import type React from "react"
import ReactMarkdown from 'react-markdown'
import TypewriterEffect from './TypewriterEffect'

interface ResultCardProps {
  title: string
  content?: string
  children?: React.ReactNode
  enableTypewriter?: boolean
  typewriterDelay?: number
}

const ResultCard: React.FC<ResultCardProps> = ({ 
  title, 
  content, 
  children, 
  enableTypewriter = false,
  typewriterDelay = 50 
}) => {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="bg-purple-100 p-4">
        <h4 className="text-xl font-semibold text-purple-700">{title}</h4>
      </div>
      <div className="p-6">
        <div className="prose max-w-none text-left">
          <div className="text-gray-700 leading-relaxed">
            {content ? (
              enableTypewriter ? (
                <TypewriterEffect 
                  text={content} 
                  delay={typewriterDelay} 
                  storageKey={`${title}_${content.substring(0, 20)}`}
                />
              ) : (
                <div className="prose prose-purple max-w-none">
                  <ReactMarkdown
                    components={{
                      h1: ({node, ...props}) => <h1 className="text-2xl font-bold mt-3 mb-3 text-left text-purple-800" {...props} />,
                      h2: ({node, ...props}) => <h2 className="text-xl font-bold mt-3 mb-3 text-left text-purple-700" {...props} />,
                      h3: ({node, ...props}) => <h3 className="text-lg font-bold mt-4 mb-2 text-left text-purple-600" {...props} />,
                      p: ({node, ...props}) => <p className="my-1 text-left" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc pl-5 my-2 text-left text-purple-900" {...props} />,
                      ol: ({node, ...props}) => <ol className="list-decimal pl-5 my-2 text-left text-purple-900" {...props} />,
                      li: ({node, ...props}) => <li className="my-1 text-left text-purple-900" {...props} />,
                    }}
                  >
                    {content}
                  </ReactMarkdown>
                </div>
              )
            ) : children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResultCard