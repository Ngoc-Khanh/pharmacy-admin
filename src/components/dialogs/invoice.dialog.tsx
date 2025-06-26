import { useInvoiceDialog } from "@/atoms";
import { InvoiceDeleteDialog } from "@/components/dialogs/invocie";

export default function InvoiceDialog() {
  const { open, setOpen, currentInvoice, setCurrentInvoice } = useInvoiceDialog()
  
  return (
    <>
      {currentInvoice && (
        <>
          <InvoiceDeleteDialog
            key={`invoice-delete-${currentInvoice.id}`}
            open={open === "delete"}
            onOpenChange={(isOpen) => {
              if (!isOpen) {
                setOpen(null);
                setTimeout(() => {
                  setCurrentInvoice(null);
                }, 300);
              }
            }}
            currentInvoice={currentInvoice}
          />
        </>
      )}
    </>
  );
}