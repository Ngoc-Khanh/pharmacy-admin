import { useMedicineDialog } from "@/atoms";
import { MedicineCreateDialog, MedicineUploadImage } from "@/components/dialogs/medicine";
import { MedicineDeleteDialog } from "./medicine/medicine.delete-dialog";

export default function MedicineDialog() {
  const { open, setOpen, currentMedicine, setCurrentMedicine } = useMedicineDialog();

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
        </>
      )}
    </>
  );
}