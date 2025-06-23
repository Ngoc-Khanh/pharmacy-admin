import { UserResponse } from "@/data/interfaces";
import { Paginated, SRO } from "@/data/sro";
import { apiGet } from "@/services/api";

export const AccountAPI = {
  async AccountList() {
    const res = await apiGet<SRO<Paginated<UserResponse>>>("v1/admin/users");
    return res.data.data;
  },
};
