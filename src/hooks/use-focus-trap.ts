'use client'

import { useEffect, useRef } from 'react'

/**
 * Hook pour focus trap - accessibilité avancée
 * Confine le focus clavier dans un élément (modal, dropdown, etc.)
 * + Fermeture Escape key
 */
export function useFocusTrap(isActive: boolean, onClose?: () => void) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!isActive || !containerRef.current) return

    const container = containerRef.current
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    // Focus sur le premier élément au mount
    if (firstElement) {
      setTimeout(() => firstElement.focus(), 100)
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      // Escape key - fermer modale si onClose fourni
      if (event.key === 'Escape' && onClose) {
        event.preventDefault()
        onClose()
        return
      }

      // Tab key - focus trap
      if (event.key !== 'Tab') return

      if (event.shiftKey) {
        // Shift + Tab - aller vers l'élément précédent
        if (document.activeElement === firstElement) {
          event.preventDefault()
          lastElement?.focus()
        }
      } else {
        // Tab - aller vers l'élément suivant
        if (document.activeElement === lastElement) {
          event.preventDefault()
          firstElement?.focus()
        }
      }
    }

    container.addEventListener('keydown', handleKeyDown)

    return () => {
      container.removeEventListener('keydown', handleKeyDown)
    }
  }, [isActive, onClose])

  return containerRef
}
