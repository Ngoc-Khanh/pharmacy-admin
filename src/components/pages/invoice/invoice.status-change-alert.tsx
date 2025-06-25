import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { motion } from 'motion/react';

export function InvoiceStatusChangeAlert() {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className="print:hidden"
    >
      <Alert className="items-center border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20">
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-700 dark:text-amber-400">
            Bạn đang chỉnh sửa trạng thái hóa đơn. Hãy chọn trạng thái mới và nhấn <span className="font-bold">Lưu thay đổi</span> để cập nhật.
          </AlertDescription>
        </div>
      </Alert>
    </motion.div>
  )
}