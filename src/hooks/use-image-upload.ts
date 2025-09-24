'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

/**
 * Hook Upload Images - Supabase Storage
 * Upload vers bucket 'project-images' avec compression
 */

export function useImageUpload() {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const uploadProjectImage = async (file: File, projectSlug: string): Promise<string | null> => {
    if (!file) return null
    
    setUploading(true)
    setError(null)

    try {
      // Validation fichier
      const maxSize = 2 * 1024 * 1024 // 2MB
      if (file.size > maxSize) {
        setError('Image trop volumineuse (max 2MB)')
        return null
      }

      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        setError('Format non supporté (JPEG, PNG, WebP uniquement)')
        return null
      }

      // SOLUTION TEMPORAIRE : Créer bucket s'il n'existe pas
      try {
        const { data: buckets } = await supabase.storage.listBuckets()
        const bucketExists = buckets?.some(bucket => bucket.name === 'project-images')

        if (!bucketExists) {
          // Tentative création automatique du bucket
          const { error: bucketError } = await supabase.storage.createBucket('project-images', { 
            public: true,
            allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
            fileSizeLimit: 2097152 // 2MB
          })
          
          if (bucketError) {
            console.error('Erreur création bucket:', bucketError)
            setError('Configuration Storage requise manuellement. Consultez STORAGE-SETUP.md')
            return null
          }
        }
      } catch (bucketError) {
        console.error('Erreur vérification bucket:', bucketError)
        setError('Problème configuration Storage. Voir STORAGE-SETUP.md')
        return null
      }

      // Nom de fichier unique
      const fileExt = file.name.split('.').pop()
      const fileName = `${projectSlug}-${Date.now()}.${fileExt}`
      const filePath = `projects/${fileName}`

      // Upload vers Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('project-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        console.error('Erreur upload:', uploadError)
        setError(`Configuration Storage requise. Voir STORAGE-SETUP.md`)
        return null
      }

      // Récupérer URL publique
      const { data: { publicUrl } } = supabase.storage
        .from('project-images')
        .getPublicUrl(filePath)

      return publicUrl

    } catch (err) {
      console.error('Erreur upload image:', err)
      setError('Erreur lors de l\'upload')
      return null
    } finally {
      setUploading(false)
    }
  }

  // Supprimer image
  const deleteProjectImage = async (imageUrl: string): Promise<boolean> => {
    try {
      // Extraire path depuis URL
      const path = imageUrl.split('/').slice(-2).join('/')
      
      const { error } = await supabase.storage
        .from('project-images')
        .remove([path])

      if (error) {
        console.error('Erreur suppression image:', error)
        return false
      }

      return true
    } catch (err) {
      console.error('Erreur delete image:', err)
      return false
    }
  }

  return {
    uploading,
    error,
    uploadProjectImage,
    deleteProjectImage,
    resetError: () => setError(null)
  }
}
