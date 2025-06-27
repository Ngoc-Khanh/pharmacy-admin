import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MedicineResponse } from "@/data/interfaces";
import { AlertTriangle, BarChart3, Box, Calendar, Clock, DollarSign, FileText, Heart, MessageSquare, Package, Pill, Shield, Star, Tag, TrendingUp, Users } from "lucide-react";
import { motion } from 'motion/react';
import { useState } from "react";

interface MedicineDetailContentProps {
  medicine: MedicineResponse;
}

export function MedicineDetailContent({ medicine }: MedicineDetailContentProps) {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <motion.div
      className="md:col-span-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
    >
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start bg-white dark:bg-slate-800 p-1 h-12 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700/30 mb-5">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white dark:data-[state=active]:from-blue-600 dark:data-[state=active]:to-purple-600 data-[state=active]:border-none rounded-lg h-10 transition-all duration-200"
          >
            Tổng quan
          </TabsTrigger>
          <TabsTrigger
            value="variants"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white dark:data-[state=active]:from-blue-600 dark:data-[state=active]:to-purple-600 data-[state=active]:border-none rounded-lg h-10 transition-all duration-200"
          >
            Biến thể
          </TabsTrigger>
          <TabsTrigger
            value="sales"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white dark:data-[state=active]:from-blue-600 dark:data-[state=active]:to-purple-600 data-[state=active]:border-none rounded-lg h-10 transition-all duration-200"
          >
            Số liệu bán hàng
          </TabsTrigger>
          {/* <TabsTrigger
            value="reviews"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white dark:data-[state=active]:from-blue-600 dark:data-[state=active]:to-purple-600 data-[state=active]:border-none rounded-lg h-10 transition-all duration-200"
          >
            Đánh giá
          </TabsTrigger> */}
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 pt-0">
          <Card className="border-none bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-shadow duration-300 rounded-xl overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex flex-col space-y-1.5">
                <CardTitle className="text-2xl font-bold flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 dark:from-blue-600 dark:to-purple-600 flex items-center justify-center shadow-sm">
                    <Pill className="h-5 w-5 text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-200 dark:to-white bg-clip-text text-transparent">
                    {medicine?.name || 'Thuốc không xác định'}
                  </span>
                </CardTitle>
                <CardDescription className="text-sm text-slate-500 dark:text-slate-400 ml-[52px]">
                  ID: <span className="font-mono">{medicine?.id || 'N/A'}</span>
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-lg font-medium flex items-center gap-2 text-slate-700 dark:text-slate-200">
                  <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Mô tả sản phẩm
                </h3>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-lg border border-slate-100 dark:border-slate-700/30">
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                    {medicine?.description || 'Không có mô tả cho sản phẩm này.'}
                  </p>
                </div>
              </div>

              <Separator className="bg-slate-200 dark:bg-slate-700/50" />

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="text-lg font-medium flex items-center gap-2 text-slate-700 dark:text-slate-200">
                    <Tag className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    Danh mục
                  </h3>
                  <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/80 rounded-lg border border-slate-100 dark:border-slate-700/30">
                    <Avatar className="h-10 w-10 rounded-lg">
                      <AvatarFallback className="rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 text-white dark:from-blue-600 dark:to-purple-600 shadow-sm">
                        {medicine?.category?.title?.substring(0, 2).toUpperCase() || 'BR'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-slate-700 dark:text-slate-200">
                      {medicine?.category?.title || 'Danh mục không xác định'}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-medium flex items-center gap-2 text-slate-700 dark:text-slate-200">
                    <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    Loại thuốc
                  </h3>
                  <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/80 rounded-lg border border-slate-100 dark:border-slate-700/30">
                    <Avatar className="h-10 w-10 rounded-lg">
                      <AvatarFallback className="rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 text-white dark:from-amber-600 dark:to-orange-600 shadow-sm">
                        {medicine?.details?.ingredients?.substring(0, 2).toUpperCase() || 'MF'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-slate-700 dark:text-slate-200">
                      {medicine?.details?.ingredients || 'Không có thông tin'}
                    </span>
                  </div>
                </div>
              </div>

              <Separator className="bg-slate-200 dark:bg-slate-700/50" />

              <div className="space-y-3">
                <h3 className="text-lg font-medium flex items-center gap-2 text-slate-700 dark:text-slate-200">
                  <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Thống kê
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <Card className="border border-slate-100 dark:border-slate-700/30 bg-slate-50 dark:bg-slate-800/50 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                          <Star className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        </div>
                        <span className="text-sm text-slate-600 dark:text-slate-300">Đánh giá</span>
                      </div>
                      <span className="font-bold text-amber-600 dark:text-amber-400">{medicine?.ratings?.star || 0}</span>
                    </CardContent>
                  </Card>
                  <Card className="border border-slate-100 dark:border-slate-700/30 bg-slate-50 dark:bg-slate-800/50 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                          <Heart className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                        </div>
                        <span className="text-sm text-slate-600 dark:text-slate-300">Thích</span>
                      </div>
                      <span className="font-bold text-rose-600 dark:text-rose-400">{medicine?.ratings?.liked || 0}</span>
                    </CardContent>
                  </Card>
                  <Card className="border border-slate-100 dark:border-slate-700/30 bg-slate-50 dark:bg-slate-800/50 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <MessageSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="text-sm text-slate-600 dark:text-slate-300">Đánh giá</span>
                      </div>
                      <span className="font-bold text-blue-600 dark:text-blue-400">{medicine?.ratings?.reviewCount || 0}</span>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Variants Tab */}
        <TabsContent value="variants" className="pt-0">
          <Card className="border-none bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-shadow duration-300 rounded-xl overflow-hidden">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Box className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Biến thể sản phẩm
              </CardTitle>
              <CardDescription>Quản lý các loại, kích thước và đóng gói của sản phẩm này</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Thông tin đóng gói */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2 text-slate-700 dark:text-slate-200">
                  <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Thông tin đóng gói
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-lg border border-slate-100 dark:border-slate-700/30">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-300">Đơn vị</span>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                        Viên
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-lg border border-slate-100 dark:border-slate-700/30">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-300">Hạn sử dụng</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        Hết hạn
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="bg-slate-200 dark:bg-slate-700/50" />

              {/* Thông tin kho */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2 text-slate-700 dark:text-slate-200">
                  <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Thông tin kho
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <Card className="border border-slate-100 dark:border-slate-700/30 bg-slate-50 dark:bg-slate-800/50 rounded-lg overflow-hidden">
                    <CardContent className="p-4 text-center">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 mx-auto flex items-center justify-center mb-2">
                        <Package className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300">Tồn kho</p>
                      <p className="font-bold text-blue-600 dark:text-blue-400">{medicine?.variants?.quantity || 0}</p>
                    </CardContent>
                  </Card>
                  <Card className="border border-slate-100 dark:border-slate-700/30 bg-slate-50 dark:bg-slate-800/50 rounded-lg overflow-hidden">
                    <CardContent className="p-4 text-center">
                      <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 mx-auto flex items-center justify-center mb-2">
                        <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300">Ngưỡng tối thiểu</p>
                      <p className="font-bold text-orange-600 dark:text-orange-400">10</p>
                    </CardContent>
                  </Card>
                  <Card className="border border-slate-100 dark:border-slate-700/30 bg-slate-50 dark:bg-slate-800/50 rounded-lg overflow-hidden">
                    <CardContent className="p-4 text-center">
                      <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 mx-auto flex items-center justify-center mb-2">
                        <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300">Đã bán</p>
                      <p className="font-bold text-green-600 dark:text-green-400">142</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sales Tab */}
        <TabsContent value="sales" className="pt-0">
          <Card className="border-none bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-shadow duration-300 rounded-xl overflow-hidden">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Số liệu bán hàng
              </CardTitle>
              <CardDescription>Xem thống kê và doanh số bán hàng cho sản phẩm này</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Doanh thu */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2 text-slate-700 dark:text-slate-200">
                  <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Doanh thu
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <Card className="border border-slate-100 dark:border-slate-700/30 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg overflow-hidden">
                    <CardContent className="p-4 text-center">
                      <p className="text-sm text-slate-600 dark:text-slate-300">Hôm nay</p>
                      <p className="font-bold text-blue-600 dark:text-blue-400 text-lg">2.400.000đ</p>
                      <p className="text-xs text-green-600 dark:text-green-400">+12%</p>
                    </CardContent>
                  </Card>
                  <Card className="border border-slate-100 dark:border-slate-700/30 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg overflow-hidden">
                    <CardContent className="p-4 text-center">
                      <p className="text-sm text-slate-600 dark:text-slate-300">Tuần này</p>
                      <p className="font-bold text-green-600 dark:text-green-400 text-lg">18.500.000đ</p>
                      <p className="text-xs text-green-600 dark:text-green-400">+8%</p>
                    </CardContent>
                  </Card>
                  <Card className="border border-slate-100 dark:border-slate-700/30 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg overflow-hidden">
                    <CardContent className="p-4 text-center">
                      <p className="text-sm text-slate-600 dark:text-slate-300">Tháng này</p>
                      <p className="font-bold text-purple-600 dark:text-purple-400 text-lg">76.200.000đ</p>
                      <p className="text-xs text-green-600 dark:text-green-400">+15%</p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Separator className="bg-slate-200 dark:bg-slate-700/50" />

              {/* Số lượng bán */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2 text-slate-700 dark:text-slate-200">
                  <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Số lượng bán
                </h3>
                <div className="grid grid-cols-4 gap-4">
                  <Card className="border border-slate-100 dark:border-slate-700/30 bg-slate-50 dark:bg-slate-800/50 rounded-lg overflow-hidden">
                    <CardContent className="p-4 text-center">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 mx-auto flex items-center justify-center mb-2">
                        <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300">Hôm nay</p>
                      <p className="font-bold text-blue-600 dark:text-blue-400">24</p>
                    </CardContent>
                  </Card>
                  <Card className="border border-slate-100 dark:border-slate-700/30 bg-slate-50 dark:bg-slate-800/50 rounded-lg overflow-hidden">
                    <CardContent className="p-4 text-center">
                      <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 mx-auto flex items-center justify-center mb-2">
                        <Calendar className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300">Tuần này</p>
                      <p className="font-bold text-green-600 dark:text-green-400">185</p>
                    </CardContent>
                  </Card>
                  <Card className="border border-slate-100 dark:border-slate-700/30 bg-slate-50 dark:bg-slate-800/50 rounded-lg overflow-hidden">
                    <CardContent className="p-4 text-center">
                      <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 mx-auto flex items-center justify-center mb-2">
                        <BarChart3 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300">Tháng này</p>
                      <p className="font-bold text-purple-600 dark:text-purple-400">762</p>
                    </CardContent>
                  </Card>
                  <Card className="border border-slate-100 dark:border-slate-700/30 bg-slate-50 dark:bg-slate-800/50 rounded-lg overflow-hidden">
                    <CardContent className="p-4 text-center">
                      <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 mx-auto flex items-center justify-center mb-2">
                        <TrendingUp className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300">Tổng cộng</p>
                      <p className="font-bold text-orange-600 dark:text-orange-400">3.421</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reviews Tab */}
        <TabsContent value="reviews" className="pt-0">
          <Card className="border-none bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-shadow duration-300 rounded-xl overflow-hidden">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Đánh giá từ khách hàng
              </CardTitle>
              <CardDescription>Xem và quản lý đánh giá của khách hàng cho sản phẩm này</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Tổng quan đánh giá */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2 text-slate-700 dark:text-slate-200">
                  <Star className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Tổng quan đánh giá
                </h3>
                <div className="grid grid-cols-5 gap-4">
                  <Card className="border border-slate-100 dark:border-slate-700/30 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-lg overflow-hidden">
                    <CardContent className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300">5 sao</p>
                      <p className="font-bold text-yellow-600 dark:text-yellow-400">45</p>
                    </CardContent>
                  </Card>
                  <Card className="border border-slate-100 dark:border-slate-700/30 bg-slate-50 dark:bg-slate-800/50 rounded-lg overflow-hidden">
                    <CardContent className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1 mb-2">
                        {[1, 2, 3, 4].map((star) => (
                          <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        ))}
                        <Star className="h-3 w-3 text-gray-300" />
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300">4 sao</p>
                      <p className="font-bold text-slate-600 dark:text-slate-400">12</p>
                    </CardContent>
                  </Card>
                  <Card className="border border-slate-100 dark:border-slate-700/30 bg-slate-50 dark:bg-slate-800/50 rounded-lg overflow-hidden">
                    <CardContent className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1 mb-2">
                        {[1, 2, 3].map((star) => (
                          <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        ))}
                        {[4, 5].map((star) => (
                          <Star key={star} className="h-3 w-3 text-gray-300" />
                        ))}
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300">3 sao</p>
                      <p className="font-bold text-slate-600 dark:text-slate-400">3</p>
                    </CardContent>
                  </Card>
                  <Card className="border border-slate-100 dark:border-slate-700/30 bg-slate-50 dark:bg-slate-800/50 rounded-lg overflow-hidden">
                    <CardContent className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1 mb-2">
                        {[1, 2].map((star) => (
                          <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        ))}
                        {[3, 4, 5].map((star) => (
                          <Star key={star} className="h-3 w-3 text-gray-300" />
                        ))}
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300">2 sao</p>
                      <p className="font-bold text-slate-600 dark:text-slate-400">1</p>
                    </CardContent>
                  </Card>
                  <Card className="border border-slate-100 dark:border-slate-700/30 bg-slate-50 dark:bg-slate-800/50 rounded-lg overflow-hidden">
                    <CardContent className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1 mb-2">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        {[2, 3, 4, 5].map((star) => (
                          <Star key={star} className="h-3 w-3 text-gray-300" />
                        ))}
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300">1 sao</p>
                      <p className="font-bold text-slate-600 dark:text-slate-400">0</p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Separator className="bg-slate-200 dark:bg-slate-700/50" />

              {/* Đánh giá gần đây */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2 text-slate-700 dark:text-slate-200">
                  <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Đánh giá gần đây
                </h3>
                <div className="space-y-4">
                  {/* Review item 1 */}
                  <Card className="border border-slate-100 dark:border-slate-700/30 bg-slate-50 dark:bg-slate-800/50 rounded-lg overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-sm">
                              NT
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-slate-700 dark:text-slate-200 text-sm">Nguyễn Thị Lan</p>
                            <div className="flex items-center gap-1 mt-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs">2 ngày trước</Badge>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        Thuốc rất hiệu quả, uống xong cảm thấy khỏe hơn nhiều. Đóng gói cẩn thận, giao hàng nhanh chóng.
                      </p>
                    </CardContent>
                  </Card>

                  {/* Review item 2 */}
                  <Card className="border border-slate-100 dark:border-slate-700/30 bg-slate-50 dark:bg-slate-800/50 rounded-lg overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-gradient-to-br from-green-500 to-emerald-500 text-white text-sm">
                              LM
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-slate-700 dark:text-slate-200 text-sm">Lê Minh Hoàng</p>
                            <div className="flex items-center gap-1 mt-1">
                              {[1, 2, 3, 4].map((star) => (
                                <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              ))}
                              <Star className="h-3 w-3 text-gray-300" />
                            </div>
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs">1 tuần trước</Badge>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        Chất lượng tốt, giá cả hợp lý. Tuy nhiên giao hàng hơi chậm so với dự kiến.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}