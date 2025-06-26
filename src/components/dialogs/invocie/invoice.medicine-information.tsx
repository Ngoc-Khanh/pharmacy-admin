import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { MedicineResponse } from "@/data/interfaces"
import { InvoiceSchema } from "@/data/schemas"
import { itemVariants } from "@/lib/motion-vartiant"
import { formatCurrency } from "@/lib/utils"
import { Loader2, Package, Plus, Trash2 } from "lucide-react"
import { motion } from 'motion/react'
import { useFieldArray, UseFormReturn } from "react-hook-form"

interface Props {
  form: UseFormReturn<InvoiceSchema>
  medicines: MedicineResponse[]
  hasNextMedicines: boolean
  medicineLoadMoreRef: (node?: Element | null) => void
  isFetchingNextMedicines: boolean
}

export function InvoiceMedicineInformation({ form, medicines, hasNextMedicines, medicineLoadMoreRef, isFetchingNextMedicines }: Props) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items"
  })

  const items = form.watch("items")
  const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.price), 0)

  return (
    <Card className="border-purple-200/50 dark:border-purple-800/30">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300 flex items-center gap-2">
            <Package className="h-4 w-4" />
            Danh sách sản phẩm
          </CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ medicineId: "", quantity: 1, price: 0 })}
            className="flex items-center gap-2"
          >
            <Plus className="h-3 w-3" />
            Thêm
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.map((field, index) => (
          <motion.div
            key={field.id}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="border rounded-lg p-4 space-y-3 bg-muted/20"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">Sản phẩm #{index + 1}</h4>
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(index)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 h-6 w-6 p-0"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {/* Chọn thuốc với infinite scroll */}
              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name={`items.${index}.medicineId`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Thuốc *</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value)
                          // Tự động set giá khi chọn thuốc
                          const selectedMedicine = medicines.find(m => m.id === value)
                          if (selectedMedicine) {
                            form.setValue(`items.${index}.price`, selectedMedicine.variants.price)
                          }
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="Chọn thuốc" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-[400px] min-w-[500px]">
                          {medicines.map((medicine) => (
                            <SelectItem key={medicine.id} value={medicine.id}>
                              <div className="flex items-start justify-between text-left w-full">
                                <div className="flex items-center gap-3">
                                  <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                                    <Package className="h-3 w-3 text-blue-600" />
                                  </div>
                                  <div className="flex flex-col">
                                    <div className="font-medium text-xs">{medicine.name}</div>
                                    <div className="text-xs text-muted-foreground">
                                      {medicine.description}
                                    </div>
                                  </div>
                                </div>
                                <div className="text-xs text-emerald-600 font-medium">
                                  {formatCurrency(medicine.variants.price)}
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                          {hasNextMedicines && (
                            <div
                              ref={medicineLoadMoreRef}
                              className="flex items-center justify-center py-2"
                            >
                              {isFetchingNextMedicines ? (
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
              </div>

              {/* Số lượng */}
              <FormField
                control={form.control}
                name={`items.${index}.quantity`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Số lượng *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        className="h-9"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Giá */}
              <FormField
                control={form.control}
                name={`items.${index}.price`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Giá (VNĐ) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        step={1000}
                        className="h-9"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        disabled={true}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Thành tiền */}
            <div className="flex justify-end">
              <div className="text-right">
                <span className="text-xs text-muted-foreground">Thành tiền: </span>
                <span className="font-semibold text-emerald-600 text-sm">
                  {formatCurrency(items[index]?.quantity * items[index]?.price || 0)}
                </span>
              </div>
            </div>
          </motion.div>
        ))}

        <Separator />

        {/* Tổng tiền */}
        <div className="flex justify-end">
          <div className="text-right space-y-1">
            <div className="text-lg font-semibold text-emerald-700 dark:text-emerald-300">
              Tổng cộng: {formatCurrency(totalAmount)}
            </div>
            <div className="text-xs text-muted-foreground">
              {fields.length} sản phẩm
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}