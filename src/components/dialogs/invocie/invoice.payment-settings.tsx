import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InvoiceStatus, PaymentMethod } from "@/data/enum";
import { UserAddress, UserResponse } from "@/data/interfaces";
import { InvoiceSchema } from "@/data/schemas";
import { CreditCard, MapPin, Truck, Wallet } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface Props {
  form: UseFormReturn<InvoiceSchema>
  selectedUser: UserResponse | null
}

export function InvoicePaymentSettings({ form, selectedUser }: Props) {
  const userAddresses: UserAddress[] = selectedUser?.addresses || []
  
  return (
    <Card className="border-blue-200/50 dark:border-blue-800/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300 flex items-center gap-2">
          <Wallet className="h-4 w-4" />
          Thanh toán & Cài đặt
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="paymentMethod"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phương thức thanh toán *</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="grid grid-cols-1 gap-2"
                >
                  <div className="flex items-center space-x-2 border rounded-lg p-2 hover:bg-muted/50">
                    <RadioGroupItem value={PaymentMethod.COD} id="cod" />
                    <Label htmlFor="cod" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Truck className="h-3 w-3 text-orange-500" />
                      <span className="text-sm">COD</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-lg p-2 hover:bg-muted/50">
                    <RadioGroupItem value={PaymentMethod.CREDIT_CARD} id="credit" />
                    <Label htmlFor="credit" className="flex items-center gap-2 cursor-pointer flex-1">
                      <CreditCard className="h-3 w-3 text-blue-500" />
                      <span className="text-sm">Thẻ tín dụng</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-lg p-2 hover:bg-muted/50">
                    <RadioGroupItem value={PaymentMethod.BANK_TRANSFER} id="bank" />
                    <Label htmlFor="bank" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Wallet className="h-3 w-3 text-green-500" />
                      <span className="text-sm">Chuyển khoản</span>
                    </Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Địa chỉ giao hàng */}
        <FormField
          control={form.control}
          name="shippingAddressId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <MapPin className="h-3 w-3" />
                Địa chỉ giao hàng
              </FormLabel>
              {!selectedUser ? (
                <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground">
                  Vui lòng chọn khách hàng trước
                </div>
              ) : userAddresses.length === 0 ? (
                <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground">
                  Khách hàng chưa có địa chỉ giao hàng
                </div>
              ) : (
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn địa chỉ" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="min-w-[500px]">
                    {userAddresses.map((address) => (
                      <SelectItem key={address.id} value={address.id}>
                        <div className="flex items-start justify-between text-left w-full">
                          <div className="flex flex-col">
                            <span className="font-medium text-sm">{address.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {address.addressLine1}, {address.city}
                            </span>
                          </div>
                          {address.isDefault && (
                            <Badge variant="secondary" className="text-xs">Mặc định</Badge>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Trạng thái */}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Trạng thái *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={InvoiceStatus.PENDING}>
                    <Badge className="bg-amber-100 text-amber-800 border-amber-300">
                      Chờ thanh toán
                    </Badge>
                  </SelectItem>
                  <SelectItem value={InvoiceStatus.PAID}>
                    <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300">
                      Đã thanh toán
                    </Badge>
                  </SelectItem>
                  <SelectItem value={InvoiceStatus.CANCELLED}>
                    <Badge className="bg-rose-100 text-rose-800 border-rose-300">
                      Đã hủy
                    </Badge>
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  )
}