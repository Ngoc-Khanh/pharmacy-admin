import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { SearchableInfiniteSelect } from "@/components/custom/searchable-infinite-select";
import { Separator } from "@/components/ui/separator";
import { StockStatus } from "@/data/enum";
import { MedicineResponse, CategoryResponse, SupplierResponse } from "@/data/interfaces";
import { medicineSchema, MedicineSchema } from "@/data/schemas";
import { MedicineAPI, CategoryAPI, SupplierAPI } from "@/services/v1";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from 'framer-motion';
import { 
  Pill, 
  Save, 
  Package, 
  Tag, 
  Tags, 
  Warehouse, 
  Calculator,
  GlassWater,
  Factory,
  PersonStanding,
  Baby,
  FileWarning,
  FilePlus2
} from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface MedicineUpdateDialogProps {
  currentMedicine?: MedicineResponse;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MedicineUpdateDialog({ currentMedicine, open, onOpenChange }: MedicineUpdateDialogProps) {
  const queryClient = useQueryClient();

  const form = useForm<MedicineSchema>({
    resolver: zodResolver(medicineSchema),
    defaultValues: {
      categoryId: currentMedicine?.categoryId || "",
      supplierId: currentMedicine?.supplierId || "",
      name: currentMedicine?.name || "",
      description: currentMedicine?.description || "",
      variants: {
        price: currentMedicine?.variants?.price || 10000,
        quantity: currentMedicine?.variants?.quantity || 1,
        limitQuantity: currentMedicine?.variants?.limitQuantity || 1,
        stockStatus: currentMedicine?.variants?.stockStatus || StockStatus.IN_STOCK,
        originalPrice: currentMedicine?.variants?.originalPrice || 10000,
        discountPercent: currentMedicine?.variants?.discountPercent || 0,
        isFeatured: currentMedicine?.variants?.isFeatured || false,
        isActive: currentMedicine?.variants?.isActive || true,
      },
      details: {
        ingredients: currentMedicine?.details?.ingredients || "",
        usage: currentMedicine?.details?.usage || [""],
        paramaters: {
          origin: currentMedicine?.details?.paramaters?.origin || "",
          packaging: currentMedicine?.details?.paramaters?.packaging || "",
        },
      },
      usageguide: {
        dosage: {
          adult: currentMedicine?.usageguide?.dosage?.adult || "",
          child: currentMedicine?.usageguide?.dosage?.child || "",
        },
        directions: currentMedicine?.usageguide?.directions || [""],
        precautions: currentMedicine?.usageguide?.precautions || [""],
      },
      isEdit: true,
    }
  });

  // Update form when currentMedicine changes
  useEffect(() => {
    if (currentMedicine && open) {
      form.reset({
        categoryId: currentMedicine.categoryId || "",
        supplierId: currentMedicine.supplierId || "",
        name: currentMedicine.name || "",
        description: currentMedicine.description || "",
        variants: {
          price: currentMedicine.variants?.price || 10000,
          quantity: currentMedicine.variants?.quantity || 1,
          limitQuantity: currentMedicine.variants?.limitQuantity || 1,
          stockStatus: currentMedicine.variants?.stockStatus || StockStatus.IN_STOCK,
          originalPrice: currentMedicine.variants?.originalPrice || 10000,
          discountPercent: currentMedicine.variants?.discountPercent || 0,
          isFeatured: currentMedicine.variants?.isFeatured || false,
          isActive: currentMedicine.variants?.isActive || true,
        },
        details: {
          ingredients: currentMedicine.details?.ingredients || "",
          usage: currentMedicine.details?.usage || [""],
          paramaters: {
            origin: currentMedicine.details?.paramaters?.origin || "",
            packaging: currentMedicine.details?.paramaters?.packaging || "",
          },
        },
        usageguide: {
          dosage: {
            adult: currentMedicine.usageguide?.dosage?.adult || "",
            child: currentMedicine.usageguide?.dosage?.child || "",
          },
          directions: currentMedicine.usageguide?.directions || [""],
          precautions: currentMedicine.usageguide?.precautions || [""],
        },
        isEdit: true,
      });
    }
  }, [currentMedicine, open, form]);

  // Auto-calculate price based on originalPrice and discountPercent
  const originalPrice = form.watch("variants.originalPrice");
  const discountPercent = form.watch("variants.discountPercent");

  useEffect(() => {
    if (originalPrice && discountPercent != null && discountPercent >= 0) {
      const calculatedPrice = originalPrice * (1 - discountPercent / 100);
      form.setValue("variants.price", Number(calculatedPrice.toFixed(0)));
    }
  }, [originalPrice, discountPercent, form]);

  const updateMedicineMutation = useMutation({
    mutationFn: (data: MedicineSchema) => MedicineAPI.MedicineUpdate(currentMedicine?.id || "", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicines"] });
      queryClient.invalidateQueries({ queryKey: ["medicine", currentMedicine?.id] });
      toast.success("Cập nhật thuốc thành công");
      onOpenChange(false);
    },
    onError: () => {
      toast.error("Cập nhật thuốc thất bại");
    }
  });

  const handleSubmit = async (data: MedicineSchema) => {
    try {
      const isValid = await form.trigger();
      if (!isValid) {
        toast.error("Vui lòng kiểm tra lại thông tin");
        return;
      }
      updateMedicineMutation.mutate(data);
    } catch (error) {
      toast.error(`Cập nhật thuốc thất bại: ${error}`);
    }
  };

  // Helper functions for array operations
  const addArrayItem = (path: 'details.usage' | 'usageguide.directions' | 'usageguide.precautions', value: string) => {
    const currentValues = form.getValues(path) as string[];
    form.setValue(path, [...currentValues, value], { shouldValidate: true });
  };

  const removeArrayItem = (path: 'details.usage' | 'usageguide.directions' | 'usageguide.precautions', index: number) => {
    const currentValues = form.getValues(path) as string[];
    if (currentValues.length > 1) {
      form.setValue(
        path,
        currentValues.filter((_, i) => i !== index),
        { shouldValidate: true }
      );
    }
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(state) => {
        if (!state) form.reset();
        onOpenChange(state);
      }}
    >
      <SheetContent className="w-[900px] sm:w-[1000px] sm:max-w-[1000px] overflow-y-auto">
        <SheetHeader className="bg-gradient-to-r from-blue-600/90 to-blue-500/90 text-white p-6 -m-6 mb-6 rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="bg-white/90 p-2 rounded-full shadow-sm">
              <Pill className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <SheetTitle className="text-xl font-semibold text-white">
                Cập nhật thuốc
              </SheetTitle>
              <SheetDescription className="text-white/90 mt-1">
                Chỉnh sửa thông tin thuốc: {currentMedicine?.name}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8 py-4">
            
            {/* Thông tin cơ bản */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 text-lg font-semibold text-blue-700">
                <Package className="h-5 w-5" />
                <span>Thông tin cơ bản</span>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
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
                </div>

                <div className="space-y-4">
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
              </div>
            </motion.section>

            <Separator />

            {/* Giá và kho */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 text-lg font-semibold text-blue-700">
                <Tags className="h-5 w-5" />
                <span>Giá và kho hàng</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="variants.originalPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1">
                          <Tag className="h-4 w-4" /> Giá gốc (VNĐ) *
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="120000"
                            {...field}
                            onChange={e => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="variants.discountPercent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1">
                          <Calculator className="h-4 w-4" /> Giảm giá (%) *
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="10"
                            {...field}
                            onChange={e => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="variants.price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1">
                          <Tags className="h-4 w-4" /> Giá bán (VNĐ) - Tự động
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            readOnly
                            className="bg-gray-50"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="variants.quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1">
                          <Warehouse className="h-4 w-4" /> Số lượng hiện có *
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="50"
                            {...field}
                            onChange={e => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="variants.limitQuantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1">
                          <Package className="h-4 w-4" /> Số lượng tối đa *
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="100"
                            {...field}
                            onChange={e => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="variants.stockStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Trạng thái kho *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn trạng thái" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="IN-STOCK" className="text-green-600">Còn hàng</SelectItem>
                            <SelectItem value="LOW-STOCK" className="text-amber-600">Sắp hết hàng</SelectItem>
                            <SelectItem value="OUT-OF-STOCK" className="text-red-600">Hết hàng</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-6">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="text-blue-800 font-medium mb-3">Tùy chọn hiển thị</h4>
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="variants.isFeatured"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-3">
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div>
                              <FormLabel>Sản phẩm nổi bật</FormLabel>
                              <p className="text-xs text-blue-600">Hiển thị trên trang chủ</p>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="variants.isActive"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-3">
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div>
                              <FormLabel>Kích hoạt sản phẩm</FormLabel>
                              <p className="text-xs text-blue-600">Hiển thị cho khách hàng</p>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            <Separator />

            {/* Chi tiết thuốc */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 text-lg font-semibold text-blue-700">
                <GlassWater className="h-5 w-5" />
                <span>Chi tiết thuốc</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="details.ingredients"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Thành phần *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Nhập thành phần của thuốc"
                            className="min-h-32"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="details.paramaters.origin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1">
                            <Factory className="h-4 w-4" /> Xuất xứ *
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Việt Nam" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="details.paramaters.packaging"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1">
                            <Package className="h-4 w-4" /> Đóng gói *
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Hộp 30 viên" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <FormLabel className="text-blue-700 font-medium">Cách sử dụng</FormLabel>
                    <div className="space-y-2 mt-2">
                      {form.getValues("details.usage").map((_, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <FormField
                            control={form.control}
                            name={`details.usage.${index}` as `details.usage.${number}`}
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormControl>
                                  <Input 
                                    placeholder={`Cách sử dụng ${index + 1}`} 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeArrayItem("details.usage", index)}
                            className="shrink-0"
                          >
                            -
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addArrayItem("details.usage", "")}
                      >
                        + Thêm cách sử dụng
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            <Separator />

            {/* Hướng dẫn sử dụng */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 text-lg font-semibold text-blue-700">
                <FilePlus2 className="h-5 w-5" />
                <span>Hướng dẫn sử dụng</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Liều dùng */}
                <div className="p-4 bg-green-50 rounded-lg space-y-4">
                  <h4 className="text-green-700 font-medium">Liều dùng</h4>
                  
                  <FormField
                    control={form.control}
                    name="usageguide.dosage.adult"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1">
                          <PersonStanding className="h-4 w-4" /> Người lớn *
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Ngày 2 viên sau bữa ăn" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="usageguide.dosage.child"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1">
                          <Baby className="h-4 w-4" /> Trẻ em *
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Ngày 1 viên sau bữa ăn" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Hướng dẫn */}
                <div className="p-4 bg-blue-50 rounded-lg">
                  <FormLabel className="text-blue-700 font-medium">Hướng dẫn sử dụng</FormLabel>
                  <div className="space-y-2 mt-2">
                    {form.getValues("usageguide.directions").map((_, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <FormField
                          control={form.control}
                          name={`usageguide.directions.${index}` as `usageguide.directions.${number}`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input 
                                  placeholder={`Hướng dẫn ${index + 1}`} 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeArrayItem("usageguide.directions", index)}
                          className="shrink-0"
                        >
                          -
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addArrayItem("usageguide.directions", "")}
                    >
                      + Thêm hướng dẫn
                    </Button>
                  </div>
                </div>

                {/* Lưu ý */}
                <div className="p-4 bg-amber-50 rounded-lg">
                  <FormLabel className="text-amber-700 font-medium flex items-center gap-1">
                    <FileWarning className="h-4 w-4" /> Lưu ý quan trọng
                  </FormLabel>
                  <div className="space-y-2 mt-2">
                    {form.getValues("usageguide.precautions").map((_, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <FormField
                          control={form.control}
                          name={`usageguide.precautions.${index}` as `usageguide.precautions.${number}`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input 
                                  placeholder={`Lưu ý ${index + 1}`} 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeArrayItem("usageguide.precautions", index)}
                          className="shrink-0"
                        >
                          -
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addArrayItem("usageguide.precautions", "")}
                    >
                      + Thêm lưu ý
                    </Button>
                  </div>
                </div>
              </div>
            </motion.section>

            <SheetFooter className="mt-8 pt-4 border-t">
              <Button
                variant="default"
                className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                type="submit"
                disabled={updateMedicineMutation.isPending}
              >
                {updateMedicineMutation.isPending ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang cập nhật...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Cập nhật thuốc
                  </>
                )}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}