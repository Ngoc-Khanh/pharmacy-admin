import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AccountRole, AccountStatus } from "@/data/enum";
import { AccountSchema } from "@/data/schemas";
import { Eye, EyeOff, RefreshCw, ShieldCheck } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface Props {
  form: UseFormReturn<AccountSchema>
  isEdit: boolean
  showPassword: boolean
  setShowPassword: (showPassword: boolean) => void
  showPasswordConfirmation: boolean
  setShowPasswordConfirmation: (showPasswordConfirmation: boolean) => void
  generateRandomPassword: () => void
}

export function AccountPermissionForm({ form, isEdit, showPassword, setShowPassword, showPasswordConfirmation, setShowPasswordConfirmation, generateRandomPassword }: Props) {
  return (
    <div className="rounded-lg border border-border/50 bg-card/40 p-5 backdrop-blur-sm transition-all duration-300">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-6 w-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
          <ShieldCheck className="h-3 w-3 text-purple-600 dark:text-purple-400" />
        </div>
        <h3 className="font-medium text-purple-600 dark:text-purple-400">Phân quyền & Mật khẩu</h3>
      </div>

      <div className="space-y-4">
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-medium">
                Vai trò <span className="text-red-500">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="transition-all border-input/50 focus:border-purple-500/50">
                    <SelectValue placeholder="Chọn vai trò" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={AccountRole.ADMIN}>
                    <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-300">
                      Quản trị viên
                    </Badge>
                  </SelectItem>
                  <SelectItem value={AccountRole.PHARMACIST}>
                    <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
                      Dược sĩ
                    </Badge>
                  </SelectItem>
                  <SelectItem value={AccountRole.CUSTOMER}>
                    <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-300">
                      Khách hàng
                    </Badge>
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-sm font-medium">Trạng thái</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-1 gap-2"
                >
                  <div className="flex items-center space-x-3 rounded-lg border p-3 hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value={AccountStatus.ACTIVE} id="active" />
                    <label htmlFor="active" className="flex items-center gap-2 cursor-pointer flex-1">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span className="text-sm font-medium">Hoạt động</span>
                    </label>
                  </div>
                  <div className="flex items-center space-x-3 rounded-lg border p-3 hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value={AccountStatus.SUSPENDED} id="suspended" />
                    <label htmlFor="suspended" className="flex items-center gap-2 cursor-pointer flex-1">
                      <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                      <span className="text-sm font-medium">Tạm dừng</span>
                    </label>
                  </div>
                  <div className="flex items-center space-x-3 rounded-lg border p-3 hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value={AccountStatus.PENDING} id="pending" />
                    <label htmlFor="pending" className="flex items-center gap-2 cursor-pointer flex-1">
                      <div className="h-2 w-2 rounded-full bg-red-500"></div>
                      <span className="text-sm font-medium">Đang chờ</span>
                    </label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="border-t pt-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium">
                  {isEdit ? "Mật khẩu mới" : "Mật khẩu"} <span className="text-red-500">*</span>
                  {isEdit && <span className="text-xs text-muted-foreground ml-1">(Tùy chọn)</span>}
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      className="pr-10 transition-all border-input/50 focus:border-purple-500/50"
                      placeholder={isEdit ? "Để trống nếu không thay đổi" : "Nhập mật khẩu"}
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
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

          <FormField
            control={form.control}
            name="passwordConfirmation"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium">
                  Xác nhận mật khẩu <span className="text-red-500">*</span>
                  {isEdit && <span className="text-xs text-muted-foreground ml-1">(Tùy chọn)</span>}
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPasswordConfirmation ? "text" : "password"}
                      className="pr-10 transition-all border-input/50 focus:border-purple-500/50"
                      placeholder={isEdit ? "Để trống nếu không thay đổi" : "Nhập lại mật khẩu"}
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
                      onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                    >
                      {showPasswordConfirmation ? (
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

          {!isEdit && (
            <Button
              type="button"
              onClick={generateRandomPassword}
              className="w-full mt-3 bg-purple-50 dark:bg-purple-950/30 hover:bg-purple-100 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800"
              variant="outline"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Tạo mật khẩu ngẫu nhiên
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}