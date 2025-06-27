import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StockStatus } from "@/data/enum";
import { MedicineResponse } from "@/data/interfaces";
import { cn, formatCurrency } from "@/lib/utils";
import { Eye, Pill, Star } from "lucide-react";
import { motion } from 'motion/react';

interface CategoryDetailRightSideProps {
  getMedicines: () => MedicineResponse[];
}

export function CategoryDetailRightSide({ getMedicines }: CategoryDetailRightSideProps) {
  return (
    <div className="w-1/3 border-l flex flex-col min-h-0">
      <div className="p-4 border-b bg-muted/50 flex-shrink-0">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Pill className="h-5 w-5 text-teal-600" />
          Danh sách thuốc ({getMedicines().length})
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Các sản phẩm thuộc danh mục này
        </p>
      </div>

      <ScrollArea className="flex-1 min-h-0">
        <div className="p-4 space-y-3">
          {getMedicines().length > 0 ? (
            getMedicines().map((medicine, index) => (
              <motion.div
                key={medicine.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-3">
                    <div className="flex gap-2">
                      {/* Medicine Image */}
                      <div className="w-12 h-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
                        <img
                          src={medicine.thumbnail.url}
                          alt={medicine.thumbnail.alt}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder-medicine.png';
                          }}
                        />
                      </div>

                      {/* Medicine Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-xs leading-tight line-clamp-2 mb-1">
                          {medicine.name}
                        </h4>

                        {/* Price */}
                        <div className="mb-1">
                          <span className="text-xs font-semibold text-teal-600">
                            {formatCurrency(medicine.variants.price)}
                          </span>
                          {medicine.variants.originalPrice &&
                            medicine.variants.originalPrice > medicine.variants.price && (
                              <span className="text-xs text-muted-foreground line-through ml-1 block">
                                {formatCurrency(medicine.variants.originalPrice)}
                              </span>
                            )}
                        </div>

                        {/* Stock Status */}
                        <div className="mb-1">
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-xs py-0 px-1 h-5",
                              medicine.variants.stockStatus === StockStatus.IN_STOCK
                                ? "border-green-200 text-green-700"
                                : medicine.variants.stockStatus === StockStatus.PRE_ORDER
                                  ? "border-yellow-200 text-yellow-700"
                                  : "border-red-200 text-red-700"
                            )}
                          >
                            {medicine.variants.stockStatus === StockStatus.IN_STOCK && "Còn hàng"}
                            {medicine.variants.stockStatus === StockStatus.PRE_ORDER && "Đặt hàng"}
                            {medicine.variants.stockStatus === StockStatus.OUT_OF_STOCK && "Hết hàng"}
                          </Badge>
                        </div>

                        {/* Ratings */}
                        {medicine.ratings && (
                          <div className="flex items-center gap-1">
                            <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs text-muted-foreground">
                              {medicine.ratings.star.toFixed(1)} ({medicine.ratings.reviewCount || 0})
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-2 pt-2 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-xs h-7"
                      >
                        <Eye className="h-2.5 w-2.5 mr-1" />
                        Xem chi tiết
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-8">
              <Pill className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">
                Chưa có thuốc nào trong danh mục này
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}