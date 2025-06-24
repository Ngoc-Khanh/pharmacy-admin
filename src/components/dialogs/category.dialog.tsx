import { useCategoryDialog } from "@/atoms";
import { CategoryActionDialog, CategoryChangeStatusDialog, CategoryDeleteDialog } from "@/components/dialogs/category";

export default function CategoryDialog() {
  const { open, setOpen, currentCategory, setCurrentCategory } = useCategoryDialog();

  return (
    <>
      <CategoryActionDialog
        key="category-add"
        open={open === "add"}
        onOpenChange={(isOpen) => {
          if (!isOpen) setOpen(null);
          else setOpen("add");
        }}
      />

      {currentCategory && (
        <>
          <CategoryActionDialog
            key={`category-edit-${currentCategory.id}`}
            open={open === "edit"}
            onOpenChange={(isOpen) => {
              if (!isOpen) {
                setOpen(null);
                setTimeout(() => {
                  setCurrentCategory(null);
                }, 300);
              }
            }}
            currentCategory={currentCategory}
          />

          <CategoryChangeStatusDialog
            key={`category-status-${currentCategory.id}`}
            open={open === "status"}
            onOpenChange={(isOpen) => {
              if (!isOpen) {
                setOpen(null);
                setTimeout(() => {
                  setCurrentCategory(null);
                }, 300);
              }
            }}
            currentCategory={currentCategory}
            active={!currentCategory.isActive}
          />

          <CategoryDeleteDialog
            key={`category-delete-${currentCategory.id}`}
            open={open === "delete"}
            onOpenChange={(isOpen) => {
              if (!isOpen) {
                setOpen(null);
                setTimeout(() => {
                  setCurrentCategory(null);
                }, 300);
              }
            }}
            currentCategory={currentCategory}
          />
        </>
      )}
    </>
  )
}