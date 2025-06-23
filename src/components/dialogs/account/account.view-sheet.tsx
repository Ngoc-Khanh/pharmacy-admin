import { userTypes } from "@/components/table/account";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { AccountStatus } from "@/data/enum";
import { UserAddress, UserResponse } from "@/data/interfaces";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Mail, MapPin, Phone, Star, User, UserCircle } from "lucide-react";
import { memo } from "react";

interface Props {
  currentAccount?: UserResponse;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Ghi nhớ thẻ địa chỉ để ngăn chặn việc render lại không cần thiết
const AddressCard = memo(({ address, index }: { address: UserAddress; index: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: index * 0.05 }}
    className="p-4 bg-background m-2 rounded-lg shadow-sm hover:shadow-md transition-all border border-border/40 hover:border-primary/20"
  >
    <div className="flex justify-between items-start">
      <div className="flex-1 pr-3">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-medium text-sm">{address.name || `Địa chỉ ${index + 1}`}</p>
          {address.isDefault && (
            <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-xs h-5 px-2 py-0 flex items-center gap-1 border-none">
              <Star className="h-3 w-3 fill-emerald-500 dark:fill-emerald-400" /> Mặc định
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-2">{address.addressLine1}</p>
        {address.addressLine2 && (
          <p className="text-xs text-muted-foreground">{address.addressLine2}</p>
        )}
        <p className="text-xs text-muted-foreground">
          {[address.city, address.state, address.postalCode].filter(Boolean).join(", ")}
        </p>
        <p className="text-xs text-muted-foreground">{address.country}</p>
        <div className="flex items-center gap-2 mt-2 bg-muted/30 px-2 py-1 rounded-md">
          <Phone className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
          <p className="text-xs font-medium">{address.phone}</p>
        </div>
      </div>
    </div>
  </motion.div>
));

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4 }
  }
};

// Status badge helper
const getStatusBadge = (status: string) => {
  switch(status) {
    case AccountStatus.ACTIVE:
      return {
        label: 'Hoạt động',
        className: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50'
      };
    case AccountStatus.SUSPENDED:
      return {
        label: 'Tạm dừng',
        className: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-900/50'
      };
    default:
      return {
        label: 'Đang chờ',
        className: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200 dark:border-rose-900/50'
      };
  }
};

// Role badge helper - sử dụng userTypes từ table
const getRoleBadge = (role: string) => {
  const userType = userTypes.find(type => type.value === role);
  if (userType) {
    return {
      label: userType.label,
      className: userType.color,
      icon: userType.icon
    };
  }
  
  // Fallback nếu không tìm thấy
  return {
    label: 'Khách hàng',
    className: 'text-amber-600 dark:text-amber-400 bg-amber-50/70 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30',
    icon: UserCircle
  };
};

