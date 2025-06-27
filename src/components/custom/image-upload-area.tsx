import { UploadIcon, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImageUploadAreaProps {
  finalImageUrl?: string | null
  isDragging: boolean
  onOpenFileDialog: () => void
  onDragEnter: (e: React.DragEvent<HTMLElement>) => void
  onDragLeave: (e: React.DragEvent<HTMLElement>) => void
  onDragOver: (e: React.DragEvent<HTMLElement>) => void
  onDrop: (e: React.DragEvent<HTMLElement>) => void
  onRemoveImage?: () => void
  getInputProps: () => React.InputHTMLAttributes<HTMLInputElement> & {
    ref: React.Ref<HTMLInputElement>
  }
  size?: "sm" | "md" | "lg"
  className?: string
  uploadText?: string
  uploadSubText?: string
  supportText?: string
}

const sizeClasses = {
  sm: "size-32",
  md: "size-40", 
  lg: "size-48",
}

export function ImageUploadArea({
  finalImageUrl,
  isDragging,
  onOpenFileDialog,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onRemoveImage,
  getInputProps,
  size = "md",
  className = "",
  uploadText = "Chọn hoặc kéo thả ảnh",
  uploadSubText = "Nhấp để duyệt file",
  supportText = "Hỗ trợ: JPEG, PNG, JPG • Tối đa 5MB",
}: ImageUploadAreaProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        {/* Drop area */}
        <div
          onClick={onOpenFileDialog}
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDragOver={onDragOver}
          onDrop={onDrop}
          className={`
            relative flex ${sizeClasses[size]} items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition-all duration-300 cursor-pointer group
            ${isDragging 
              ? "border-blue-400 bg-blue-50 dark:bg-blue-950/20 scale-105 shadow-lg" 
              : "border-slate-300 dark:border-slate-600 hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-950/10"
            }
            ${finalImageUrl ? "border-solid border-slate-200 dark:border-slate-700 shadow-md" : ""}
            ${className}
          `}
          role="button"
          tabIndex={0}
          aria-label={finalImageUrl ? "Thay đổi ảnh" : "Upload ảnh"}
        >
          {finalImageUrl ? (
            <div className="relative size-full group">
              <img
                className="size-full object-cover rounded-lg"
                src={finalImageUrl}
                alt="Image preview"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 rounded-lg flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white font-medium text-sm bg-black/50 px-3 py-1 rounded-full">
                  Thay đổi ảnh
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 text-center p-4">
              <div className="p-4 rounded-full bg-gradient-to-br from-blue-100 to-violet-100 dark:from-blue-900/30 dark:to-violet-900/30 group-hover:scale-110 transition-transform duration-200">
                <UploadIcon className="size-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {uploadText}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {uploadSubText}
                </p>
              </div>
            </div>
          )}
        </div>
        
        {/* Remove button */}
        {finalImageUrl && onRemoveImage && (
          <Button
            onClick={onRemoveImage}
            size="icon"
            variant="destructive"
            className="absolute -top-2 -right-2 size-7 rounded-full shadow-lg hover:scale-110 transition-transform duration-200 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
            aria-label="Xóa ảnh"
          >
            <XIcon className="size-3.5" />
          </Button>
        )}
        
        <input
          {...getInputProps()}
          className="sr-only"
          aria-label="Upload image file"
          tabIndex={-1}
        />
      </div>

      {/* Support info */}
      <div className="bg-gradient-to-r from-blue-50 to-violet-50 dark:from-blue-950/20 dark:to-violet-950/20 rounded-lg p-3 w-full border border-blue-100 dark:border-blue-900/30">
        <div className="flex items-center gap-2 text-center justify-center">
          <div className="p-1.5 rounded-full bg-blue-100 dark:bg-blue-900/40">
            <svg className="size-3 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">
            {supportText}
          </p>
        </div>
      </div>
    </div>
  )
} 