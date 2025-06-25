import { useSupplierDialog } from "@/atoms";
import { SupplierActionSheet, SupplierDeleteDialog, SupplierDetailDialog } from "@/components/dialogs/supplier";

export default function SupplierDialog() {
  const { open, setOpen, currentSupplier, setCurrentSupplier } = useSupplierDialog();

  return (
    <>
      <SupplierActionSheet
        key="supplier-add"
        open={open === "add"}
        onOpenChange={(isOpen) => {
          if (!isOpen) setOpen(null);
          else setOpen("add");
        }}
      />

      {currentSupplier && (
        <>
          <SupplierActionSheet
            key={`supplier-edit-${currentSupplier.id}`}
            open={open === "edit"}
            onOpenChange={(isOpen) => {
              if (!isOpen) {
                setOpen(null);
                setTimeout(() => {
                  setCurrentSupplier(null);
                }, 300);
              }
            }}
            currentSupplier={currentSupplier}
          />

          <SupplierDetailDialog
            key={`supplier-detail-${currentSupplier.id}`}
            open={open === "detail"}
            onOpenChange={(isOpen) => {
              if (!isOpen) {
                setOpen(null);
                setTimeout(() => {
                  setCurrentSupplier(null);
                }, 300);
              }
            }}
            currentSupplier={currentSupplier}
          />
          
          <SupplierDeleteDialog
            key={`supplier-delete-${currentSupplier.id}`}
            open={open === "delete"}
            onOpenChange={(isOpen) => {
              if (!isOpen) {
                setOpen(null);
                setTimeout(() => {
                  setCurrentSupplier(null);
                }, 300);
              }
            }}
            currentSupplier={currentSupplier}
          />
        </>
      )}
    </>
  )
}