// Ghi nhớ toàn bộ thành phần sheet để ngăn chặn việc render lại không cần thiết
export const ViewAccountSheet = memo(function ViewAccountSheet({ currentAccount, open, onOpenChange }: Props) {
  if (!currentAccount) return null;
  
  const statusBadge = getStatusBadge(currentAccount.status);
  const roleBadge = getRoleBadge(currentAccount.role);
  const createdAt = currentAccount.createdAt ? new Date(currentAccount.createdAt) : null;
  const RoleIcon = roleBadge.icon;
  
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-xl w-full p-0 overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="px-6 py-4 border-b">
            <SheetHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => onOpenChange(false)}
                  className="h-8 w-8 rounded-full"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <SheetTitle className="text-xl font-semibold flex items-center gap-1.5">
                    <User className="h-5 w-5 text-emerald-500" />
                    <span>
                      {`${currentAccount.firstname} ${currentAccount.lastname}`}
                    </span>
                  </SheetTitle>
                  <SheetDescription className="mt-1">
                    <div className="flex items-center gap-2">
                      <UserCircle className="h-3.5 w-3.5 text-slate-400" />
                      <span className="text-xs text-slate-500">
                        @{currentAccount.username}
                      </span>
                      {createdAt && (
                        <>
                          <span className="text-xs text-slate-400">•</span>
                          <Clock className="h-3.5 w-3.5 text-slate-400" />
                          <span className="text-xs text-slate-500">
                            Tham gia {createdAt.toLocaleDateString('vi-VN')}
                          </span>
                        </>
                      )}
                    </div>
                  </SheetDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={`px-2 py-1 text-xs ${statusBadge.className}`}>
                  {statusBadge.label}
                </Badge>
                <Badge variant="outline" className={`px-2 py-1 text-xs flex items-center gap-1 ${roleBadge.className}`}>
                  <RoleIcon className="h-3 w-3" />
                  {roleBadge.label}
                </Badge>
              </div>
            </SheetHeader>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {/* User Profile Card */}
              <motion.div 
                variants={itemVariants}
                className="bg-gradient-to-br from-emerald-50 to-cyan-50 dark:from-emerald-900/10 dark:to-cyan-900/10 rounded-lg p-4 border border-emerald-100/50 dark:border-emerald-800/30 shadow-sm"
              >
                <h3 className="text-sm font-medium text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5 mb-3">
                  <UserCircle className="h-4 w-4" />
                  Thông tin cá nhân
                </h3>

                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 border-4 border-white/90 dark:border-gray-800/90 shadow-md">
                    {currentAccount.profileImage ? (
                      <AvatarImage
                        src={currentAccount.profileImage.url}
                        alt={`${currentAccount.firstname} ${currentAccount.lastname}`}
                        className="object-cover"
                      />
                    ) : null}
                    <AvatarFallback className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-lg font-bold">
                      {`${currentAccount.firstname?.[0] || ''}${currentAccount.lastname?.[0] || ''}`.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {`${currentAccount.firstname} ${currentAccount.lastname}`}
                    </h4>
                    <p className="text-sm text-muted-foreground">@{currentAccount.username}</p>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline" className={`px-2 py-1 text-xs ${statusBadge.className}`}>
                        {statusBadge.label}
                      </Badge>
                      <Badge variant="outline" className={`px-2 py-1 text-xs flex items-center gap-1 ${roleBadge.className}`}>
                        <RoleIcon className="h-3 w-3" />
                        {roleBadge.label}
                      </Badge>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Contact Information */}
              <motion.div 
                variants={itemVariants}
                className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-slate-200 dark:border-slate-800 shadow-sm"
              >
                <h3 className="text-sm font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mb-3">
                  <Mail className="h-4 w-4 text-slate-500" />
                  Thông tin liên hệ
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-emerald-100/60 dark:bg-emerald-900/30 p-2 rounded-full flex items-center justify-center shrink-0">
                      <Mail className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-muted-foreground mb-1">Email</p>
                      <p className="text-sm font-medium truncate">{currentAccount.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-emerald-100/60 dark:bg-emerald-900/30 p-2 rounded-full flex items-center justify-center shrink-0">
                      <Phone className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-muted-foreground mb-1">Số điện thoại</p>
                      <p className="text-sm font-medium">{currentAccount.phone || "—"}</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Addresses */}
              <motion.div 
                variants={itemVariants}
                className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-slate-200 dark:border-slate-800 shadow-sm"
              >
                <h3 className="text-sm font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mb-3">
                  <MapPin className="h-4 w-4 text-slate-500" />
                  Địa chỉ ({currentAccount.addresses?.length || 0})
                </h3>

                {currentAccount.addresses && currentAccount.addresses.length > 0 ? (
                  <div className="p-1 max-h-[280px] overflow-y-auto will-change-transform scrollbar-thin scrollbar-thumb-emerald-200 dark:scrollbar-thumb-emerald-800/30 scrollbar-track-transparent">
                    {/* Chỉ render địa chỉ có thể nhìn thấy */}
                    {currentAccount.addresses.slice(0, 10).map((address, index) => (
                      <AddressCard key={address.id || index} address={address} index={index} />
                    ))}
                    {currentAccount.addresses.length > 10 && (
                      <div className="text-center p-2 text-xs text-muted-foreground">
                        Và {currentAccount.addresses.length - 10} địa chỉ khác...
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <div className="mx-auto w-12 h-12 rounded-full bg-emerald-50/70 dark:bg-emerald-950/30 flex items-center justify-center mb-3">
                      <MapPin className="h-6 w-6 text-emerald-400/50 dark:text-emerald-500/40" />
                    </div>
                    <p className="text-sm text-muted-foreground">Không tìm thấy địa chỉ</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">Người dùng chưa thêm địa chỉ nào</p>
                  </div>
                )}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
});
