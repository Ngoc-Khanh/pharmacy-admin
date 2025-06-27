import { Button } from "@/components/ui/button";
import { CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CategoryDetailResponse, CategoryResponse, MedicineResponse } from "@/data/interfaces";
import { CategoryAPI } from "@/services/v1";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  Loader2,
  Package
} from "lucide-react";
import { CategoryDetailLeftSide } from "./category.detail-left-side";
import { CategoryDetailRightSide } from "./category.detail-right-side";

interface CategoryDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentCategory: CategoryResponse;
}

export function CategoryDetailDialog({
  open,
  onOpenChange,
  currentCategory
}: CategoryDetailDialogProps) {

  // Fetch category detail with medicines
  const { data: categoryDetail, isLoading, error } = useQuery({
    queryKey: ['category-detail', currentCategory.id],
    queryFn: () => CategoryAPI.CategoryDetail(currentCategory.id),
    enabled: open && !!currentCategory.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Type guard to check if category has medicines
  const hasMedicines = (category: unknown): category is CategoryDetailResponse => {
    return !!(category && typeof category === 'object' && 'medicines' in category && Array.isArray((category as CategoryDetailResponse).medicines) && (category as CategoryDetailResponse).medicines.length > 0);
  };

  // Get medicines safely
  const getMedicines = (): MedicineResponse[] => {
    if (hasMedicines(categoryDetail)) return categoryDetail.medicines;
    return [];
  };

  // Loading state
  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-7xl p-0 gap-0 overflow-hidden">
          <DialogHeader className="px-6 py-4 border-b flex-shrink-0">
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              <Package className="h-5 w-5 text-teal-600" />
              Chi tiết danh mục: {currentCategory.title}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-1 items-center justify-center h-[80vh]">
            <div className="flex items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
              <span>Đang tải thông tin chi tiết...</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Error state
  if (error) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-7xl p-0 gap-0 overflow-hidden">
          <DialogHeader className="px-6 py-4 border-b flex-shrink-0">
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              <Package className="h-5 w-5 text-teal-600" />
              Chi tiết danh mục: {currentCategory.title}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-1 items-center justify-center h-[80vh]">
            <div className="text-center space-y-4">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
              <div>
                <h3 className="text-lg font-medium text-red-600">Có lỗi xảy ra</h3>
                <p className="text-sm text-muted-foreground">
                  Không thể tải thông tin chi tiết danh mục. Vui lòng thử lại.
                </p>
              </div>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Đóng
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!categoryDetail) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl h-[90vh] p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b flex-shrink-0">
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Package className="h-5 w-5 text-teal-600" />
            Chi tiết danh mục: {categoryDetail.title}
          </DialogTitle>
          <CardDescription className="mt-1">
            Thông tin chi tiết về danh mục và danh sách thuốc thuộc danh mục này
          </CardDescription>
        </DialogHeader>

        <div className="flex flex-1 min-h-0">
          {/* Left side - Category Information (2/3) */}
          <CategoryDetailLeftSide
            categoryDetail={categoryDetail}
            getMedicines={getMedicines}
          />

          {/* Right side - Medicine List (1/3) */}
          <CategoryDetailRightSide
            getMedicines={getMedicines}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
