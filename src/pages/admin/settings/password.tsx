import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { routes, siteConfig } from "@/config";
import { UpdateSettingPasswordDto } from "@/data/dto";
import { passwordSettingSchema, PasswordSettingSchema } from "@/data/schemas";
import { SettingAPI } from "@/services/v1";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Eye, EyeOff, Lock, Shield, AlertTriangle, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

const passwordRequirements = [
  { id: "length", label: "Ít nhất 8 ký tự", regex: /.{8,}/ },
  { id: "lowercase", label: "Có chữ cái thường", regex: /[a-z]/ },
  { id: "uppercase", label: "Có chữ cái viết hoa", regex: /[A-Z]/ },
  { id: "number", label: "Có chữ số", regex: /[0-9]/ },
  { id: "special", label: "Có ký tự đặc biệt", regex: /[!@#$%^&*()_+{}[\]\]:;<>,.?~/-]/ },
];

export default function PasswordSettingPage() {
  const navigate = useNavigate();
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const form = useForm<PasswordSettingSchema>({
    resolver: zodResolver(passwordSettingSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      newPasswordConfirmation: "",
    },
  });
  
  const { mutate: updatePassword, isPending } = useMutation({
    mutationFn: (data: UpdateSettingPasswordDto) => SettingAPI.UpdatePassword(data),
    onSuccess: () => {
      toast.success("Cập nhật mật khẩu thành công");
      localStorage.removeItem(siteConfig.auth.jwt_key);
      navigate(routes.auth.login);
    },
    onError: () => {
      toast.error("Cập nhật mật khẩu thất bại");
    },
  });

  const onSubmit = (data: PasswordSettingSchema) => {
    updatePassword(data);
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const newPassword = form.watch("newPassword");
  const validateRequirement = (regex: RegExp) => regex.test(newPassword || "");

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Bảo mật</h1>
          <Badge variant="destructive">Quan trọng</Badge>
        </div>
        <p className="text-muted-foreground">
          Cập nhật mật khẩu để bảo vệ tài khoản của bạn
        </p>
      </motion.div>

      {/* Warning Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
              <div className="space-y-1">
                <h3 className="font-medium text-amber-800 dark:text-amber-200">
                  Lưu ý quan trọng
                </h3>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  Sau khi thay đổi mật khẩu, bạn sẽ được tự động đăng xuất và cần đăng nhập lại với mật khẩu mới.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Password Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Thay đổi mật khẩu
            </CardTitle>
            <CardDescription>
              Nhập mật khẩu hiện tại và mật khẩu mới để cập nhật
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Current Password */}
                <FormField
                  control={form.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mật khẩu hiện tại</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showPasswords.current ? "text" : "password"}
                            placeholder="Nhập mật khẩu hiện tại"
                            className="pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => togglePasswordVisibility('current')}
                          >
                            {showPasswords.current ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* New Password */}
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mật khẩu mới</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showPasswords.new ? "text" : "password"}
                            placeholder="Nhập mật khẩu mới"
                            className="pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => togglePasswordVisibility('new')}
                          >
                            {showPasswords.new ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                      
                      {/* Password Requirements */}
                      {newPassword && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="mt-3 space-y-2"
                        >
                          <p className="text-sm font-medium">Yêu cầu mật khẩu:</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {passwordRequirements.map((req) => {
                              const isValid = validateRequirement(req.regex);
                              return (
                                <motion.div
                                  key={req.id}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  className={cn(
                                    "flex items-center gap-2 text-sm",
                                    isValid ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"
                                  )}
                                >
                                  <CheckCircle 
                                    className={cn(
                                      "h-3 w-3",
                                      isValid ? "text-emerald-600" : "text-muted-foreground"
                                    )} 
                                  />
                                  {req.label}
                                </motion.div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </FormItem>
                  )}
                />

                {/* Confirm New Password */}
                <FormField
                  control={form.control}
                  name="newPasswordConfirmation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Xác nhận mật khẩu mới</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showPasswords.confirm ? "text" : "password"}
                            placeholder="Nhập lại mật khẩu mới"
                            className="pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => togglePasswordVisibility('confirm')}
                          >
                            {showPasswords.confirm ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex justify-end pt-4 border-t"
                >
                  <Button 
                    type="submit" 
                    size="lg"
                    className="min-w-[140px]"
                    disabled={isPending || !form.formState.isValid}
                  >
                    {isPending ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
                  </Button>
                </motion.div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Security Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-2">
                <Shield className="h-4 w-4 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Mẹo bảo mật</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Sử dụng mật khẩu duy nhất cho mỗi tài khoản</li>
                  <li>• Không chia sẻ mật khẩu với bất kỳ ai</li>
                  <li>• Thay đổi mật khẩu định kỳ (3-6 tháng/lần)</li>
                  <li>• Sử dụng trình quản lý mật khẩu để lưu trữ an toàn</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}