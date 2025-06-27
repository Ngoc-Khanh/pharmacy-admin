import { useMedicineDialog } from "@/atoms";
import { MedicineCreateDialog } from "@/components/dialogs/medicine";

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
    </>
  );
}