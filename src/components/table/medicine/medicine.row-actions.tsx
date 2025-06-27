import { useMedicineDialog } from "@/atoms";
import { Button } from "@/components/ui/button";
import { routes } from "@/config";
import { MedicineResponse } from "@/data/interfaces";
import { Row } from "@tanstack/react-table";
import { Edit, Eye, Trash } from "lucide-react";
import { Link } from "react-router-dom";

interface MedicineRowActionsProps {
  row: Row<MedicineResponse>;
}

export function MedicineRowActions({ row }: MedicineRowActionsProps) {
  const { setOpen, setCurrentMedicine } = useMedicineDialog();
  
  return (
    <div className="flex items-center justify-end">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 p-0 text-fuchsia-600 hover:text-fuchsia-700 hover:bg-fuchsia-50 rounded-full"
        asChild
      >
        <Link to={`${routes.admin.medicineDetails(row.original.id)}`}>
          <Eye className="h-4 w-4" />
          <span className="sr-only">Xem chi tiết</span>
        </Link>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-full"
        onClick={() => {
          setOpen("edit");
          setCurrentMedicine(row.original);
        }}
      >
        <Edit className="h-4 w-4" />
        <span className="sr-only">Chỉnh sửa</span>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 p-0 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-full"
        onClick={() => {
          setOpen("delete");
          setCurrentMedicine(row.original);
        }}
      >
        <Trash className="h-4 w-4" />
        <span className="sr-only">Xóa hóa đơn</span>
      </Button>
    </div>
  );
}