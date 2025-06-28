import { UpdateSettingAccountDto, UpdateSettingProfileDto } from "@/data/dto"
import { UserResponse } from "@/data/interfaces"
import { SRO } from "@/data/sro"
import { apiPatch, apiPost } from "@/services/api"

export const SettingAPI = {
  async UpdateProfile(data: UpdateSettingProfileDto) {
    const res = await apiPatch<UpdateSettingProfileDto, SRO<UserResponse>>("v1/admin/settings/profile-update", data)
    return res.data.data;
  },
  
  async UpdateAccount(data: UpdateSettingAccountDto) {
    const res = await apiPatch<UpdateSettingAccountDto, SRO<UserResponse>>("v1/admin/settings/account-update", data)
    return res.data.data;
  },

  async UploadAvatar(file: File) {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const res = await apiPost<FormData, SRO<{ url: string }>>("v1/store/account/profile/upload-avatar", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data.data;
  }
}