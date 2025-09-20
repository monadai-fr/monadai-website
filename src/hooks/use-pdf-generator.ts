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

    let tempDiv: HTMLDivElement | null = null
    let canvas: HTMLCanvasElement | null = null

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

      // Créer élément temporaire avec HTML pour capture - MEMORY SAFE
      tempDiv = document.createElement('div')
      tempDiv.innerHTML = htmlContent
      tempDiv.style.cssText = `
        position: absolute;
        left: -9999px;
        top: -9999px;
        width: 800px;
        background-color: #ffffff;
        padding: 30px;
        font-family: Arial, sans-serif;
        line-height: 1.6;
        color: #333;
      `
      
      document.body.appendChild(tempDiv)

      // Attendre rendu DOM
      await new Promise(resolve => setTimeout(resolve, 100))

      // Capture HTML en canvas avec qualité optimisée - MEMORY SAFE
      canvas = await html2canvas(tempDiv, {
        scale: 2, // Plus haute résolution pour éviter flou
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 800,
        height: tempDiv.scrollHeight,
        scrollX: 0,
        scrollY: 0,
        windowWidth: 800,
        windowHeight: tempDiv.scrollHeight,
        removeContainer: true // Cleanup automatique
      })

      // Dimensions PDF optimisées
      const imgWidth = 210 // A4 width en mm
      const pageHeight = 297 // A4 height en mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      
      // Créer PDF avec compression
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true // Compression pour taille optimale
      })

      // Marges et dimensions content
      const marginTop = finalConfig.margins.top
      const marginLeft = finalConfig.margins.left
      const contentWidth = imgWidth - finalConfig.margins.left - finalConfig.margins.right
      const effectivePageHeight = pageHeight - marginTop - finalConfig.margins.bottom

      // Ajuster contenu pour tenir sur une page si possible
      const maxSinglePageHeight = effectivePageHeight * 0.95 // 95% de la page pour marge sécurité

      if (imgHeight <= maxSinglePageHeight) {
        // Une seule page
        const imgData = canvas.toDataURL('image/jpeg', finalConfig.quality)
        pdf.addImage(imgData, 'JPEG', marginLeft, marginTop, contentWidth, imgHeight)
      } else {
        // Multi-pages - diviser intelligemment
        const totalPages = Math.ceil(imgHeight / maxSinglePageHeight)
        const actualPageHeight = imgHeight / totalPages // Répartition équitable

        for (let page = 0; page < totalPages; page++) {
          if (page > 0) {
            pdf.addPage()
          }

          const startY = page * actualPageHeight
          const endY = Math.min((page + 1) * actualPageHeight, imgHeight)
          const pageContentHeight = endY - startY

          // Canvas pour cette page
          const pageCanvas = document.createElement('canvas')
          const ctx = pageCanvas.getContext('2d')
          
          if (ctx && pageContentHeight > 0) {
            const sourceHeight = (pageContentHeight * canvas.width) / contentWidth
            
            pageCanvas.width = canvas.width
            pageCanvas.height = sourceHeight
            
            // Fond blanc obligatoire
            ctx.fillStyle = '#ffffff'
            ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height)
            
            ctx.drawImage(
              canvas,
              0, (startY * canvas.width) / contentWidth, // Source Y
              canvas.width, sourceHeight, // Source dimensions
              0, 0, // Destination
              pageCanvas.width, pageCanvas.height // Destination dimensions
            )

            const imgData = pageCanvas.toDataURL('image/jpeg', finalConfig.quality)
            pdf.addImage(imgData, 'JPEG', marginLeft, marginTop, contentWidth, pageContentHeight)
          }
        }
      }

      // Générer résultats
      const pdfBlob = pdf.output('blob')
      const pdfBase64 = pdf.output('datauristring').split(',')[1] // Enlever prefix
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
      // MEMORY CLEANUP forcé
      if (tempDiv && document.body.contains(tempDiv)) {
        document.body.removeChild(tempDiv)
      }
      if (canvas) {
        canvas.remove()
      }
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
