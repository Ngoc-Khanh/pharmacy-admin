import { AddAcccountDto, UpdateAccountDto } from "@/data/dto";
import { UserResponse } from "@/data/interfaces";
import { Paginated, SRO } from "@/data/sro";
import { apiDelete, apiGet, apiPatch, apiPost } from "@/services/api";

interface AccountListParams {
  s?: string; // search parameter
  page?: number;
  limit?: number;
}

export const AccountAPI = {
  async AccountList(params?: AccountListParams) {
    const searchParams = new URLSearchParams();
    if (params?.s) searchParams.append('s', params.s);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    const queryString = searchParams.toString();
    const url = queryString ? `v1/admin/users?${queryString}` : "v1/admin/users";
    const res = await apiGet<SRO<Paginated<UserResponse>>>(url);
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
};
