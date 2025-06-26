import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InvoiceUpdateStatusDto } from "@/data/dto";
import { InvoiceStatus } from "@/data/enum";
import { InvoiceResponse } from "@/data/interfaces";
import { getStatusBadge } from "@/lib/invoice-helper";
import { InvoiceAPI } from "@/services/v1";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Ban, CheckCircle2, Clock, RefreshCw } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface ApiError extends Error {
  response?: {
    data?: {
      message?: string;
    };
  };
}

const formSchema = z.object({
  status: z.nativeEnum(InvoiceStatus, {
    required_error: "Vui lòng chọn trạng thái",
  }),
});

type FormData = z.infer<typeof formSchema>;

interface InvoiceChangeStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentInvoice: InvoiceResponse;
}

const statusOptions = [
  {
    value: InvoiceStatus.PENDING,
    label: "Chờ thanh toán",
    icon: Clock,
    description: "Hóa đơn đang chờ thanh toán",
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    hoverColor: "hover:bg-amber-100",
    darkBgColor: "dark:bg-amber-950/30",
    darkBorderColor: "dark:border-amber-800/50",
    iconBgColor: "bg-amber-100",
    darkIconColor: "dark:text-amber-400",
  },
  {
    value: InvoiceStatus.PAID,
    label: "Đã thanh toán",
    icon: CheckCircle2,
    description: "Hóa đơn đã được thanh toán thành công",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    hoverColor: "hover:bg-emerald-100",
    darkBgColor: "dark:bg-emerald-950/30",
    darkBorderColor: "dark:border-emerald-800/50",
    iconBgColor: "bg-emerald-100",
    darkIconColor: "dark:text-emerald-400",
  },
  {
    value: InvoiceStatus.CANCELLED,
    label: "Đã hủy",
    icon: Ban,
    description: "Hóa đơn đã bị hủy",
    color: "text-rose-600",
    bgColor: "bg-rose-50",
    borderColor: "border-rose-200",
    hoverColor: "hover:bg-rose-100",
    darkBgColor: "dark:bg-rose-950/30",
    darkBorderColor: "dark:border-rose-800/50",
    iconBgColor: "bg-rose-100",
    darkIconColor: "dark:text-rose-400",
  },
  {
    value: InvoiceStatus.REFUNDED,
    label: "Đã hoàn tiền",
    icon: RefreshCw,
    description: "Hóa đơn đã được hoàn tiền",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    hoverColor: "hover:bg-blue-100",
    darkBgColor: "dark:bg-blue-950/30",
    darkBorderColor: "dark:border-blue-800/50",
    iconBgColor: "bg-blue-100",
    darkIconColor: "dark:text-blue-400",
  },
];

export function InvoiceChangeStatusDialog({
  open,
  onOpenChange,
  currentInvoice,
}: InvoiceChangeStatusDialogProps) {
  const queryClient = useQueryClient();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: currentInvoice.status,
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: (data: InvoiceUpdateStatusDto) =>
      InvoiceAPI.InvoiceUpdateStatus(currentInvoice.id, data),
    onSuccess: () => {
      toast.success("Cập nhật trạng thái hóa đơn thành công");
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["invoice", currentInvoice.id] });
      onOpenChange(false);
      form.reset();
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi cập nhật trạng thái");
    },
  });

  const onSubmit = (data: FormData) => {
    updateStatusMutation.mutate(data);
  };

  const handleClose = () => {
    if (!updateStatusMutation.isPending) {
      form.reset();
      onOpenChange(false);
    }
  };

  const currentStatusOption = statusOptions.find(opt => opt.value === currentInvoice.status);
  const selectedStatusOption = statusOptions.find(opt => opt.value === form.watch("status"));

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 border-slate-200 dark:border-slate-700">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50">
              <RefreshCw className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
              Thay đổi trạng thái hóa đơn
            </span>
          </DialogTitle>
          <DialogDescription className="text-slate-600 dark:text-slate-400 mt-2">
            Thay đổi trạng thái cho hóa đơn <span className="font-semibold text-slate-900 dark:text-slate-100">#{currentInvoice.invoiceNumber}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 pb-6 space-y-6">
          {/* Trạng thái hiện tại */}
          <div className={`p-4 rounded-xl border ${currentStatusOption?.bgColor} ${currentStatusOption?.borderColor} ${currentStatusOption?.darkBgColor} ${currentStatusOption?.darkBorderColor} transition-all duration-200`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Trạng thái hiện tại</p>
                <div className="mt-1">
                  {getStatusBadge(currentInvoice.status)}
                </div>
              </div>
              {currentStatusOption && (
                <div className={`p-3 rounded-full ${currentStatusOption.iconBgColor} dark:bg-slate-800/50`}>
                  <currentStatusOption.icon className={`h-6 w-6 ${currentStatusOption.color} ${currentStatusOption.darkIconColor}`} />
                </div>
              )}
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold text-slate-900 dark:text-slate-100">Trạng thái mới</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={updateStatusMutation.isPending}
                    >
                      <FormControl>
                        <SelectTrigger className="h-12 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-slate-400 dark:hover:border-slate-500 transition-colors">
                          <SelectValue placeholder="Chọn trạng thái mới" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                        {statusOptions.map((option) => {
                          const Icon = option.icon;
                          const isDisabled = option.value === currentInvoice.status;
                          return (
                            <SelectItem
                              key={option.value}
                              value={option.value}
                              disabled={isDisabled}
                              className={`p-3 ${isDisabled ? 'opacity-50 cursor-not-allowed' : `${option.hoverColor} cursor-pointer`} transition-colors`}
                            >
                              <div className="flex items-center gap-3 w-full">
                                <div className={`p-2 rounded-lg ${option.iconBgColor} dark:bg-slate-700/50`}>
                                  <Icon className={`h-4 w-4 ${option.color} ${option.darkIconColor}`} />
                                </div>
                                <div className="flex items-center gap-1">
                                  <p className="font-medium text-slate-900 dark:text-slate-100">{option.label}</p>
                                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    "{option.description}"
                                  </p>
                                </div>
                                {isDisabled && (
                                  <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 px-2 py-1 rounded-md">
                                    Hiện tại
                                  </span>
                                )}
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Preview trạng thái mới */}
              {selectedStatusOption && form.watch("status") !== currentInvoice.status && (
                <div className={`p-4 rounded-xl border-2 ${selectedStatusOption.bgColor} ${selectedStatusOption.borderColor} ${selectedStatusOption.darkBgColor} ${selectedStatusOption.darkBorderColor} transition-all duration-300 animate-in slide-in-from-top-2`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg ${selectedStatusOption.iconBgColor} dark:bg-slate-700/50`}>
                      <selectedStatusOption.icon className={`h-4 w-4 ${selectedStatusOption.color} ${selectedStatusOption.darkIconColor}`} />
                    </div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Trạng thái sẽ được thay đổi thành:</p>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(form.watch("status"))}
                    </div>
                  </div>
                </div>
              )}

              <DialogFooter className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={updateStatusMutation.isPending}
                  className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  disabled={updateStatusMutation.isPending || form.watch("status") === currentInvoice.status}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {updateStatusMutation.isPending && (
                    <svg className="animate-spin -ml-1 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  Cập nhật trạng thái
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}