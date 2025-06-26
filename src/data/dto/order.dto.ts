import { OrderStatus } from "@/data/enum";

export type OrderAdminChangeStatusDto = {
  status: OrderStatus;
}