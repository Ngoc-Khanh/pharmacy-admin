import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SearchableInfiniteSelect } from "@/components/custom/searchable-infinite-select";
import { UserResponse } from "@/data/interfaces";
import { InvoiceSchema } from "@/data/schemas";
import { cn } from "@/lib/utils";
import { AccountAPI } from "@/services/v1";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { CalendarIcon, User } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface Props {
  form: UseFormReturn<InvoiceSchema>
  onUserSelect?: (user: UserResponse | null) => void
}

export function InvoiceInformationForm({ form, onUserSelect }: Props) {
  return (
    <Card className="border-emerald-200/50 dark:border-emerald-800/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
          <User className="h-4 w-4" />
          Thông tin khách hàng
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Chọn khách hàng với search và infinite scroll */}
        <FormField
          control={form.control}
          name="userId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Khách hàng *</FormLabel>
              <FormControl>
                <SearchableInfiniteSelect<UserResponse>
                  placeholder="Chọn khách hàng"
                  value={field.value}
                  onValueChange={field.onChange}
                  onSelectItem={(user) => onUserSelect?.(user)}
                  queryKey={["users-infinite"]}
                  queryFn={AccountAPI.AccountList}
                  getItemId={(user) => user.id}
                  getItemLabel={(user) => `${user.firstname} ${user.lastname}`}
                  renderItem={(user) => (
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <span>{user.firstname} {user.lastname}</span>
                        <Badge variant="outline" className="text-xs">
                          {user.email}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground ml-2">
                        {user.phone}
                      </span>
                    </div>
                  )}
                  searchPlaceholder="Tìm kiếm khách hàng..."
                  className="min-w-[400px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Số hóa đơn */}
        <FormField
          control={form.control}
          name="invoiceNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Số hóa đơn</FormLabel>
              <FormControl>
                <Input
                  placeholder="Để trống để tự động tạo"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Ngày xuất hóa đơn */}
        <FormField
          control={form.control}
          name="issuedAt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ngày xuất hóa đơn</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(new Date(field.value), "dd/MM/yyyy", { locale: vi })
                      ) : (
                        <span>Chọn ngày</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) => field.onChange(date?.toISOString())}
                    disabled={(date) => date > new Date()}
                    initialFocus
                    captionLayout="dropdown"
                    fromYear={2020}
                    toYear={2030}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  )
}