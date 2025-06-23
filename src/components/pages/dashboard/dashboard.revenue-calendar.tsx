import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { useState, useEffect } from 'react';

interface RevenueCalendarData {
  date: string;
  revenue: number;
  orders: number;
}

interface DashboardRevenueCalendarProps {
  isLoading?: boolean;
}

export function DashboardRevenueCalendar({ isLoading }: DashboardRevenueCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [revenueData, setRevenueData] = useState<RevenueCalendarData[]>([]);

  const chartConfig = {
    revenue: {
      label: "Doanh thu",
      color: "hsl(var(--chart-1))",
    },
  };

  // Generate sample data for the selected month
  useEffect(() => {
    const generateData = (date: Date) => {
      const year = date.getFullYear();
      const month = date.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      
      const data: RevenueCalendarData[] = [];
      
      for (let day = 1; day <= daysInMonth; day++) {
        const currentDate = new Date(year, month, day);
        const dateStr = currentDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
        
        // Generate random revenue data (replace with actual API call)
        const revenue = Math.floor(Math.random() * 50000000) + 10000000; // 10M - 60M VND
        const orders = Math.floor(Math.random() * 20) + 5; // 5-25 orders
        
        data.push({
          date: dateStr,
          revenue,
          orders,
        });
      }
      
      return data;
    };

    setRevenueData(generateData(selectedDate));
  }, [selectedDate]);

  const goToPreviousMonth = () => {
    setSelectedDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setSelectedDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const goToCurrentMonth = () => {
    setSelectedDate(new Date());
  };

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });
  };

  if (isLoading) {
    return (
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
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
                <Calendar className="h-5 w-5 text-blue-600" />
                Doanh thu theo ngày
              </CardTitle>
              <CardDescription>
                Biểu đồ cột hiển thị doanh thu hàng ngày trong tháng {formatMonth(selectedDate)}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPreviousMonth}
              >
                ← Tháng trước
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={goToCurrentMonth}
              >
                Tháng này
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={goToNextMonth}
              >
                Tháng sau →
              </Button>
            </div>
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