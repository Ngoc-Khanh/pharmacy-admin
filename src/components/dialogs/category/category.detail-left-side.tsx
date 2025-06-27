import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CategoryDetailResponse, MedicineResponse } from "@/data/interfaces";
import { cn, formatDate } from "@/lib/utils";
import { Calendar, FileText, Hash, Pill, Shield, ShieldCheck } from "lucide-react";
import { motion } from 'motion/react';

interface CategoryDetailLeftSideProps {
  categoryDetail: CategoryDetailResponse;
  getMedicines: () => MedicineResponse[];
}

export function CategoryDetailLeftSide({ categoryDetail, getMedicines }: CategoryDetailLeftSideProps) {
  return (
    <div className="flex-1 flex min-w-0">
      {/* Basic Information */}
      <div className="flex-1 p-6 border-r overflow-hidden">
        <ScrollArea className="h-full pr-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Status Badge */}
            <div className="flex items-center gap-2">
              <Badge
                variant={categoryDetail.isActive ? "default" : "secondary"}
                className={cn(
                  "px-3 py-1 text-sm font-medium",
                  categoryDetail.isActive
                    ? "bg-green-100 text-green-700 border-green-200"
                    : "bg-gray-100 text-gray-700 border-gray-200"
                )}
              >
                {categoryDetail.isActive ? (
                  <ShieldCheck className="h-3 w-3 mr-1" />
                ) : (
                  <Shield className="h-3 w-3 mr-1" />
                )}
                {categoryDetail.isActive ? "Đang hoạt động" : "Tạm dừng"}
              </Badge>
            </div>

            {/* Basic Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Thông tin cơ bản</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-start gap-3">
                    <Hash className="h-4 w-4 text-muted-foreground mt-1" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-muted-foreground">ID</p>
                      <p className="text-sm font-mono bg-muted px-2 py-1 rounded">
                        {categoryDetail.id}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <FileText className="h-4 w-4 text-muted-foreground mt-1" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-muted-foreground">Tên danh mục</p>
                      <p className="text-base font-semibold">{categoryDetail.title}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <FileText className="h-4 w-4 text-muted-foreground mt-1" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-muted-foreground">Slug</p>
                      <p className="text-sm font-mono bg-muted px-2 py-1 rounded">
                        {categoryDetail.slug}
                      </p>
                    </div>
                  </div>

                  {categoryDetail.description && (
                    <div className="flex items-start gap-3">
                      <FileText className="h-4 w-4 text-muted-foreground mt-1" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-muted-foreground">Mô tả</p>
                        <p className="text-sm leading-relaxed">{categoryDetail.description}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Timestamps */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Thông tin thời gian</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground mt-1" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">Ngày tạo</p>
                    <p className="text-sm">{formatDate(categoryDetail.createdAt)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground mt-1" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">Cập nhật lần cuối</p>
                    <p className="text-sm">{formatDate(categoryDetail.updatedAt)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Thống kê</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Pill className="h-4 w-4 text-teal-600" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Tổng số thuốc</p>
                    <p className="text-2xl font-bold text-teal-600">
                      {getMedicines().length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </ScrollArea>
      </div>
    </div>
  );
}