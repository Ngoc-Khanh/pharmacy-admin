import { userAtom } from "@/atoms";
import { ImageCropDialog } from "@/components/custom/image-crop-dialog";
import { PhoneInput } from "@/components/custom/phone-input";
import SettingContentSection from "@/components/layouts/setting/content-section";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { siteConfig } from "@/config";
import { profileSettingSchema, ProfileSettingSchema } from "@/data/schemas";
import { useFileUpload } from "@/hooks/use-file-upload";
import { useImageCrop } from "@/hooks/use-image-crop";
import { useUpload } from "@/hooks/use-upload";
import { AuthAPI, SettingAPI } from "@/services/v1";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useAtomValue, useSetAtom } from "jotai";
import { Camera, Loader2, Save, User } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function ProfileSettingPage() {
  const user = useAtomValue(userAtom)
  const setUser = useSetAtom(userAtom)
  
  const form = useForm<ProfileSettingSchema>({
    resolver: zodResolver(profileSettingSchema),
    defaultValues: {
      firstname: user?.firstname || "",
      lastname: user?.lastname || "",
      phone: user?.phone || "",
    },
  });

  // State để track xem có thay đổi không
  const [hasFormChanges, setHasFormChanges] = React.useState(false);

  // Upload avatar state
  const [avatarState, avatarActions] = useFileUpload({
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
    accept: "image/jpeg,image/png,image/jpg",
    multiple: false,
  });

  // Image crop state
  const {
    zoom,
    isCropDialogOpen,
    finalImageUrl,
    handleCropChange,
    setZoom,
    openCropDialog,
    closeCropDialog,
    applyCrop,
    removeFinalImage,
    reset: resetCrop,
    getCroppedBlob
  } = useImageCrop({ outputWidth: 200, outputHeight: 200 });

  const { mutate: updateProfile, isPending } = useMutation({
    mutationFn: SettingAPI.UpdateProfile,
    onSuccess: (updatedUser) => {
      toast.success("Cập nhật thông tin hồ sơ cá nhân thành công");
      
      // Cập nhật user atom với dữ liệu mới
      setUser(updatedUser);
      
      // Reset form với dữ liệu mới
      form.reset({
        firstname: updatedUser.firstname || "",
        lastname: updatedUser.lastname || "",
        phone: updatedUser.phone || "",
      });
    },
    onError: () => {
      toast.error("Cập nhật thông tin hồ sơ cá nhân thất bại");
    },
  });

  const { upload, isUploading: isUploadingAvatar } = useUpload();

  // Handle image upload and crop flow
  const handleUpload = React.useCallback(async () => {
    if (!finalImageUrl) {
      toast.error("Vui lòng chọn và crop ảnh trước khi upload");
      return;
    }

    try {
      // Get cropped blob
      const croppedBlob = await getCroppedBlob();
      if (!croppedBlob) {
        toast.error("Không thể xử lý ảnh đã crop");
        return;
      }

      const uploadUrl = `${siteConfig.backend.base_api_url}/v1/store/account/profile/upload-avatar`;

      await upload(croppedBlob, {
        url: uploadUrl,
        fieldName: 'profile_image',
        fileName: 'profile-avatar.jpg',
        invalidateQueries: [
          ["user"]
        ],
        onSuccess: async () => {
          toast.success("Cập nhật ảnh đại diện thành công!");
          
          // Refresh user data to get updated avatar URL immediately
          try {
            const updatedUser = await AuthAPI.fetchUserInfo();
            setUser(updatedUser);
          } catch (error) {
            console.error("Error refreshing user data:", error);
          }
          
          removeFinalImage();
          resetCrop();
          avatarActions.clearFiles();
        },
        onError: (error) => {
          toast.error(error.message || "Có lỗi xảy ra khi upload ảnh đại diện");
        }
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Có lỗi xảy ra khi upload ảnh đại diện");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalImageUrl, getCroppedBlob, upload, removeFinalImage, resetCrop, avatarActions]);

  // Handle crop apply
  const handleApplyCrop = React.useCallback(async () => {
    if (avatarState.files.length > 0) {
      const previewUrl = avatarState.files[0].preview;
      if (previewUrl) {
        try {
          await applyCrop(previewUrl);
          toast.success("Crop ảnh thành công!");
        } catch {
          toast.error("Lỗi khi crop ảnh");
        }
      }
    }
  }, [avatarState.files, applyCrop]);

  // Open crop dialog when file is selected
  React.useEffect(() => {
    if (avatarState.files.length > 0) {
      openCropDialog();
    }
  }, [avatarState.files, openCropDialog]);

  // Helper function để so sánh và lấy các field đã thay đổi
  const getChangedFields = React.useCallback((formData: ProfileSettingSchema) => {
    const originalData = {
      firstname: user?.firstname || "",
      lastname: user?.lastname || "",
      phone: user?.phone || "",
    };

    const changedFields: Partial<ProfileSettingSchema> = {};
    let hasChanges = false;

    // So sánh từng field và chỉ thêm vào nếu có thay đổi
    Object.keys(formData).forEach((key) => {
      const fieldKey = key as keyof ProfileSettingSchema;
      if (formData[fieldKey] !== originalData[fieldKey]) {
        changedFields[fieldKey] = formData[fieldKey];
        hasChanges = true;
      }
    });

    return { changedFields, hasChanges };
  }, [user]);

  // Watch form values để detect changes
  const watchedValues = form.watch();
  
  React.useEffect(() => {
    const { hasChanges } = getChangedFields(watchedValues);
    setHasFormChanges(hasChanges);
  }, [watchedValues, getChangedFields]);

  const onSubmit = (data: ProfileSettingSchema) => {
    const { changedFields, hasChanges } = getChangedFields(data);

    if (!hasChanges) {
      toast.info("Không có thay đổi nào để cập nhật");
      return;
    }

    updateProfile(changedFields as ProfileSettingSchema);
  };

  // Helper function để reset form về giá trị gốc
  const handleResetForm = React.useCallback(() => {
    form.reset({
      firstname: user?.firstname || "",
      lastname: user?.lastname || "",
      phone: user?.phone || "",
    });
  }, [form, user]);

  const currentAvatarUrl = finalImageUrl || avatarState.files[0]?.preview || user?.profileImage.url || null;
  
  return (
    <SettingContentSection
      title="Hồ sơ cá nhân"
      desc="Cập nhật thông tin hồ sơ cá nhân của bạn"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Avatar Upload Section */}
          <div className="flex items-start gap-4">
            <div className="flex flex-col items-start space-y-2">
              <div>
                <h3 className="text-base font-medium text-black dark:text-white">
                  Ảnh đại diện
                </h3>
              </div>

              {/* Avatar Display & Upload */}
              <div className="relative group">
                <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-black dark:border-white">
                  {currentAvatarUrl ? (
                    <img
                      src={currentAvatarUrl}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-white dark:bg-black">
                      <User className="w-8 h-8 text-black dark:text-white" />
                    </div>
                  )}
                </div>

                {/* Upload Overlay */}
                <div className="absolute inset-0 rounded-full bg-black/70 dark:bg-white/70 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center">
                  {isUploadingAvatar ? (
                    <Loader2 className="w-5 h-5 animate-spin text-white dark:text-black" />
                  ) : (
                    <Camera className="w-5 h-5 text-white dark:text-black" />
                  )}
                </div>

                {/* Hidden Input */}
                <input
                  {...avatarActions.getInputProps()}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-full"
                  disabled={isUploadingAvatar}
                />
              </div>

              {/* Error Messages */}
              {avatarState.errors.length > 0 && (
                <div className="text-xs text-black dark:text-white">
                  {avatarState.errors[0]}
                </div>
              )}
            </div>

            {/* Upload Info */}
            <div className="flex flex-col space-y-3 mt-6">
              <p className="text-sm text-black dark:text-white font-medium">
                Nhấp vào avatar để tải ảnh lên
              </p>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                <p>• Định dạng: JPEG, PNG, JPG</p>
                <p>• Kích thước tối đa: 5MB</p>
                <p>• Tỷ lệ khuyến nghị: 1:1 (vuông)</p>
              </div>
              
              {/* Upload Button - Show when image is cropped */}
              {finalImageUrl && (
                <Button
                  type="button"
                  onClick={handleUpload}
                  disabled={isUploadingAvatar}
                  size="sm"
                  className="w-fit bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                >
                  {isUploadingAvatar ? (
                    <>
                      <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                      Đang tải...
                    </>
                  ) : (
                    "Tải lên"
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Image Crop Dialog */}
          <ImageCropDialog
            open={isCropDialogOpen}
            onOpenChange={closeCropDialog}
            imageUrl={avatarState.files[0]?.preview || null}
            zoom={zoom}
            onZoomChange={setZoom}
            onCropChange={handleCropChange}
            onApplyCrop={handleApplyCrop}
            title="Crop ảnh đại diện"
            description="Điều chỉnh vùng ảnh mong muốn"
            applyButtonText="Áp dụng"
          />

          {/* Form Fields */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Tên <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập tên của bạn"
                        {...field}
                        disabled={isPending}
                        className="h-10"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Họ <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập họ của bạn"
                        {...field}
                        disabled={isPending}
                        className="h-10"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Số điện thoại <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <PhoneInput
                      placeholder="Nhập số điện thoại"
                      {...field}
                      disabled={isPending}
                      defaultCountry="VN"
                      international={true}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Submit Actions */}
          <div className="flex items-center gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button 
              type="submit" 
              disabled={isPending || !hasFormChanges}
              className="min-w-[140px] bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                                    {hasFormChanges ? "Lưu thay đổi" : "Không có thay đổi"}
                </>
              )}
            </Button>
            
            {hasFormChanges && (
              <Button
                type="button"
                variant="outline"
                onClick={handleResetForm}
                disabled={isPending}
                className="hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <User className="mr-2 h-4 w-4" />
                Đặt lại
              </Button>
            )}
            </div>
        </form>
      </Form>
    </SettingContentSection>
  );
}