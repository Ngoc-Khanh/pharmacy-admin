import { Button } from "@/components/ui/button";
import { routes } from "@/config";
import { InvoiceResponse } from "@/data/interfaces";
import { Row } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { Link } from "react-router-dom";

interface InvoiceRowActionsProps {
  row: Row<InvoiceResponse>;
}

export function InvoiceRowActions({ row }: InvoiceRowActionsProps) {
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
          <span className="sr-only">View invoice details</span>
        </Link>
      </Button>
    </div>
  )
}