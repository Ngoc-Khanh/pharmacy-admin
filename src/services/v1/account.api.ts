import { AddAcccountDto, UpdateAccountDto } from "@/data/dto";
import { ListParams, UserResponse, UserStatsResponse } from "@/data/interfaces";
import { Paginated, SRO } from "@/data/sro";
import { apiDelete, apiGet, apiPatch, apiPost } from "@/services/api";

export const AccountAPI = {
  async AccountList(params?: ListParams) {
    const searchParams = new URLSearchParams();
    if (params?.s) searchParams.append('s', params.s);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('per_page', params.limit.toString());
    const queryString = searchParams.toString();
    const url = queryString ? `v1/admin/users?${queryString}&sort_order=asc` : "v1/admin/users?sort_order=asc";
    const res = await apiGet<SRO<Paginated<UserResponse>>>(url);
    return res.data.data;
  },

  async AccountStats() {
    const res = await apiGet<SRO<UserStatsResponse>>("v1/admin/users/statistics");
    return res.data.data;
  },

  async AccountAdd(data: AddAcccountDto) {
    const res = await apiPost<AddAcccountDto, SRO<UserResponse>>("v1/admin/users/add", data);
    return res.data.data;
  },

  async AccountUpdate(accountId: string, data: UpdateAccountDto) {
    const res = await apiPatch<UpdateAccountDto, SRO<UserResponse>>(`v1/admin/users/update/${accountId}`, data);
    return res.data.data;
  },

  async AccountDelete(accountId: string) {
    const res = await apiDelete<SRO<UserResponse>>(`/v1/admin/users/delete/${accountId}`);
    return res.data.data;
  },

  async AccountBulkDelete(accountIds: string[]) {
    const res = await apiDelete<SRO<{deletedCount: number}>>(`/v1/admin/users/bulk-delete?ids=${accountIds.join(',')}`);
    return res.data.data;
  },
};
