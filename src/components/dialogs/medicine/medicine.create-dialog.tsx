import { activeStepAtom, steps } from "@/atoms";
import { Form } from "@/components/ui/form";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Stepper, StepperItem } from "@/components/ui/stepper";
import { StockStatus } from "@/data/enum";
import { MedicineResponse } from "@/data/interfaces";
import { medicineSchema, MedicineSchema } from "@/data/schemas";
import { MedicineAPI } from "@/services/v1";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { ChevronLeft, ChevronRight, Pill, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { MedicineActionStepOne } from "./medicine.action-step-one";
import { Button } from "@/components/ui/button";

interface MedicineCreateDialogProps {
  currentMedicine?: MedicineResponse;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MedicineCreateDialog({ currentMedicine, open, onOpenChange }: MedicineCreateDialogProps) {
  const queryClient = useQueryClient();
  const isEdit = !!currentMedicine;
  const [activeStep, setActiveStep] = useAtom(activeStepAtom);

  const form = useForm<MedicineSchema>({
    resolver: zodResolver(medicineSchema),
    defaultValues: {
      categoryId: "",
      supplierId: "",
      name: "",
      description: "",
      variants: {
        price: 10000,
        quantity: 1,
        limitQuantity: 1,
        stockStatus: StockStatus.IN_STOCK,
        originalPrice: 10000,
        discountPercent: 0,
        isFeatured: false,
        isActive: true,
      },
      details: {
        ingredients: "",
        usage: [""],
        paramaters: {
          origin: "",
          packaging: "",
        },
      },
      usageguide: {
        dosage: {
          adult: "",
          child: "",
        },
        directions: [""],
        precautions: [""],
      },
      isEdit: false,
    }
  });

  const addMedicineMutation = useMutation({
    mutationFn: MedicineAPI.MedicineCreate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicines"] });
      toast.success("Thêm thuốc thành công");
      setActiveStep(1);
      onOpenChange(false);
    },
    onError: () => {
      toast.error("Thêm thuốc thất bại");
    }
  })

  const handleSubmit = async (data: MedicineSchema) => {
    try {
      const isValid = await form.trigger();
      if (!isValid) {
        toast.error("Vui lòng kiểm tra lại thông tin");
        return;
      }
      addMedicineMutation.mutate(data);
    } catch (error) {
      toast.error(`Thêm thuốc thất bại: ${error}`);
    }
  }

  const getFieldsByStep = (step: number): string[] => {
    switch (step) {
      case 1:
        return ["categoryId", "supplierId", "name", "description"];
      case 2:
        return ["variants.originalPrice", "variants.discountPercent", "variants.limitQuantity", "variants.stockStatus"];
      case 3:
        return ["details.ingredients", "details.paramaters.origin", "details.paramaters.packaging"];
      case 4:
        return ["usageguide.dosage.adult", "usageguide.dosage.child", "usageguide.directions", "usageguide.precautions"];
      default:
        return [];
    }
  };

  const renderCurrentStep = () => {
    switch (activeStep) {
      case 1:
        return <MedicineActionStepOne form={form} />;
      case 2:
        return <div>Biến thể</div>;
      case 3:
        return <div>Chi tiết</div>;
      case 4:
        return <div>Hướng dẫn sử dụng</div>;
      default:
        return null;
    }
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(state) => {
        if (!state) form.reset();
        onOpenChange(state);
      }}
    >
      <SheetContent className="w-[600px] sm:w-[800px] sm:max-w-[800px] overflow-y-auto">
        <SheetHeader className="bg-gradient-to-r from-fuchsia-600/90 to-fuchsia-500/90 text-white p-6 -m-6 mb-6 rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="bg-white/90 p-2 rounded-full shadow-sm">
              <Pill className="h-6 w-6 text-fuchsia-600" />
            </div>
            <SheetTitle className="text-xl font-semibold text-white">
              Thêm thuốc mới
            </SheetTitle>
          </div>
          <SheetDescription className="text-white/90 mt-2">
            Thêm thông tin thuốc mới vào hệ thống
          </SheetDescription>

          <div className="mx-auto w-full mt-8 mb-2 text-center">
            <Stepper value={activeStep} className="items-start mt-4 gap-4">
              {steps.map(({ step, title }) => (
                <StepperItem key={step} step={step} className="flex-1 pointer-events-none">
                  <div className="w-full flex-col items-start gap-2 rounded select-none">
                    <div
                      className={`h-1.5 w-full transition-all duration-300 rounded-full ${activeStep >= step
                        ? "bg-white shadow-sm"
                        : "bg-white/30"
                        }`}
                    >
                      <span className="sr-only">{step}</span>
                    </div>
                    <div className="space-y-0.5 pt-1.5">
                      <span
                        className={`transition-all duration-300 text-sm font-medium ${activeStep === step
                          ? "text-white"
                          : activeStep > step
                            ? "text-white/80"
                            : "text-white/60"
                          }`}
                      >
                        {title}
                      </span>
                    </div>
                  </div>
                </StepperItem>
              ))}
            </Stepper>
          </div>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (activeStep === 4) {
                form.handleSubmit(handleSubmit, () => {
                  toast.error("Vui lòng kiểm tra lại thông tin");
                })();
              }
            }}
            className="space-y-6 py-4"
          >
            {renderCurrentStep()}

            <SheetFooter className="mt-8 pt-4 border-t border-teal-50 flex flex-col sm:flex-row gap-2">
              {activeStep > 1 && (
                <Button
                  variant="outline"
                  className="flex items-center gap-1"
                  onClick={() => setActiveStep(activeStep - 1)}
                  type="button"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Quay lại
                </Button>
              )}

              <div className="flex-1" />

              {activeStep < 4 ? (
                <Button
                  variant="default"
                  className="bg-fuchsia-600 hover:bg-fuchsia-700 flex items-center gap-1"
                  onClick={async () => {
                    const fields = getFieldsByStep(activeStep);
                    const result = await form.trigger(fields as Array<keyof MedicineSchema>);
                    if (result) {
                      setActiveStep(activeStep + 1);
                    } else {
                      toast.error("Vui lòng điền đầy đủ thông tin");
                    }
                  }}
                  type="button"
                >
                  Tiếp theo
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  variant="default"
                  className="bg-fuchsia-600 hover:bg-fuchsia-700 flex items-center gap-1"
                  type="button"
                  onClick={() => form.handleSubmit(handleSubmit)()}
                  disabled={addMedicineMutation.isPending}
                >
                  {(addMedicineMutation.isPending) ? (
                    "Đang xử lý..."
                  ) : (
                    <>
                      {isEdit ? "Cập nhật" : "Tạo mới"}
                      <Save className="h-4 w-4 ml-1" />
                    </>
                  )}
                </Button>
              )}
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}