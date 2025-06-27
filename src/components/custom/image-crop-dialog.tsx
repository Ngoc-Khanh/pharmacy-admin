import { ArrowLeftIcon, ZoomInIcon, ZoomOutIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Cropper,
  CropperCropArea,
  CropperDescription,
  CropperImage,
} from "@/components/ui/cropper"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { Slider } from "@/components/ui/slider"
import type { CropArea } from "@/hooks/use-image-crop"

interface ImageCropDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  imageUrl: string | null
  zoom: number
  onZoomChange: (zoom: number) => void
  onCropChange: (pixels: CropArea | null) => void
  onApplyCrop: () => void
  title?: string
  description?: string
  applyButtonText?: string
  className?: string
}

export function ImageCropDialog({
  open,
  onOpenChange,
  imageUrl,
  zoom,
  onZoomChange,
  onCropChange,
  onApplyCrop,
  title = "Cắt và chỉnh sửa ảnh",
  description = "Di chuyển và zoom để có được khu vực ảnh mong muốn",
  applyButtonText = "Áp dụng",
  className = "",
}: ImageCropDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`sm:max-w-3xl p-0 overflow-hidden ${className}`}>
        <DialogDescription className="sr-only">
          {description}
        </DialogDescription>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-cyan-50 dark:from-emerald-950/30 dark:to-cyan-950/30 border-b border-emerald-100 dark:border-emerald-900/30">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              aria-label="Hủy"
              className="hover:bg-white/50 dark:hover:bg-emerald-900/30 rounded-full"
            >
              <ArrowLeftIcon className="size-4 text-emerald-700 dark:text-emerald-300" />
            </Button>
            <div>
              <DialogTitle className="text-lg font-semibold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                {title}
              </DialogTitle>
              <p className="text-sm text-emerald-600 dark:text-emerald-400">
                {description}
              </p>
            </div>
          </div>
          <Button
            onClick={onApplyCrop}
            disabled={!imageUrl}
            size="sm"
            className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white shadow-lg disabled:opacity-50"
          >
            <svg className="size-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {applyButtonText}
          </Button>
        </div>

        {/* Cropper Area */}
        {imageUrl && (
          <div className="bg-slate-900 relative">
            <Cropper
              className="h-[500px]"
              image={imageUrl}
              zoom={zoom}
              onCropChange={onCropChange}
              onZoomChange={onZoomChange}
            >
              <CropperDescription />
              <CropperImage />
              <CropperCropArea />
            </Cropper>
            {/* Gradient overlay for better contrast */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-slate-900/20 via-transparent to-slate-900/20" />
          </div>
        )}

        {/* Zoom Controls */}
        <div className="p-4 bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-900/50 dark:to-gray-900/50 border-t border-slate-200 dark:border-slate-700">
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
              <div className="p-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40">
                <svg className="size-3 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </div>
              <span>Zoom: {Math.round(zoom * 100)}%</span>
            </div>
            <div className="flex items-center gap-4 max-w-md mx-auto">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onZoomChange(Math.max(1, zoom - 0.1))}
                disabled={zoom <= 1}
                className="rounded-full border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50 dark:border-emerald-800 dark:hover:bg-emerald-900/20 disabled:opacity-50"
              >
                <ZoomOutIcon className="size-4 text-emerald-600 dark:text-emerald-400" />
              </Button>
              <Slider
                value={[zoom]}
                min={1}
                max={3}
                step={0.1}
                onValueChange={(value) => onZoomChange(value[0])}
                className="flex-1 [&_[role=slider]]:bg-gradient-to-r [&_[role=slider]]:from-emerald-500 [&_[role=slider]]:to-cyan-500 [&_[role=slider]]:border-0"
                aria-label="Zoom slider"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => onZoomChange(Math.min(3, zoom + 0.1))}
                disabled={zoom >= 3}
                className="rounded-full border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50 dark:border-emerald-800 dark:hover:bg-emerald-900/20 disabled:opacity-50"
              >
                <ZoomInIcon className="size-4 text-emerald-600 dark:text-emerald-400" />
              </Button>
            </div>
            <div className="flex items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <div className="size-1 bg-emerald-500 rounded-full" />
                Di chuyển ảnh để điều chỉnh
              </span>
              <span className="flex items-center gap-1">
                <div className="size-1 bg-cyan-500 rounded-full" />
                Zoom để phóng to/thu nhỏ
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 