import { useMedicineDialog } from "@/atoms";
import { MedicineBulkDeleteDialog, MedicineCreateDialog, MedicineDeleteDialog, MedicineUpdateDialog, MedicineUploadImage } from "@/components/dialogs/medicine";

interface Props {
  onBulkDeleteSuccess?: () => void;
}

export default function MedicineDialog({ onBulkDeleteSuccess }: Props = {}) {
  const { open, setOpen, currentMedicine, setCurrentMedicine, selectedMedicinesForBulkDelete, setSelectedMedicinesForBulkDelete } = useMedicineDialog();

  return (
    <>
      <MedicineCreateDialog
        key="medicine-create"
        open={open === "add"}
        onOpenChange={(isOpen) => {
          if (!isOpen) setOpen(null);
          else setOpen("add");
        }}
      />

      {currentMedicine && (
        <>
          <MedicineUpdateDialog
            key={`medicine-update-${currentMedicine.id}`}
            open={open === "edit"}
            onOpenChange={(isOpen) => {
              if (!isOpen) {
                setOpen(null);
                setTimeout(() => {
                  setCurrentMedicine(null);
                }, 300);
              }
            }}
            currentMedicine={currentMedicine}
          />

          <MedicineDeleteDialog
            key={`medicine-delete-${currentMedicine.id}`}
            open={open === "delete"}
            onOpenChange={(isOpen) => {
              if (!isOpen) {
                setOpen(null);
                setTimeout(() => {
                  setCurrentMedicine(null);
                }, 300);
              }
            }}
            currentMedicine={currentMedicine}
          />

          <MedicineUploadImage
            key={`medicine-upload-image-${currentMedicine.id}`}
            open={open === "thumbnail"}
            onOpenChange={(isOpen) => {
              if (!isOpen) {
                setOpen(null);
                setTimeout(() => {
                  setCurrentMedicine(null);
                }, 300);
              }
            }}
            medicineId={currentMedicine.id}
          />

          <MedicineBulkDeleteDialog
            open={open === "bulk-delete"}
            onOpenChange={(isOpen) => {
              if (!isOpen) {
                setOpen(null);
                setTimeout(() => {
                  setSelectedMedicinesForBulkDelete([]);
                }, 300);
              }
            }}
            selectedMedicines={selectedMedicinesForBulkDelete}
            onSuccess={() => {
              setSelectedMedicinesForBulkDelete([]);
              onBulkDeleteSuccess?.();
            }}
          />
        </>
      )}
    </>
  );
}