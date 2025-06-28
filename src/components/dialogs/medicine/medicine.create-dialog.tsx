import { activeStepAtom, steps } from "@/atoms";
import { Stepper, StepperItem } from "@/components/custom/stepper";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { MedicineCreateDto } from "@/data/dto";
import { StockStatus } from "@/data/enum";
import { MedicineResponse } from "@/data/interfaces";
import { medicineSchema, MedicineSchema } from "@/data/schemas";
import { MedicineAPI } from "@/services/v1";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from 'framer-motion';
import { useAtom } from "jotai";
import { ChevronLeft, ChevronRight, Pill, Save } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { MedicineActionStepFour } from "./medicine.action-step-four";
import { MedicineActionStepOne } from "./medicine.action-step-one";
import { MedicineActionStepThree } from "./medicine.action-step-three";
import { MedicineActionStepTwo } from "./medicine.action-step-two";

interface MedicineCreateDialogProps {
  currentMedicine?: MedicineResponse;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MedicineCreateDialog({ open, onOpenChange }: MedicineCreateDialogProps) {
  const queryClient = useQueryClient();
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

  // Auto-calculate price based on originalPrice and discountPercent
  const originalPrice = form.watch("variants.originalPrice");
  const discountPercent = form.watch("variants.discountPercent");

  useEffect(() => {
    if (originalPrice && discountPercent != null && discountPercent >= 0) {
      const calculatedPrice = originalPrice * (1 - discountPercent / 100);
      form.setValue("variants.price", Number(calculatedPrice.toFixed(0)));
    }
  }, [originalPrice, discountPercent, form]);

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
      addMedicineMutation.mutate(data as MedicineCreateDto);
    } catch (error) {
      toast.error(`Thêm thuốc thất bại: ${error}`);
    }
  }

  const getFieldsByStep = (step: number): string[] => {
    switch (step) {
      case 1:
        return ["categoryId", "supplierId", "name", "description"];
      case 2:
        return ["variants.originalPrice", "variants.discountPercent", "variants.quantity", "variants.limitQuantity", "variants.stockStatus"];
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
        return <MedicineActionStepTwo form={form} />;
      case 3:
        return <MedicineActionStepThree form={form} />;
      case 4:
        return <MedicineActionStepFour form={form} />;
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
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderCurrentStep()}
            </motion.div>

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
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Đang thêm thuốc...
                    </>
                  ) : (
                    <>
                      {"Thêm thuốc"}
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