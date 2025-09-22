'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useImageUpload } from '@/hooks/use-image-upload'

interface ImageUploadProps {
  currentImageUrl?: string
  projectSlug: string
  onImageUploaded: (imageUrl: string) => void
  onImageRemoved?: () => void
}

export default function ImageUpload({ 
  currentImageUrl, 
  projectSlug, 
  onImageUploaded,
  onImageRemoved 
}: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { uploading, error, uploadProjectImage, deleteProjectImage, resetError } = useImageUpload()

  const handleFile = async (file: File) => {
    if (!file) return

    resetError()
    const imageUrl = await uploadProjectImage(file, projectSlug)
    
    if (imageUrl) {
      onImageUploaded(imageUrl)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragActive(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFile(files[0])
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFile(files[0])
    }
  }

  const handleRemoveImage = async () => {
    if (!currentImageUrl) return

    const success = await deleteProjectImage(currentImageUrl)
    if (success) {
      onImageRemoved?.()
    }
  }

  return (
    <div className="space-y-4">
      {/* Current Image Preview */}
      {currentImageUrl && (
        <motion.div 
          className="relative group"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200">
            <Image 
              src={currentImageUrl} 
              alt="Image actuelle du projet"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <motion.button
                onClick={handleRemoveImage}
                className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🗑️ Supprimer
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Upload Zone */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 cursor-pointer ${
          dragActive 
            ? 'border-green-sapin bg-green-50' 
            : currentImageUrl
            ? 'border-gray-300 bg-gray-50'
            : 'border-gray-400 bg-white hover:border-green-sapin hover:bg-green-50'
        }`}
        onDragEnter={() => setDragActive(true)}
        onDragLeave={() => setDragActive(false)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleInputChange}
          className="hidden"
        />

        <AnimatePresence mode="wait">
          {uploading ? (
            <motion.div
              key="uploading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="animate-spin w-8 h-8 border-4 border-green-sapin border-t-transparent rounded-full mx-auto"></div>
              <p className="text-green-600 font-medium">Upload en cours...</p>
            </motion.div>
          ) : (
            <motion.div
              key="upload-zone"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              
              <div>
                <p className="text-gray-600 font-medium">
                  {currentImageUrl ? 'Remplacer l\'image' : 'Ajouter une image'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Glissez-déposez ou cliquez pour sélectionner
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  JPEG, PNG, WebP • Max 2MB
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-red-50 border border-red-200 rounded-lg"
        >
          <p className="text-red-600 text-sm font-medium">{error}</p>
        </motion.div>
      )}

      {/* Help Text */}
      {!currentImageUrl && (
        <div className="text-xs text-gray-500 space-y-1">
          <p>💡 <strong>Recommandations :</strong></p>
          <p>• Format 16:10 (800x500px) pour affichage optimal</p>
          <p>• Images de mockups, dashboards, ou interfaces</p>
          <p>• Compressez vos images avant upload pour performance</p>
        </div>
      )}
    </div>
  )
}
