import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DashboardAPI } from '@/services/v1';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { CalendarDays, ChevronDownIcon } from 'lucide-react';
import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

interface DashboardRevenueCalendarProps {
  isLoading?: boolean;
}

export function DashboardRevenueCalendar({ isLoading }: DashboardRevenueCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [open, setOpen] = useState(false);

  const chartConfig = {
    revenue: {
      label: "Doanh thu",
      color: "hsl(var(--chart-1))",
    },
  };

  // Query data từ API với TanStack Query
  const { data: revenueData = [], isLoading: isLoadingRevenueData, refetch } = useQuery({
    queryKey: ['dashboard-revenue-calendar', selectedDate.getMonth() + 1, selectedDate.getFullYear()],
    queryFn: () => {
      console.log('Fetching data for month:', selectedDate.getMonth() + 1, 'year:', selectedDate.getFullYear());
      return DashboardAPI.DashboardRevenueCalendar(selectedDate.getMonth() + 1, selectedDate.getFullYear());
    },
    staleTime: 5 * 60 * 1000, // 5 phút
    gcTime: 10 * 60 * 1000, // 10 phút
    enabled: true, // Đảm bảo query luôn được chạy
  });

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      // Đảm bảo cập nhật ngày và kích hoạt lại query
      const newDate = new Date(date);
      console.log('Selected date:', newDate, 'Month:', newDate.getMonth() + 1, 'Year:', newDate.getFullYear());
      setSelectedDate(newDate);
      setOpen(false);
      // Force refetch nếu cần
      setTimeout(() => refetch(), 100);
    }
  };

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });
  };

  const isComponentLoading = isLoading || isLoadingRevenueData;

  if (isComponentLoading) {
    return (
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-blue-600" />
            Doanh thu theo ngày
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full bg-gray-100 animate-pulse rounded"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.4 }}
    >
      <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-blue-600" />
                Doanh thu theo ngày
              </CardTitle>
              <CardDescription>
                Biểu đồ cột hiển thị doanh thu hàng ngày trong tháng {formatMonth(selectedDate)}
              </CardDescription>
            </div>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="date"
                  className="w-48 justify-between font-normal"
                >
                  {selectedDate ? formatMonth(selectedDate) : "Chọn tháng/năm"}
                  <ChevronDownIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  captionLayout="dropdown"
                  onSelect={handleDateSelect}
                  onMonthChange={(month) => {
                    console.log('Month changed:', month);
                    setSelectedDate(month);
                    setOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <ChartContainer config={chartConfig} className="max-h-[400px] w-full">
            <BarChart data={revenueData} margin={{ left: 12, right: 12 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                className="text-xs"
              />
              <YAxis
                tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                tickLine={false}
                axisLine={false}
                className="text-xs"
              />
              <ChartTooltip
                content={<ChartTooltipContent />}
                formatter={(value: number, name: string) => [
                  name === 'revenue' ? [
                    `${value.toLocaleString('vi-VN')} đ`,
                    "Doanh thu"
                  ] : [value, name]
                ]}
                labelFormatter={(label) => `Ngày ${label}`}
              />
              <Bar
                dataKey="revenue"
                fill="hsl(var(--chart-1))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>Doanh thu hàng ngày</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
} 