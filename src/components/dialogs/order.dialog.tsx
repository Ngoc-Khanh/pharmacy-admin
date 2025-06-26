import { useOrderDialog } from "@/atoms/dialog.atom";
import { OrdersChangeStatusDialog, OrdersDeleteDialog, OrdersViewDetails } from "@/components/dialogs/order";
import { OrderStatus } from "@/data/enum";

export function OrderDialog() {
  const { open, setOpen, currentOrder, setCurrentOrder } = useOrderDialog();

  const handleOpenChange = (isOpen: boolean, type?: string) => {
    if (!isOpen) {
      setOpen(null);
      if (!type) {
        setTimeout(() => {
          setCurrentOrder(null);
        }, 300);
      }
    }
  };

  return (
    <>
      <OrdersDeleteDialog
        currentOrder={currentOrder || undefined}
        open={open === "delete"}
        onOpenChange={(isOpen) => handleOpenChange(isOpen, "delete")}
      />

      <OrdersViewDetails
        orderId={currentOrder?.id}
        open={open === "detail"}
        onOpenChange={(isOpen) => handleOpenChange(isOpen, "detail")}
      />

      <OrdersChangeStatusDialog
        currentOrder={currentOrder || undefined}
        open={open === "confirm"}
        onOpenChange={(isOpen) => handleOpenChange(isOpen, "confirm")}
        mode={OrderStatus.PROCESSING}
      />

      <OrdersChangeStatusDialog
        currentOrder={currentOrder || undefined}
        open={open === "complete"}
        onOpenChange={(isOpen) => handleOpenChange(isOpen, "complete")}
        mode={OrderStatus.COMPLETED}
      />

      <OrdersChangeStatusDialog
        currentOrder={currentOrder || undefined}
        open={open === "cancel"}
        onOpenChange={(isOpen) => handleOpenChange(isOpen, "cancel")}
        mode={OrderStatus.CANCELLED}
      />
    </>
  );
}