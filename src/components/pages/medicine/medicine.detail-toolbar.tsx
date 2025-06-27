import { useMedicineDialog } from "@/atoms";
import { Button } from "@/components/ui/button";
import { routes } from "@/config";
import { MedicineResponse } from "@/data/interfaces";
import { ArrowLeft, Edit, Trash } from "lucide-react";
import { motion } from 'motion/react';
import { useNavigate } from "react-router-dom";

interface MedicineDetailToolbarProps {
  medicine?: MedicineResponse;
}

export function MedicineDetailToolbar({ medicine }: MedicineDetailToolbarProps) {
  const navigate = useNavigate();
  const { setOpen, setCurrentMedicine } = useMedicineDialog();

  const handleEdit = () => {
    if (medicine) {
      setCurrentMedicine(medicine);
      setOpen("edit");
    }
  };

  const handleDelete = () => {
    if (medicine) {
      setCurrentMedicine(medicine);
      setOpen("delete");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700/30"
    >
      <div className="flex items-center gap-3">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-full border-fuchsia-200 dark:border-fuchsia-800/30 hover:bg-fuchsia-50 hover:border-fuchsia-300 dark:hover:bg-fuchsia-900/20 transition-all shadow-sm"
            onClick={() => navigate(routes.admin.medicines)}
          >
            <ArrowLeft className="h-5 w-5 text-fuchsia-600 dark:text-fuchsia-400" />
          </Button>
        </motion.div>
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-fuchsia-600 to-fuchsia-500 bg-clip-text text-transparent dark:from-fuchsia-400 dark:to-fuchsia-500">Chi tiết thuốc</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Xem và quản lý thông tin sản phẩm</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          <Button
            variant="outline"
            className="gap-2 border-fuchsia-200 hover:border-fuchsia-300 hover:bg-fuchsia-50 text-fuchsia-600 dark:border-fuchsia-800/30 dark:hover:bg-fuchsia-900/20 dark:text-fuchsia-400 shadow-sm rounded-lg h-10 px-4"
            onClick={handleEdit}
            disabled={!medicine}
          >
            <Edit size={16} className="stroke-[2.5px]" />
            <span>Chỉnh sửa</span>
          </Button>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          <Button
            variant="outline"
            className="gap-2 border-red-200 hover:border-red-300 hover:bg-red-50 text-red-600 dark:border-red-800/30 dark:hover:bg-red-900/20 dark:text-red-400 shadow-sm rounded-lg h-10 px-4"
            onClick={handleDelete}
            disabled={!medicine}
          >
            <Trash size={16} className="stroke-[2.5px]" />
            <span>Xóa</span>
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}