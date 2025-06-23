import { AddAcccountDto, UpdateAccountDto } from "@/data/dto";
import { UserResponse } from "@/data/interfaces";
import { Paginated, SRO } from "@/data/sro";
import { apiDelete, apiGet, apiPatch, apiPost } from "@/services/api";

export const AccountAPI = {
  async AccountList() {
    const res = await apiGet<SRO<Paginated<UserResponse>>>("v1/admin/users");
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
