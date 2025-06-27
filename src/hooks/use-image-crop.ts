import { useCallback, useState } from "react"

// Define type for pixel crop area
export type CropArea = { x: number; y: number; width: number; height: number }

export interface ImageCropState {
  croppedAreaPixels: CropArea | null
  zoom: number
  isCropDialogOpen: boolean
  finalImageUrl: string | null
}

export interface ImageCropOptions {
  outputWidth?: number
  outputHeight?: number
  quality?: number
}

// Helper function to create an image element from URL
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener("load", () => resolve(image))
    image.addEventListener("error", (error) => reject(error))
    image.setAttribute("crossOrigin", "anonymous")
    image.src = url
  })

// Function to crop image and return blob
async function getCroppedImg(
  imageSrc: string,
  pixelCrop: CropArea,
  options: ImageCropOptions = {}
): Promise<Blob | null> {
  const { 
    outputWidth = pixelCrop.width, 
    outputHeight = pixelCrop.height,
    quality = 0.8 
  } = options

  try {
    console.log("getCroppedImg called with:", { 
      imageSrc: imageSrc.substring(0, 50) + "...", 
      pixelCrop, 
      outputWidth, 
      outputHeight 
    })
    
    const image = await createImage(imageSrc)
    console.log("Image loaded:", { width: image.width, height: image.height })
    
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    if (!ctx) {
      console.error("Could not get canvas context")
      return null
    }

    // Ensure valid crop dimensions
    const cropWidth = Math.min(pixelCrop.width, image.width - pixelCrop.x)
    const cropHeight = Math.min(pixelCrop.height, image.height - pixelCrop.y)
    
    console.log("Adjusted crop dimensions:", { cropWidth, cropHeight })

    canvas.width = outputWidth
    canvas.height = outputHeight

    ctx.drawImage(
      image,
      Math.max(0, pixelCrop.x),
      Math.max(0, pixelCrop.y),
      cropWidth,
      cropHeight,
      0,
      0,
      outputWidth,
      outputHeight
    )

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          console.log("Blob created successfully:", blob.size, "bytes")
          resolve(blob)
        } else {
          console.error("Failed to create blob from canvas")
          reject(new Error("Failed to create blob from canvas"))
        }
      }, "image/jpeg", quality)
    })
  } catch (error) {
    console.error("Error in getCroppedImg:", error)
    return null
  }
}

export function useImageCrop(options: ImageCropOptions = {}) {
  const [state, setState] = useState<ImageCropState>({
    croppedAreaPixels: null,
    zoom: 1,
    isCropDialogOpen: false,
    finalImageUrl: null,
  })

  // Update crop area
  const handleCropChange = useCallback((pixels: CropArea | null) => {
    console.log("Crop area changed:", pixels)
    setState(prev => ({ ...prev, croppedAreaPixels: pixels }))
  }, [])

  // Update zoom level
  const setZoom = useCallback((zoom: number) => {
    setState(prev => ({ ...prev, zoom: Math.max(1, Math.min(3, zoom)) }))
  }, [])

  // Open crop dialog
  const openCropDialog = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      isCropDialogOpen: true,
      croppedAreaPixels: null,
      zoom: 1 
    }))
  }, [])

  // Close crop dialog
  const closeCropDialog = useCallback(() => {
    setState(prev => ({ ...prev, isCropDialogOpen: false }))
  }, [])

  // Apply crop to image
  const applyCrop = useCallback(async (previewUrl: string): Promise<string | null> => {
    if (!previewUrl || !state.croppedAreaPixels) {
      console.error("Missing data for apply:", {
        previewUrl: !!previewUrl,
        croppedAreaPixels: !!state.croppedAreaPixels,
      })
      throw new Error("Thiếu dữ liệu để cắt ảnh")
    }

    try {
      console.log("Starting crop with area:", state.croppedAreaPixels)
      const croppedBlob = await getCroppedImg(previewUrl, state.croppedAreaPixels, options)

      if (!croppedBlob) {
        throw new Error("Failed to generate cropped image blob.")
      }

      const newFinalUrl = URL.createObjectURL(croppedBlob)

      // Clean up previous URL
      if (state.finalImageUrl) {
        URL.revokeObjectURL(state.finalImageUrl)
      }

      setState(prev => ({ 
        ...prev, 
        finalImageUrl: newFinalUrl,
        isCropDialogOpen: false 
      }))

      return newFinalUrl
    } catch (error) {
      console.error("Error during apply:", error)
      throw error
    }
  }, [state.croppedAreaPixels, state.finalImageUrl, options])

  // Remove final image
  const removeFinalImage = useCallback(() => {
    if (state.finalImageUrl) {
      URL.revokeObjectURL(state.finalImageUrl)
    }
    setState(prev => ({ 
      ...prev, 
      finalImageUrl: null,
      croppedAreaPixels: null,
      zoom: 1 
    }))
  }, [state.finalImageUrl])

  // Reset all states
  const reset = useCallback(() => {
    if (state.finalImageUrl) {
      URL.revokeObjectURL(state.finalImageUrl)
    }
    setState({
      croppedAreaPixels: null,
      zoom: 1,
      isCropDialogOpen: false,
      finalImageUrl: null,
    })
  }, [state.finalImageUrl])

  // Get cropped blob from final URL
  const getCroppedBlob = useCallback(async (): Promise<Blob | null> => {
    if (!state.finalImageUrl) return null
    
    try {
      const response = await fetch(state.finalImageUrl)
      return await response.blob()
    } catch (error) {
      console.error("Error getting cropped blob:", error)
      return null
    }
  }, [state.finalImageUrl])

  return {
    ...state,
    handleCropChange,
    setZoom,
    openCropDialog,
    closeCropDialog,
    applyCrop,
    removeFinalImage,
    reset,
    getCroppedBlob,
  }
} 