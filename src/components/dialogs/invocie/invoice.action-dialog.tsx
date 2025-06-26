import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form } from "@/components/ui/form"
import { InvoiceCreateWithNoOrderDto } from "@/data/dto"
import { AccountStatus, InvoiceStatus, PaymentMethod } from "@/data/enum"
import { UserResponse } from "@/data/interfaces"
import { invoiceSchema, InvoiceSchema } from "@/data/schemas"
import { formSectionVariants } from "@/lib/motion-vartiant"
import { cn } from "@/lib/utils"
import { AccountAPI, InvoiceAPI, MedicineAPI } from "@/services/v1"
import { zodResolver } from "@hookform/resolvers/zod"
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Receipt, Sparkles } from "lucide-react"
import { motion } from 'motion/react'
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useInView } from "react-intersection-observer"
import { toast } from "sonner"
import { InvoiceInformationForm } from "./invoice-information-form"
import { InvoiceMedicineInformation } from "./invoice.medicine-information"
import { InvoicePaymentSettings } from "./invoice.payment-settings"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function InvoiceCreateDialog({ open, onOpenChange }: Props) {
  const queryClient = useQueryClient()
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null)

  // Intersection observer refs for infinite scroll
  const { ref: userLoadMoreRef, inView: userInView } = useInView()
  const { ref: medicineLoadMoreRef, inView: medicineInView } = useInView()

  const form = useForm<InvoiceSchema>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      userId: "",
      invoiceNumber: "",
      items: [{ medicineId: "", quantity: 1, price: 0 }],
      paymentMethod: PaymentMethod.COD,
      shippingAddressId: "",
      issuedAt: new Date().toISOString(),
      status: InvoiceStatus.PENDING,
    }
  })

  // Infinite Query cho Users
  const {
    data: usersData,
    fetchNextPage: fetchNextUsers,
    hasNextPage: hasNextUsers,
    isFetchingNextPage: isFetchingNextUsers,
  } = useInfiniteQuery({
    queryKey: ["users-infinite"],
    queryFn: ({ pageParam = 1 }) => AccountAPI.AccountList({ page: pageParam, limit: 20 }),
    getNextPageParam: (lastPage, pages) => {
      if (!lastPage?.total || !pages?.length) return undefined
      const totalPages = Math.ceil(lastPage.total / 20)
      return pages.length < totalPages ? pages.length + 1 : undefined
    },
    initialPageParam: 1,
  })

  // Infinite Query cho Medicines
  const {
    data: medicinesData,
    fetchNextPage: fetchNextMedicines,
    hasNextPage: hasNextMedicines,
    isFetchingNextPage: isFetchingNextMedicines,
  } = useInfiniteQuery({
    queryKey: ["medicines-infinite"],
    queryFn: ({ pageParam = 1 }) => MedicineAPI.MedicineList({ page: pageParam, limit: 20 }),
    getNextPageParam: (lastPage, pages) => {
      if (!lastPage?.total || !pages?.length) return undefined
      const totalPages = Math.ceil(lastPage.total / 20)
      return pages.length < totalPages ? pages.length + 1 : undefined
    },
    initialPageParam: 1,
  })

  // Flatten data with safe checks and filter active users only
  const users = usersData?.pages?.flatMap(page => page?.data || []).filter(user => user.status === AccountStatus.ACTIVE) ?? []
  const medicines = medicinesData?.pages?.flatMap(page => page?.data || []) ?? []

  const createInvoiceMutation = useMutation({
    mutationFn: InvoiceAPI.InvoiceCreateWithNoOrder,
    onSuccess: () => {
      toast.success("Tạo hóa đơn thành công")
      form.reset()
      onOpenChange(false)
      queryClient.invalidateQueries({ queryKey: ["invoices"] })
    },
    onError: () => {
      toast.error("Tạo hóa đơn thất bại")
    }
  })

  const isPending = createInvoiceMutation.isPending

  const onSubmit = (values: InvoiceSchema) => {
    const dto: InvoiceCreateWithNoOrderDto = {
      ...values,
      invoiceNumber: values.invoiceNumber || `INV-${Date.now()}`,
      issuedAt: values.issuedAt || new Date().toISOString(),
    }
    createInvoiceMutation.mutate(dto)
  }

  useEffect(() => {
    const userId = form.watch("userId")
    const user = users.find(u => u.id === userId)
    setSelectedUser(user || null)
    if (user && user.addresses && user.addresses.length > 0) {
      const defaultAddress = user.addresses.find(addr => addr.isDefault) || user.addresses[0]
      form.setValue("shippingAddressId", defaultAddress.id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch("userId"), users])

  // Auto-fetch more users when scrolled to bottom
  useEffect(() => {
    if (userInView && hasNextUsers && !isFetchingNextUsers) {
      fetchNextUsers()
    }
  }, [userInView, hasNextUsers, isFetchingNextUsers, fetchNextUsers])

  // Auto-fetch more medicines when scrolled to bottom
  useEffect(() => {
    if (medicineInView && hasNextMedicines && !isFetchingNextMedicines) {
      fetchNextMedicines()
    }
  }, [medicineInView, hasNextMedicines, isFetchingNextMedicines, fetchNextMedicines])



  return (
    <Dialog open={open} onOpenChange={(state) => {
      form.reset()
      setSelectedUser(null)
      onOpenChange(state)
    }}>
      <DialogContent className="max-w-[95vw] w-full max-h-[95vh] overflow-y-auto">
        <DialogHeader className="p-6 pb-4">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-3"
          >
            <div className="h-8 w-8 rounded-lg bg-emerald-100/80 dark:bg-emerald-900/30 flex items-center justify-center">
              <Receipt className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold text-emerald-800 dark:text-emerald-300">
                Tạo hóa đơn mới
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Tạo hóa đơn bán hàng không có đơn hàng trước đó
              </DialogDescription>
            </div>
          </motion.div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="px-6 pb-2">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Cột trái - Thông tin cơ bản (1/3) */}
              <motion.div
                custom={1}
                variants={formSectionVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                {/* Thông tin khách hàng */}
                <InvoiceInformationForm
                  form={form}
                  users={users}
                  hasNextUsers={hasNextUsers}
                  userLoadMoreRef={userLoadMoreRef}
                  isFetchingNextUsers={isFetchingNextUsers}
                />

                {/* Phương thức thanh toán & settings */}
                <InvoicePaymentSettings
                  form={form}
                  selectedUser={selectedUser}
                />
              </motion.div>

              {/* Cột phải - Danh sách sản phẩm (2/3) */}
              <motion.div
                custom={2}
                variants={formSectionVariants}
                initial="hidden"
                animate="visible"
                className="lg:col-span-2 space-y-4"
              >
                {/* Danh sách sản phẩm */}
                <InvoiceMedicineInformation
                  form={form}
                  medicines={medicines}
                  hasNextMedicines={hasNextMedicines}
                  medicineLoadMoreRef={medicineLoadMoreRef}
                  isFetchingNextMedicines={isFetchingNextMedicines}
                />
              </motion.div>
            </div>
          </form>

          <div className="p-4 bg-muted/30 border-t border-border/50 mt-4">
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="transition-all duration-200"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                onClick={form.handleSubmit(onSubmit)}
                disabled={isPending}
                className={cn(
                  "transition-all duration-300 relative overflow-hidden",
                  isPending ? "opacity-80 cursor-not-allowed" : "",
                  "bg-emerald-600 hover:bg-emerald-700"
                )}
              >
                {isPending ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang tạo...
                  </>
                ) : (
                  <>
                    Tạo hóa đơn
                    <Sparkles className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </DialogFooter>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  )
}