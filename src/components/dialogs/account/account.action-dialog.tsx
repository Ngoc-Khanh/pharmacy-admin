import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form } from "@/components/ui/form"
import { AddAcccountDto, UpdateSettingAccountDto } from "@/data/dto"
import { AccountRole, AccountStatus } from "@/data/enum"
import { UserResponse } from "@/data/interfaces"
import { accountSchema, AccountSchema } from "@/data/schemas"
import { cn } from "@/lib/utils"
import { AccountAPI } from "@/services/v1"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Sparkles } from "lucide-react"
import { motion, Variants } from 'motion/react'
import { useCallback, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { AccountInformationForm } from "./account.information-form"
import { AccountPermissionForm } from "./account.permission-form"

interface Props {
  currentAccount?: UserResponse
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AccountActionDialog({ currentAccount, open, onOpenChange }: Props) {
  const queryClient = useQueryClient()
  const isEdit = !!currentAccount
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false)

  const form = useForm<AccountSchema>({
    resolver: zodResolver(accountSchema),
    defaultValues: isEdit ? {
      ...currentAccount,
      isEdit,
    } : {
      username: "",
      email: "",
      firstname: "",
      lastname: "",
      phone: "",
      role: AccountRole.CUSTOMER,
      status: AccountStatus.ACTIVE,
      password: "",
      passwordConfirmation: "",
      isEdit,
    }
  })



  const addAccountMutation = useMutation({
    mutationFn: AccountAPI.AccountAdd,
    onSuccess: () => {
      toast.success("Thêm người dùng thành công");
      form.reset();
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
    onError: () => {
      toast.error("Thêm người dùng thất bại");
    }
  })

  const updateAccountMutation = useMutation({
    mutationFn: (values: AccountSchema) => {
      if (!currentAccount?.id) throw new Error("Cần có USER ID để cập nhật");
      return AccountAPI.AccountUpdate(currentAccount.id, values);
    },
    onSuccess: () => {
      toast.success("Cập nhật người dùng thành công");
      form.reset();
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
    onError: () => {
      toast.error("Cập nhật người dùng thất bại");
    }
  })

  const isPending = addAccountMutation.isPending || updateAccountMutation.isPending;

  const onSubmit = useCallback((values: AccountSchema) => {
    if (!isEdit) addAccountMutation.mutate(values as AddAcccountDto);
    else updateAccountMutation.mutate(values as UpdateSettingAccountDto);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, onOpenChange, addAccountMutation, updateAccountMutation, form]);

  const generateRandomPassword = useCallback(() => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let password = "";

    // Ensure at least one of each character type
    password += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)]; // Uppercase
    password += "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)]; // Lowercase
    password += "0123456789"[Math.floor(Math.random() * 10)]; // Number
    password += "!@#$%^&*()_+"[Math.floor(Math.random() * 12)]; // Special char

    // Fill the rest randomly
    for (let i = 0; i < length - 4; i++) {
      password += charset[Math.floor(Math.random() * charset.length)];
    }

    // Shuffle the password
    password = password.split('').sort(() => 0.5 - Math.random()).join('');

    form.setValue("password", password);
    form.setValue("passwordConfirmation", password);
    form.trigger(["password", "passwordConfirmation"]);

    toast.success("Đã tạo mật khẩu ngẫu nhiên!", {
      description: "Mật khẩu mới đã được tạo và điền vào form.",
      duration: 3000,
    });
  }, [form]);

  const formSectionVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.05 * custom,
        duration: 0.4,
        ease: "easeOut"
      }
    })
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset();
        onOpenChange(state);
      }}
    >
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="p-6 pb-4 space-y-2">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-3"
          >
            <div className="h-10 w-10 rounded-lg bg-cyan-100/80 dark:bg-cyan-900/30 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold tracking-tight text-cyan-800 dark:text-cyan-300">
                {isEdit ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground/80 mt-0.5">
                {isEdit ? "Cập nhật thông tin người dùng trong hệ thống" : "Tạo tài khoản người dùng mới trong hệ thống"}
              </DialogDescription>
            </div>
          </motion.div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="px-6 pb-2">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Cột trái - Thông tin cá nhân */}
              <motion.div
                custom={1}
                variants={formSectionVariants as Variants}
                initial="hidden"
                animate="visible"
                className="space-y-6"
              >
                <AccountInformationForm form={form} />
              </motion.div>

              {/* Cột phải - Phân quyền và bảo mật */}
              <motion.div
                custom={2}
                variants={formSectionVariants as Variants}
                initial="hidden"
                animate="visible"
                className="space-y-6"
              >
                {/* Phân quyền & Mật khẩu */}
                <AccountPermissionForm 
                  form={form}
                  isEdit={isEdit}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  showPasswordConfirmation={showPasswordConfirmation}
                  setShowPasswordConfirmation={setShowPasswordConfirmation}
                  generateRandomPassword={generateRandomPassword}
                />
              </motion.div>
            </div>
          </form>

          <div className="p-4 bg-muted/30 border-t border-border/50 mt-6">
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="transition-all duration-200"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                onClick={form.handleSubmit(onSubmit)}
                disabled={isPending}
                className={cn(
                  "transition-all duration-300 relative overflow-hidden",
                  isPending ? "opacity-80 cursor-not-allowed" : "",
                  isEdit
                    ? "bg-sky-600 hover:bg-sky-700"
                    : "bg-emerald-600 hover:bg-emerald-700"
                )}
              >
                {isPending ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isEdit ? "Đang cập nhật..." : "Đang tạo..."}
                  </>
                ) : (
                  <>
                    {isEdit ? "Cập nhật người dùng" : "Tạo tài khoản"}
                    <Sparkles className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </DialogFooter>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  )
}