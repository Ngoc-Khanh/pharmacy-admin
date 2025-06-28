import { userAtom, fetchUserProfileAtom } from "@/atoms";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AccountRole } from "@/data/enum";
import { UpdateSettingAccountDto } from "@/data/dto";
import { accountSettingSchema, AccountSettingSchema } from "@/data/schemas";
import { SettingAPI } from "@/services/v1";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useAtomValue, useSetAtom } from "jotai";
import { Loader2, Shield, User, Crown, Mail, UserCheck, Settings, Info } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Helper function để hiển thị role badge
const getRoleBadge = (role: AccountRole) => {
  switch (role) {
    case AccountRole.ADMIN:
      return (
        <Badge variant="destructive" className="gap-1">
          <Crown className="h-3 w-3" />
          Quản trị viên
        </Badge>
      );
    case AccountRole.PHARMACIST:
      return (
        <Badge variant="secondary" className="gap-1">
          <Shield className="h-3 w-3" />
          Dược sĩ
        </Badge>
      );
    case AccountRole.CUSTOMER:
      return (
        <Badge variant="outline" className="gap-1">
          <User className="h-3 w-3" />
          Khách hàng
        </Badge>
      );
    default:
      return (
        <Badge variant="outline">
          Không xác định
        </Badge>
      );
  }
};

// Helper function để lấy mô tả role
const getRoleDescription = (role: AccountRole) => {
  switch (role) {
    case AccountRole.ADMIN:
      return "Có quyền truy cập và quản lý toàn bộ hệ thống";
    case AccountRole.PHARMACIST:
      return "Có quyền quản lý thuốc và xử lý đơn hàng";
    case AccountRole.CUSTOMER:
      return "Có quyền xem và mua sản phẩm";
    default:
      return "Vai trò không xác định";
  }
};

export default function AccountSettingPage() {
  const user = useAtomValue(userAtom);
  const fetchUserProfile = useSetAtom(fetchUserProfileAtom);
  const [hasChanges, setHasChanges] = useState(false);
  
  const form = useForm<AccountSettingSchema>({
    resolver: zodResolver(accountSettingSchema),
    defaultValues: {
      username: user?.username || "",
      email: user?.email || "",
    },
  });

  // Reset form khi user data thay đổi
  useEffect(() => {
    if (user) {
      form.reset({
        username: user.username,
        email: user.email,
      });
    }
  }, [user, form]);

  // Watch form values để detect changes
  const watchedValues = form.watch();
  
  useEffect(() => {
    const originalData = {
      username: user?.username || "",
      email: user?.email || "",
    };
    
    const hasFormChanges = 
      watchedValues.username !== originalData.username ||
      watchedValues.email !== originalData.email;
      
    setHasChanges(hasFormChanges);
  }, [watchedValues, user]);

  const { mutate: updateAccount, isPending } = useMutation({
    mutationFn: (data: UpdateSettingAccountDto) => SettingAPI.UpdateAccount(data),
    onSuccess: async () => {
      toast.success("Cập nhật thông tin tài khoản thành công");
      // Refresh user data để lấy thông tin mới nhất
      await fetchUserProfile();
      setHasChanges(false);
    },
    onError: () => {
      toast.error("Cập nhật thông tin tài khoản thất bại");
    },
  });

  const onSubmit = (data: AccountSettingSchema) => {
    // Chỉ gửi những field đã thay đổi
    const changedData: Partial<UpdateSettingAccountDto> = {};
    
    if (data.username !== user?.username) {
      changedData.username = data.username;
    }
    
    if (data.email !== user?.email) {
      changedData.email = data.email;
    }

    // Kiểm tra xem có thay đổi nào không
    if (Object.keys(changedData).length === 0) {
      toast.info("Không có thay đổi nào để cập nhật");
      return;
    }

    updateAccount(changedData as UpdateSettingAccountDto);
  };

  const handleResetForm = () => {
    form.reset({
      username: user?.username || "",
      email: user?.email || "",
    });
  };
  
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <div className="flex items-center gap-2">
          <Settings className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Tài khoản</h1>
          <Badge variant="outline">Thông tin cơ bản</Badge>
        </div>
        <p className="text-muted-foreground">
          Quản lý thông tin đăng nhập và vai trò tài khoản của bạn
        </p>
      </motion.div>

      {/* Role Information Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 border-emerald-200 dark:border-emerald-800">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-emerald-100 dark:bg-emerald-900/50 p-3">
                <UserCheck className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-emerald-900 dark:text-emerald-100">
                    Vai trò tài khoản
                  </h3>
                  {user?.role && getRoleBadge(user.role)}
                </div>
                <p className="text-sm text-emerald-700 dark:text-emerald-300">
                  {user?.role && getRoleDescription(user.role)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Account Information Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Thông tin đăng nhập
            </CardTitle>
            <CardDescription>
              Cập nhật tên đăng nhập và địa chỉ email của bạn
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Tên đăng nhập
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Nhập tên đăng nhập" 
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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Địa chỉ Email
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="email"
                          placeholder="Nhập địa chỉ email" 
                          {...field} 
                          disabled={isPending}
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
                  className="flex items-center gap-3 pt-4 border-t"
                >
                  <Button 
                    type="submit" 
                    disabled={isPending || !hasChanges}
                    size="lg"
                    className="min-w-[140px]"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang cập nhật...
                      </>
                    ) : (
                      hasChanges ? "Cập nhật tài khoản" : "Không có thay đổi"
                    )}
                  </Button>
                  
                  {hasChanges && (
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

      {/* Information Card */}
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
                <h3 className="font-medium">Lưu ý quan trọng</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Tên đăng nhập phải là duy nhất trong hệ thống</li>
                  <li>• Email sẽ được sử dụng để khôi phục mật khẩu</li>
                  <li>• Thay đổi thông tin có thể ảnh hưởng đến việc đăng nhập</li>
                  <li>• Liên hệ quản trị viên nếu cần thay đổi vai trò</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}