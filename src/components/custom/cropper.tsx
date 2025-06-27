"use client"

import { cn } from '@/lib/utils'
import { useState } from 'react'
import ReactCrop, { Crop, PercentCrop, PixelCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

interface CropperProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string
  crop?: Crop
  onCropChange?: (crop: PixelCrop, percentCrop: PercentCrop) => void
  onCropComplete?: (crop: PixelCrop, percentCrop: PercentCrop) => void
  aspect?: number
  minWidth?: number
  minHeight?: number
  maxWidth?: number
  maxHeight?: number
  disabled?: boolean
  locked?: boolean
  ruleOfThirds?: boolean
  circularCrop?: boolean
}

function Cropper({
  className,
  src,
  crop,
  onCropChange,
  onCropComplete,
  aspect,
  minWidth,
  minHeight,
  maxWidth,
  maxHeight,
  disabled = false,
  locked = false,
  ruleOfThirds = false,
  circularCrop = false,
  ...props
}: CropperProps) {
  const [currentCrop, setCurrentCrop] = useState<Crop | undefined>(crop)

  const handleCropChange = (pixelCrop: PixelCrop, percentCrop: PercentCrop) => {
    setCurrentCrop(pixelCrop)
    onCropChange?.(pixelCrop, percentCrop)
  }

  const handleCropComplete = (pixelCrop: PixelCrop, percentCrop: PercentCrop) => {
    onCropComplete?.(pixelCrop, percentCrop)
  }

  return (
    <div
      className={cn(
        "relative w-full h-full overflow-hidden",
        className
      )}
      {...props}
    >
      <ReactCrop
        crop={currentCrop}
        onChange={handleCropChange}
        onComplete={handleCropComplete}
        aspect={aspect}
        minWidth={minWidth}
        minHeight={minHeight}
        maxWidth={maxWidth}
        maxHeight={maxHeight}
        disabled={disabled}
        locked={locked}
        ruleOfThirds={ruleOfThirds}
        circularCrop={circularCrop}
        className="w-full h-full"
      >
        <img 
          src={src} 
          alt="Crop" 
          className="max-w-full max-h-full object-contain"
        />
      </ReactCrop>
    </div>
  )
}

export { Cropper }
export type { Crop, CropperProps, PercentCrop, PixelCrop }

