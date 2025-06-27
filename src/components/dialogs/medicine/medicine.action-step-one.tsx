import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SearchableInfiniteSelect } from "@/components/custom/searchable-infinite-select";
import { MedicineSchema } from "@/data/schemas";
import { CategoryAPI, SupplierAPI } from "@/services/v1";
import { CategoryResponse, SupplierResponse } from "@/data/interfaces";
import { UseFormReturn } from "react-hook-form";

interface MedicineActionStepOneProps {
  form: UseFormReturn<MedicineSchema>;
}

export function MedicineActionStepOne({ form }: MedicineActionStepOneProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-teal-700">Thông tin cơ bản</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Danh mục *</FormLabel>
              <FormControl>
                <SearchableInfiniteSelect<CategoryResponse>
                  placeholder="Chọn danh mục"
                  value={field.value}
                  onValueChange={field.onChange}
                  queryKey={["categories-infinite"]}
                  queryFn={CategoryAPI.CategoryList}
                  getItemId={(item) => item.id}
                  getItemLabel={(item) => item.title}
                  renderItem={(category) => (
                    <div className="flex items-center gap-2">
                      <span>{category.title}</span>
                      {category.description && (
                        <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                          {category.description}
                        </span>
                      )}
                    </div>
                  )}
                  searchPlaceholder="Tìm kiếm danh mục..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="supplierId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nhà cung cấp *</FormLabel>
              <FormControl>
                <SearchableInfiniteSelect<SupplierResponse>
                  placeholder="Chọn nhà cung cấp"
                  value={field.value}
                  onValueChange={field.onChange}
                  queryKey={["suppliers-infinite"]}
                  queryFn={SupplierAPI.SupplierList}
                  getItemId={(item) => item.id}
                  getItemLabel={(item) => item.name}
                  renderItem={(supplier) => (
                    <div className="flex items-center justify-between w-full">
                      <div className="flex flex-col">
                        <span>{supplier.name}</span>
                        {supplier.contactPhone && (
                          <span className="text-xs text-muted-foreground">
                            {supplier.contactPhone}
                          </span>
                        )}
                      </div>
                      {supplier.contactEmail && (
                        <span className="text-xs text-muted-foreground ml-2 truncate max-w-[120px]">
                          {supplier.contactEmail}
                        </span>
                      )}
                    </div>
                  )}
                  searchPlaceholder="Tìm kiếm nhà cung cấp..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tên thuốc *</FormLabel>
            <FormControl>
              <Input placeholder="Nhập tên thuốc" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Mô tả *</FormLabel>
            <FormControl>
              <Textarea placeholder="Nhập mô tả thuốc" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}