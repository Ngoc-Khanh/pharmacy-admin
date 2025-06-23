import { updateTokenAtom, userAtom } from "@/atoms";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { routeNames, routes, siteConfig } from "@/config";
import { CredentialForm, credentialSchema } from "@/data/schemas";
import { cn } from "@/lib/utils";
import { AuthAPI } from "@/services/v1";
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useSetAtom } from "jotai";
import { Eye, EyeOff, Lock, ShieldCheck, User } from "lucide-react";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function LoginPage({ className, ...props }: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const setUser = useSetAtom(userAtom)
  const updateToken = useSetAtom(updateTokenAtom)
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<CredentialForm>({
    resolver: zodResolver(credentialSchema),
    defaultValues: {
      account: import.meta.env.DEV ? "admin@pharmacity.com" : "",
      password: import.meta.env.DEV ? "Admin@123" : "",
    }
  })

  const { mutate: login, isPending } = useMutation({
    mutationFn: AuthAPI.fetchLogin,
    onSuccess: (data) => {
      toast.success("Đăng nhập thành công", {
        description: "Chào mừng bạn đến với hệ thống quản lý bán hàng",
      });
      updateToken(data.accessToken);
      setUser(data.user);
      navigate(routes.admin.root);
    },
    onError: (error: AxiosError) => {
      const errorMessage = (error.response?.data as { message?: string })?.message || "Đăng nhập thất bại";
      toast.error(errorMessage);
    }
  })

  const onSubmit = async (data: CredentialForm) => {
    login(data);
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Helmet>
        <title>{routeNames[routes.auth.login]} | {siteConfig.name}</title>
      </Helmet>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse" />
              <div className="relative flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg">
                <ShieldCheck className="size-8 text-white" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 via-green-300 to-teal-400 bg-clip-text text-transparent">
                Đăng nhập hệ thống
              </h1>
              <p className="text-gray-300 text-sm">
                Chào mừng bạn đến với {siteConfig.name}
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-5">
            <FormField
              control={form.control}
              name="account"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-semibold text-gray-200">
                    Tài khoản
                  </FormLabel>
                  <FormControl>
                    <div className="relative group">
                      <User className="w-4 h-4 absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-400 transition-all duration-200 group-focus-within:text-emerald-300" />
                      <Input
                        {...field}
                        placeholder="Nhập email hoặc tên đăng nhập"
                        tabIndex={1}
                        className="bg-white/5 backdrop-blur-sm border-gray-500/30 text-white placeholder:text-gray-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/30 rounded-lg pl-12 pr-4 py-3 text-sm transition-all duration-300 hover:bg-white/10 hover:border-emerald-400/50"
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs text-red-300" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-semibold text-gray-200">
                    Mật khẩu
                  </FormLabel>
                  <FormControl>
                    <div className="relative group">
                      <Lock className="w-4 h-4 absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-400 transition-all duration-200 group-focus-within:text-emerald-300" />
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        placeholder="Nhập mật khẩu của bạn"
                        tabIndex={2}
                        className="bg-white/5 backdrop-blur-sm border-gray-500/30 text-white placeholder:text-gray-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/30 rounded-lg pl-12 pr-12 py-3 text-sm transition-all duration-300 hover:bg-white/10 hover:border-emerald-400/50"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-emerald-400 hover:text-emerald-300 transition-all duration-200"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs text-red-300" />
                </FormItem>
              )}
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 hover:from-emerald-500 hover:via-green-500 hover:to-emerald-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-emerald-500/25 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none border border-emerald-500/20"
          >
            {isPending ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Đang xác thực...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <span>Đăng nhập</span>
                <ShieldCheck className="w-4 h-4" />
              </div>
            )}
          </Button>

          {/* Bottom Links */}
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
              <span>Kết nối bảo mật</span>
            </div>
            <a 
              href="https://pharmacy.ngockhanh.me" 
              target="_blank" 
              className="text-emerald-400 hover:text-emerald-300 text-sm underline underline-offset-2 transition-colors"
            >
              Trở về Pharmacity Store
            </a>
          </div>
        </form>
      </Form>
    </div>
  );
}