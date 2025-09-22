'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { staggerContainer, staggerItem } from '@/lib/motion-variants'
import { useAnalytics } from '@/hooks/use-analytics'

interface FAQItem {
  readonly id: string
  readonly question: string
  readonly answer: string
  readonly click_count?: number
}

interface FAQProps {
  items: readonly FAQItem[]
  title?: string
  className?: string
  section?: 'homepage' | 'services'
}

export default function FAQ({ items, title = "Questions Fréquentes", className = "", section = 'services' }: FAQProps) {
  const [openItem, setOpenItem] = useState<string | null>(null)
  const { trackFAQ } = useAnalytics()

  const toggleItem = (id: string) => {
    const wasOpen = openItem === id
    setOpenItem(wasOpen ? null : id)
    
    // Track seulement ouverture (pas fermeture)
    if (!wasOpen) {
      trackFAQ(id, section)
    }
  }

  return (
    <div className={className}>
      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-50px" }}
      >
        <motion.h2 
          variants={staggerItem}
          className="text-3xl md:text-4xl font-bold text-black text-center mb-12"
        >
          {title}
        </motion.h2>

        <motion.div 
          variants={staggerContainer}
          className="max-w-4xl mx-auto space-y-4"
        >
          {items.map((item) => (
            <motion.div
              key={item.id}
              variants={staggerItem}
              className="bg-white border border-gray-200 rounded-lg shadow-sm"
            >
              <motion.button
                onClick={() => toggleItem(item.id)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors rounded-lg"
                whileHover={{ backgroundColor: "#f9fafb" }}
                whileTap={{ scale: 0.99 }}
              >
                <span className="font-semibold text-gray-900 pr-4">
                  {item.question}
                </span>
                <motion.div
                  animate={{ rotate: openItem === item.id ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="flex-shrink-0"
                >
                  <svg className="w-5 h-5 text-green-sapin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {openItem === item.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-4 text-gray-700 leading-relaxed">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}
