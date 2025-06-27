import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"

import { siteConfig } from "@/config"

export interface UploadOptions {
  url: string
  method?: "POST" | "PUT" | "PATCH"
  fieldName?: string
  fileName?: string
  onSuccess?: (data: unknown) => void
  onError?: (error: Error) => void
  invalidateQueries?: string[][]
  headers?: Record<string, string>
  transformData?: (data: unknown) => unknown
}

export interface UploadState {
  isUploading: boolean
  progress: number
  error: string | null
}

export function useUpload() {
  const [state, setState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
  })

  const queryClient = useQueryClient()

  const upload = async (file: File | Blob, options: UploadOptions) => {
    const {
      url,
      method = "POST",
      fieldName = "file",
      fileName,
      onSuccess,
      onError,
      invalidateQueries = [],
      headers = {},
      transformData,
    } = options

    setState({
      isUploading: true,
      progress: 0,
      error: null,
    })

    try {
      // Create FormData
      const formData = new FormData()
      
      // Determine file name
      const finalFileName = fileName || 
        (file instanceof File ? file.name : "uploaded-file")
      
      formData.append(fieldName, file, finalFileName)

      // Get authentication token
      const token = localStorage.getItem(siteConfig.auth.jwt_key)

      // Prepare headers
      const finalHeaders: Record<string, string> = {
        ...(token && { Authorization: `Bearer ${token}` }),
        ...headers,
      }

      // Create XMLHttpRequest for progress tracking
      const xhr = new XMLHttpRequest()

      // Return promise
      const uploadPromise = new Promise<unknown>((resolve, reject) => {
        // Progress tracking
        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100)
            setState(prev => ({ ...prev, progress }))
          }
        })

        // Handle completion
        xhr.addEventListener("load", async () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = xhr.responseText ? JSON.parse(xhr.responseText) : {}
              const transformedData = transformData ? transformData(response) : response
              resolve(transformedData)
            } catch {
              reject(new Error("Failed to parse response"))
            }
          } else {
            try {
              const errorData = xhr.responseText ? JSON.parse(xhr.responseText) : {}
              reject(new Error(errorData?.message || `Upload failed with status ${xhr.status}`))
            } catch {
              reject(new Error(`Upload failed with status ${xhr.status}`))
            }
          }
        })

        // Handle errors
        xhr.addEventListener("error", () => {
          reject(new Error("Network error occurred during upload"))
        })

        // Handle abort
        xhr.addEventListener("abort", () => {
          reject(new Error("Upload was cancelled"))
        })

        // Set up request
        xhr.open(method, url)
        
        // Set headers
        Object.entries(finalHeaders).forEach(([key, value]) => {
          xhr.setRequestHeader(key, value)
        })

        // Send request
        xhr.send(formData)
      })

      const result = await uploadPromise

      // Handle success
      setState({
        isUploading: false,
        progress: 100,
        error: null,
      })

      // Invalidate queries
      for (const queryKey of invalidateQueries) {
        await queryClient.invalidateQueries({ queryKey })
      }

      // Call success callback
      onSuccess?.(result)

      return result

    } catch (error) {
      const errorMessage = (error as Error).message || "Upload failed"
      
      setState({
        isUploading: false,
        progress: 0,
        error: errorMessage,
      })

      // Call error callback
      onError?.(error as Error)

      throw error
    }
  }

  const reset = () => {
    setState({
      isUploading: false,
      progress: 0,
      error: null,
    })
  }

  return {
    ...state,
    upload,
    reset,
  }
} 