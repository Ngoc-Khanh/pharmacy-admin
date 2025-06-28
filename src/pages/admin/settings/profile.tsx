import { userAtom } from "@/atoms";
import { ImageCropDialog } from "@/components/custom/image-crop-dialog";
import { PhoneInput } from "@/components/custom/phone-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { Camera, Loader2, Save, User, Upload, Image, UserCircle, Phone, FileText, Info } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { motion } from "framer-motion";

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
    <div className="space-y-8">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <div className="flex items-center gap-2">
          <UserCircle className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Hồ sơ cá nhân</h1>
          <Badge variant="secondary">Thông tin chi tiết</Badge>
        </div>
        <p className="text-muted-foreground">
          Quản lý thông tin cá nhân và ảnh đại diện của bạn
        </p>
      </motion.div>

      {/* Avatar Upload Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="h-5 w-5" />
              Ảnh đại diện
            </CardTitle>
            <CardDescription>
              Tải lên và chỉnh sửa ảnh đại diện của bạn
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-start gap-6">
              {/* Avatar Display & Upload */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative group">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-muted shadow-lg">
                    {currentAvatarUrl ? (
                      <img
                        src={currentAvatarUrl}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <User className="w-10 h-10 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Upload Overlay */}
                  <div className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer flex items-center justify-center">
                    {isUploadingAvatar ? (
                      <Loader2 className="w-6 h-6 animate-spin text-white" />
                    ) : (
                      <Camera className="w-6 h-6 text-white" />
                    )}
                  </div>

                  {/* Hidden Input */}
                  <input
                    {...avatarActions.getInputProps()}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-full"
                    disabled={isUploadingAvatar}
                  />
                </div>

                {/* Upload Button - Show when image is cropped */}
                {finalImageUrl && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <Button
                      type="button"
                      onClick={handleUpload}
                      disabled={isUploadingAvatar}
                      size="sm"
                      className="gap-2"
                    >
                      {isUploadingAvatar ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Đang tải...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" />
                          Tải lên
                        </>
                      )}
                    </Button>
                  </motion.div>
                )}
              </div>

              {/* Upload Info */}
              <div className="flex-1 space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Hướng dẫn tải ảnh</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span>Nhấp vào avatar để chọn ảnh</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span>Định dạng: JPEG, PNG, JPG</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span>Kích thước tối đa: 5MB</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span>Tỷ lệ khuyến nghị: 1:1 (vuông)</span>
                    </div>
                  </div>
                </div>

                {/* Error Messages */}
                {avatarState.errors.length > 0 && (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                    <p className="text-sm text-destructive font-medium">
                      {avatarState.errors[0]}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Image Crop Dialog */}
      <ImageCropDialog
        open={isCropDialogOpen}
        onOpenChange={closeCropDialog}
        imageUrl={avatarState.files[0]?.preview || null}
        zoom={zoom}
        onZoomChange={setZoom}
        onCropChange={handleCropChange}
        onApplyCrop={handleApplyCrop}
        title="Chỉnh sửa ảnh đại diện"
        description="Điều chỉnh vùng ảnh mong muốn và zoom để có kết quả tốt nhất"
        applyButtonText="Áp dụng"
      />

      {/* Profile Information Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Thông tin cá nhân
            </CardTitle>
            <CardDescription>
              Cập nhật thông tin cá nhân của bạn
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="firstname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Tên <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nhập tên của bạn"
                            {...field}
                            disabled={isPending}
                            className="h-11"
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
                        <FormLabel className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Họ <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nhập họ của bạn"
                            {...field}
                            disabled={isPending}
                            className="h-11"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Phone Field */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Số điện thoại <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <PhoneInput
                          placeholder="Nhập số điện thoại"
                          {...field}
                          disabled={isPending}
                          defaultCountry="VN"
                          international={true}
                          className="h-11"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Actions */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center gap-3 pt-6 border-t"
                >
                  <Button 
                    type="submit" 
                    disabled={isPending || !hasFormChanges}
                    size="lg"
                    className="min-w-[140px]"
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
                    >
                      Đặt lại
                    </Button>
                  )}
                </motion.div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tips Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-2">
                <Info className="h-4 w-4 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Mẹo hồ sơ</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Ảnh đại diện rõ nét giúp đồng nghiệp dễ nhận diện</li>
                  <li>• Thông tin chính xác giúp hệ thống hoạt động tốt hơn</li>
                  <li>• Số điện thoại được sử dụng cho thông báo quan trọng</li>
                  <li>• Thường xuyên cập nhật thông tin để đảm bảo chính xác</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}