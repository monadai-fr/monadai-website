'use client'

import { useState, useCallback } from 'react'

/**
 * Hook PDF Generator - Génération PDF côté client
 * Utilise jsPDF + html2canvas avec dynamic imports (performance bundle)
 * Pattern DRY : Réutilisable pour tous types de documents (devis, factures, rapports)
 */

export interface PDFConfig {
  filename: string
  format: 'A4' | 'A3' | 'letter'
  orientation: 'portrait' | 'landscape'
  quality: number // 0.1 to 1.0
  margins: {
    top: number
    bottom: number
    left: number
    right: number
  }
  scale: number // Pour ajuster la taille du contenu
}

export interface PDFResult {
  blob: Blob
  base64: string
  url: string
}

export function usePDFGenerator() {
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Configuration par défaut optimisée pour devis MonadAI
  const defaultConfig: PDFConfig = {
    filename: 'document.pdf',
    format: 'A4',
    orientation: 'portrait',
    quality: 0.95, // Haute qualité pour texte professionnel
    margins: {
      top: 20,
      bottom: 20,
      left: 15,
      right: 15
    },
    scale: 1.0
  }

  // Génération PDF avec dynamic import (bundle optimization)
  const generateFromHTML = useCallback(async (
    htmlContent: string,
    config: Partial<PDFConfig> = {}
  ): Promise<PDFResult | null> => {
    
    if (!htmlContent.trim()) {
      setError('Contenu HTML requis pour génération PDF')
      return null
    }

    setGenerating(true)
    setError(null)

    try {
      // Dynamic imports pour éviter impact bundle (Cursor Rules performance)
      const [
        { default: jsPDF },
        { default: html2canvas }
      ] = await Promise.all([
        import('jspdf'),
        import('html2canvas')
      ])

      const finalConfig = { ...defaultConfig, ...config }

      // Créer élément temporaire avec HTML pour capture
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = htmlContent
      tempDiv.style.position = 'absolute'
      tempDiv.style.left = '-9999px'
      tempDiv.style.top = '-9999px'
      tempDiv.style.width = '800px' // Largeur fixe pour cohérence
      tempDiv.style.backgroundColor = '#ffffff'
      tempDiv.style.padding = '30px'
      
      document.body.appendChild(tempDiv)

      // Capture HTML en canvas avec qualité optimisée
      const canvas = await html2canvas(tempDiv, {
        scale: finalConfig.scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 800,
        height: tempDiv.scrollHeight,
        scrollX: 0,
        scrollY: 0
      })

      // Nettoyer DOM
      document.body.removeChild(tempDiv)

      // Dimensions PDF
      const imgWidth = finalConfig.format === 'A4' ? 210 : 297 // mm
      const pageHeight = finalConfig.format === 'A4' ? 297 : 210 // mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      
      // Créer PDF
      const pdf = new jsPDF({
        orientation: finalConfig.orientation,
        unit: 'mm',
        format: finalConfig.format
      })

      // Ajouter marges
      const marginTop = finalConfig.margins.top
      const marginLeft = finalConfig.margins.left
      const contentWidth = imgWidth - finalConfig.margins.left - finalConfig.margins.right
      const contentHeight = imgHeight

      // Si contenu trop grand, gérer multi-pages
      let remainingHeight = contentHeight
      let position = 0

      while (remainingHeight > 0) {
        const pageContentHeight = Math.min(remainingHeight, pageHeight - marginTop - finalConfig.margins.bottom)
        
        if (position > 0) {
          pdf.addPage()
        }

        // Canvas pour cette page
        const pageCanvas = document.createElement('canvas')
        const ctx = pageCanvas.getContext('2d')
        
        pageCanvas.width = canvas.width
        pageCanvas.height = (pageContentHeight * canvas.width) / contentWidth
        
        ctx?.drawImage(
          canvas,
          0, (position * canvas.width) / contentWidth, // Source
          canvas.width, pageCanvas.height, // Source size
          0, 0, // Destination  
          pageCanvas.width, pageCanvas.height // Destination size
        )

        const imgData = pageCanvas.toDataURL('image/jpeg', finalConfig.quality)
        pdf.addImage(imgData, 'JPEG', marginLeft, marginTop, contentWidth, pageContentHeight)

        remainingHeight -= pageContentHeight
        position += pageContentHeight
      }

      // Générer résultats
      const pdfBlob = pdf.output('blob')
      const pdfBase64 = pdf.output('datauristring').split(',')[1] // Enlever "data:application/pdf;base64,"
      const pdfUrl = URL.createObjectURL(pdfBlob)

      return {
        blob: pdfBlob,
        base64: pdfBase64,
        url: pdfUrl
      }

    } catch (pdfError) {
      console.error('❌ Erreur génération PDF:', pdfError)
      setError('Impossible de générer le PDF. Veuillez réessayer.')
      return null
    } finally {
      setGenerating(false)
    }
  }, [])

  // Méthode helper pour téléchargement direct (optionnel)
  const downloadPDF = useCallback(async (
    htmlContent: string,
    filename: string,
    config?: Partial<PDFConfig>
  ): Promise<boolean> => {
    const result = await generateFromHTML(htmlContent, { ...config, filename })
    
    if (result) {
      const link = document.createElement('a')
      link.href = result.url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(result.url) // Cleanup memory
      return true
    }
    
    return false
  }, [generateFromHTML])

  // Reset états
  const resetError = useCallback(() => {
    setError(null)
  }, [])

  return {
    // Actions
    generateFromHTML,
    downloadPDF,
    resetError,
    // États
    generating,
    error,
    // Helpers
    isReady: !generating && !error
  }
}
