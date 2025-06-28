export type UpdateSettingProfileDto = {
  firstname: string;
  lastname: string;
  phone: string;
};

export type UpdateSettingAccountDto = {
  username: string;
  email: string;
};

export type UpdateSettingPasswordDto = {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirmation: string;
};
