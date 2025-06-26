import { useInvoiceDialog } from "@/atoms";
import { InvoiceChangeStatusDialog, InvoiceCreateDialog, InvoiceDeleteDialog } from "@/components/dialogs/invocie";

export default function InvoiceDialog() {
  const { open, setOpen, currentInvoice, setCurrentInvoice } = useInvoiceDialog()

  return (
    <>
      <InvoiceCreateDialog
        key={'invoice-create'}
        open={open === "add"}
        onOpenChange={(isOpen) => {
          if (!isOpen) setOpen(null);
          else setOpen("add");
        }}
      />

      {currentInvoice && (
        <>
          <InvoiceChangeStatusDialog
            key={`invoice-change-status-${currentInvoice.id}`}
            open={open === "change-status"}
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