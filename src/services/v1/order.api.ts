import { OrderAdminChangeStatusDto } from "@/data/dto";
import { ListParams, OrderDetailsResponse, OrderResponse } from "@/data/interfaces";
import { Paginated, SRO } from "@/data/sro";
import { apiDelete, apiGet, apiPatch } from "@/services/api";

export const OrderAPI = {
  async OrderList(params?: ListParams) {
    const searchParams = new URLSearchParams();
    if (params?.s) searchParams.append('s', params.s);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('per_page', params.limit.toString());
    const queryString = searchParams.toString();
    const url = queryString ? `v1/admin/orders?${queryString}&sort_order=asc` : "v1/admin/orders?sort_order=asc";
    const res = await apiGet<SRO<Paginated<OrderResponse>>>(url);
    return res.data.data;
  },

  async OrderDetail(orderId: string) {
    const res = await apiGet<SRO<OrderDetailsResponse>>(`/v1/admin/orders/${orderId}/details`);
    return res.data.data;
  },

  async OrderChangeStatus(data: OrderAdminChangeStatusDto, orderId: string) {
    const res = await apiPatch<OrderAdminChangeStatusDto, SRO<OrderResponse>>(`/v1/admin/orders/${orderId}/status`, data);
    return res.data.data;
  },

  async OrderDelete(orderId: string) {
    const res = await apiDelete<SRO<OrderResponse>>(`/v1/admin/orders/${orderId}/delete`);
    return res.data.data;
  }
};
