import { ExcelAPI, ExportModule } from "@/services/v1";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function useExportExcel() {
  return useMutation({
    mutationFn: (module: ExportModule) => ExcelAPI.exportByModule(module),
    onMutate: (module) => {
      toast.loading(`Đang xuất dữ liệu ${module}...`, {
        id: `export-${module}`
      });
    },
    onSuccess: (_, module) => {
      toast.success(`Xuất dữ liệu ${module} thành công!`, {
        id: `export-${module}`
      });
    },
    onError: (error, module) => {
      console.error("Export error:", error);
      toast.error(`Lỗi khi xuất dữ liệu ${module}`, {
        id: `export-${module}`
      });
    }
  });
}
