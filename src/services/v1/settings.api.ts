import { UpdateProfileDto } from "@/data/dto"
import { UserResponse } from "@/data/interfaces"
import { SRO } from "@/data/sro"
import { apiPatch, apiPost } from "@/services/api"

export const SettingAPI = {
  async UpdateProfile(data: UpdateProfileDto) {
    const res = await apiPatch<UpdateProfileDto, SRO<UserResponse>>("v1/admin/settings/profile-update", data)
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