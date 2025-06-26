import { useInvoiceDialog } from "@/atoms";
import { Button } from "@/components/ui/button";
import { routes } from "@/config";
import { InvoiceResponse } from "@/data/interfaces";
import { Row } from "@tanstack/react-table";
import { Edit, Eye, Trash } from "lucide-react";
import { Link } from "react-router-dom";

interface InvoiceRowActionsProps {
  row: Row<InvoiceResponse>;
}

export function InvoiceRowActions({ row }: InvoiceRowActionsProps) {
  const { setOpen, setCurrentInvoice } = useInvoiceDialog();
  
  return (
    <div className="flex items-center justify-end">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 p-0 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-full"
        asChild
      >
        <Link to={`${routes.admin.invoiceDetails(row.original.id)}`}>
          <Eye className="h-4 w-4" />
          <span className="sr-only">Xem chi tiết hóa đơn</span>
        </Link>
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-full"
        onClick={() => {
          setOpen("change-status");
          setCurrentInvoice(row.original);
        }}
      >
        <Edit className="h-4 w-4" />
        <span className="sr-only">Thay đổi trạng thái hóa đơn</span>
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 p-0 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-full"
        onClick={() => {
          setOpen("delete");
          setCurrentInvoice(row.original);
        }}
      >
        <Trash className="h-4 w-4" />
        <span className="sr-only">Xóa hóa đơn</span>
      </Button>
    </div>
  )
}