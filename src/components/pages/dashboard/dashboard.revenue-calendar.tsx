import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DashboardRevenueCalendar as RevenueData } from '@/data/interfaces';
import { DashboardAPI } from '@/services/v1';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { CalendarDays, CalendarIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

interface DashboardRevenueCalendarProps {
  isLoading?: boolean;
}

export function DashboardRevenueCalendar({ isLoading }: DashboardRevenueCalendarProps) {
  const currentDate = new Date();
  const [range, setRange] = useState<DateRange | undefined>({
    from: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
    to: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0),
  });

  useEffect(() => {
    const now = new Date();
    setRange({
      from: new Date(now.getFullYear(), now.getMonth(), 1),
      to: new Date(now.getFullYear(), now.getMonth() + 1, 0),
    });
  }, []);

  const resetToCurrentMonth = () => {
    const now = new Date();
    setRange({
      from: new Date(now.getFullYear(), now.getMonth(), 1),
      to: new Date(now.getFullYear(), now.getMonth() + 1, 0),
    });
  };

  const chartConfig = {
    revenue: {
      label: "Doanh thu",
      color: "#10b981", // emerald-500
    },
  };

  const currentMonth = range?.from ? range.from.getMonth() + 1 : new Date().getMonth() + 1;
  const currentYear = range?.from ? range.from.getFullYear() : new Date().getFullYear();

  const { data: revenueData = [], isLoading: isLoadingRevenueData } = useQuery<RevenueData[]>({
    queryKey: ['dashboard-revenue-calendar', currentMonth, currentYear],
    queryFn: async () => {
      const result = await DashboardAPI.DashboardRevenueCalendar(currentMonth, currentYear);
      
      if (result?.length > 0) {
        return result.map((item: { date: string; revenue: number; orders: number }) => ({
          ...item,
          date: `${currentYear}-${String(currentMonth).padStart(2, '0')}-${item.date.split('/')[0].padStart(2, '0')}`
        }));
      }
      return result || [];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });

  const filteredData = useMemo(() => {
    if (!range?.from || !range?.to) return revenueData;
    return revenueData.filter((item: RevenueData) => {
      const itemDate = new Date(item.date);
      return itemDate >= range.from! && itemDate <= range.to!;
    });
  }, [revenueData, range]);

  const totalRevenue = useMemo(() => {
    return filteredData.reduce((acc: number, curr: RevenueData) => acc + (curr.revenue || 0), 0);
  }, [filteredData]);

  const formatDateRange = () => {
    if (range?.from && range?.to) {
      return `${range.from.toLocaleDateString('vi-VN')} - ${range.to.toLocaleDateString('vi-VN')}`;
    }
    return "Chọn khoảng thời gian";
  };

  const isComponentLoading = isLoading || isLoadingRevenueData;

  if (isComponentLoading) {
    return (
      <Card className="@container/card w-full shadow-md">
        <CardHeader className="flex-row items-center justify-between border-b">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-emerald-600" />
              Doanh thu theo ngày
            </CardTitle>
            <CardDescription>Đang tải dữ liệu doanh thu...</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-4">
          <div className="h-[250px] w-full bg-gray-100 animate-pulse rounded"></div>
        </CardContent>
      </Card>
    );
  }

  if (!filteredData || filteredData.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <Card className="@container/card w-full shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex-row items-center justify-between border-b">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-emerald-600" />
                Doanh thu theo ngày
              </CardTitle>
              <CardDescription>
                Biểu đồ cột hiển thị doanh thu hàng ngày trong khoảng thời gian được chọn
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={resetToCurrentMonth}>
                Tháng hiện tại
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-64 justify-between font-normal">
                    <CalendarIcon className="h-4 w-4" />
                    {formatDateRange()}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto overflow-hidden p-0" align="end">
                  <Calendar
                    className="w-full"
                    mode="range"
                    defaultMonth={range?.from}
                    selected={range}
                    onSelect={setRange}
                    captionLayout="dropdown"
                    fixedWeeks
                    showOutsideDays
                  />
                </PopoverContent>
              </Popover>
            </div>
          </CardHeader>
          <CardContent className="px-4 py-8">
            <div className="flex flex-col items-center justify-center h-[250px] text-center">
              <CalendarDays className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Không có dữ liệu</h3>
              <p className="text-gray-500">Không có dữ liệu doanh thu cho khoảng thời gian đã chọn.</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.4 }}
    >
      <Card className="@container/card w-full shadow-md hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="flex-row items-center justify-between border-b">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-emerald-600" />
              Doanh thu theo ngày
            </CardTitle>
            <CardDescription>
              Biểu đồ cột hiển thị doanh thu hàng ngày trong khoảng thời gian được chọn
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={resetToCurrentMonth}>
              Tháng hiện tại
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-64 justify-center font-normal">
                  {formatDateRange()}
                  <CalendarIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto overflow-hidden p-0" align="end">
                <Calendar
                  className="w-full"
                  mode="range"
                  defaultMonth={range?.from}
                  selected={range}
                  onSelect={setRange}
                  captionLayout="dropdown"
                  fixedWeeks
                  showOutsideDays
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardHeader>
        <CardContent className="px-4 py-8">
          <ChartContainer config={chartConfig} className="aspect-auto h-[300px] w-full">
            <BarChart accessibilityLayer data={filteredData} margin={{ left: 12, right: 12 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={20}
                tickFormatter={(value: string) => {
                  return new Date(value).toLocaleDateString("vi-VN", { day: "numeric" });
                }}
              />
              <YAxis
                tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                tickLine={false}
                axisLine={false}
                className="text-xs"
              />
              <ChartTooltip
                formatter={(value: number) => [`${value.toLocaleString('vi-VN')} đ`, "Doanh thu"]}
                labelFormatter={(label: string) => {
                  return new Date(label).toLocaleDateString("vi-VN", {
                    month: "short",
                    day: "numeric", 
                    year: "numeric",
                  });
                }}
              />
              <Bar dataKey="revenue" fill="#10b981" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="border-t">
          <div className="text-sm pt-5">
            Tổng doanh thu trong khoảng thời gian đã chọn:{" "}
            <span className="font-semibold text-emerald-600">
              {totalRevenue.toLocaleString('vi-VN')} đ
            </span>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
} 