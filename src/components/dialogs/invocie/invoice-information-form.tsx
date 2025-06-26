import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserResponse } from "@/data/interfaces";
import { InvoiceSchema } from "@/data/schemas";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { CalendarIcon, Loader2, User } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface Props {
  form: UseFormReturn<InvoiceSchema>
  users: UserResponse[]
  hasNextUsers: boolean
  userLoadMoreRef: (node?: Element | null) => void
  isFetchingNextUsers: boolean
}

export function InvoiceInformationForm({ form, users, hasNextUsers, userLoadMoreRef, isFetchingNextUsers }: Props) {
  return (
    <Card className="border-emerald-200/50 dark:border-emerald-800/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
          <User className="h-4 w-4" />
          Thông tin khách hàng
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Chọn khách hàng với infinite scroll */}
        <FormField
          control={form.control}
          name="userId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Khách hàng *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn khách hàng" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="max-h-[400px] min-w-[400px]">
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
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
                    </SelectItem>
                  ))}
                  {hasNextUsers && (
                    <div
                      ref={userLoadMoreRef}
                      className="flex items-center justify-center py-2"
                    >
                      {isFetchingNextUsers ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="ml-2 text-sm">Đang tải...</span>
                        </>
                      ) : (
                        <span className="text-xs text-muted-foreground">Cuộn để tải thêm</span>
                      )}
                    </div>
                  )}
                </SelectContent>
              </Select>
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