import { userAtom, fetchUserProfileAtom } from "@/atoms";
import SettingContentSection from "@/components/layouts/setting/content-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Loader2, Shield, User, Crown } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useEffect } from "react";

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

export default function AccountSettingPage() {
  const user = useAtomValue(userAtom);
  const fetchUserProfile = useSetAtom(fetchUserProfileAtom);
  
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

  const { mutate: updateAccount, isPending } = useMutation({
    mutationFn: (data: UpdateSettingAccountDto) => SettingAPI.UpdateAccount(data),
    onSuccess: async () => {
      toast.success("Cập nhật thông tin tài khoản thành công");
      // Refresh user data để lấy thông tin mới nhất
      await fetchUserProfile();
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
  
  return (
    <SettingContentSection
      title="Cập nhật tài khoản"
      desc="Cập nhật thông tin tài khoản của bạn"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Hiển thị role */}
          <div className="rounded-lg border p-4 bg-muted/50">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium">Vai trò tài khoản</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Vai trò hiện tại của bạn trong hệ thống
                </p>
              </div>
              {user?.role && getRoleBadge(user.role)}
            </div>
          </div>

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên đăng nhập</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Nhập tên đăng nhập" 
                    {...field} 
                    disabled={isPending}
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
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input 
                    type="email"
                    placeholder="Nhập địa chỉ email" 
                    {...field} 
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            disabled={isPending}
            className="w-full sm:w-auto"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? "Đang cập nhật..." : "Cập nhật tài khoản"}
          </Button>
        </form>
      </Form>
    </SettingContentSection>
  );
}