import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AccountSchema } from "@/data/schemas";
import { UserIcon } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface Props {
  form: UseFormReturn<AccountSchema>
}

export function AccountInformationForm({ form }: Props) {
  return (

    <div className="rounded-lg border border-border/50 bg-card/40 p-5 backdrop-blur-sm transition-all duration-300">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-6 w-6 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center">
          <UserIcon className="h-3 w-3 text-sky-600 dark:text-sky-400" />
        </div>
        <h3 className="font-medium text-sky-600 dark:text-sky-400">Thông tin cá nhân</h3>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstname"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium">Tên</FormLabel>
                <FormControl>
                  <Input
                    className="transition-all border-input/50 focus:border-cyan-500/50"
                    placeholder="John"
                    {...field}
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
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium">Họ</FormLabel>
                <FormControl>
                  <Input
                    className="transition-all border-input/50 focus:border-cyan-500/50"
                    placeholder="Doe"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-medium">Username</FormLabel>
              <FormControl>
                <Input
                  className="transition-all border-input/50 focus:border-cyan-500/50"
                  placeholder="johndoe"
                  {...field}
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
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-medium">Email</FormLabel>
              <FormControl>
                <Input
                  className="transition-all border-input/50 focus:border-cyan-500/50"
                  placeholder="john.doe@example.com"
                  type="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-medium">Số điện thoại</FormLabel>
              <FormControl>
                <Input
                  className="transition-all border-input/50 focus:border-cyan-500/50"
                  placeholder="+1234567890"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}