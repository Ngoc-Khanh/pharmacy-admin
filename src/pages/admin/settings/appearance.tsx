import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { appearanceSettingSchema, AppearanceSettingSchema } from "@/data/schemas";
import { cn } from "@/lib/utils";
import { useTheme } from "@/providers/theme.provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Check, Monitor, Moon, Palette, Sun } from "lucide-react";
import { useForm } from "react-hook-form";

const themeOptions = [
  {
    value: "light",
    label: "Sáng",
    description: "Giao diện sáng, dễ nhìn ban ngày",
    icon: Sun,
    preview: {
      bg: "bg-white",
      cardBg: "bg-gray-50",
      elementBg: "bg-emerald-200",
      border: "border-gray-200"
    }
  },
  {
    value: "dark",
    label: "Tối",
    description: "Giao diện tối, bảo vệ mắt ban đêm",
    icon: Moon,
    preview: {
      bg: "bg-slate-900",
      cardBg: "bg-slate-800",
      elementBg: "bg-emerald-600",
      border: "border-slate-700"
    }
  },
  {
    value: "system",
    label: "Hệ thống",
    description: "Tự động theo cài đặt thiết bị",
    icon: Monitor,
    preview: {
      bg: "bg-gradient-to-br from-white to-slate-900",
      cardBg: "bg-gradient-to-br from-gray-50 to-slate-800",
      elementBg: "bg-gradient-to-r from-emerald-200 to-emerald-600",
      border: "border-gradient"
    }
  }
];

export default function AppearanceSettingPage() {
  const { theme, setTheme } = useTheme();

  const form = useForm<AppearanceSettingSchema>({
    resolver: zodResolver(appearanceSettingSchema),
    defaultValues: {
      theme: theme,
    },
  });

  const onSubmit = (data: AppearanceSettingSchema) => {
    setTheme(data.theme);
  };

  const selectedTheme = form.watch("theme");

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <div className="flex items-center gap-2">
          <Palette className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Giao diện</h1>
          <Badge variant="secondary">Cá nhân hóa</Badge>
        </div>
        <p className="text-muted-foreground">
          Tùy chỉnh giao diện dashboard theo sở thích của bạn
        </p>
      </motion.div>

      {/* Theme Selection Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Chủ đề màu sắc
            </CardTitle>
            <CardDescription>
              Chọn chủ đề phù hợp với thời gian sử dụng và sở thích cá nhân
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="theme"
                  render={({ field }) => (
                    <FormItem className="space-y-6">
                      <FormMessage />
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6"
                      >
                        {themeOptions.map((option, index) => {
                          const Icon = option.icon;
                          const isSelected = selectedTheme === option.value;
                          
                          return (
                            <motion.div
                              key={option.value}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <FormItem>
                                <FormLabel 
                                  className={cn(
                                    "cursor-pointer group relative",
                                    "[&:has([data-state=checked])>div]:ring-2 [&:has([data-state=checked])>div]:ring-primary [&:has([data-state=checked])>div]:border-primary"
                                  )}
                                >
                                  <FormControl>
                                    <RadioGroupItem 
                                      value={option.value} 
                                      className="sr-only" 
                                    />
                                  </FormControl>
                                  
                                  <motion.div 
                                    className={cn(
                                      "relative rounded-xl border-2 p-4 transition-all duration-200",
                                      "hover:border-primary/50 hover:shadow-md",
                                      "group-hover:scale-[1.02]",
                                      isSelected ? "border-primary ring-2 ring-primary/20" : "border-muted"
                                    )}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                  >
                                    {/* Selected indicator */}
                                    {isSelected && (
                                      <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-primary flex items-center justify-center"
                                      >
                                        <Check className="h-3 w-3 text-primary-foreground" />
                                      </motion.div>
                                    )}

                                    {/* Theme preview */}
                                    <div className={cn("rounded-lg p-3 mb-4", option.preview.bg)}>
                                      <div className={cn("space-y-2 rounded-md p-2", option.preview.cardBg)}>
                                        <div className="flex items-center justify-between">
                                          <div className={cn("h-2 w-16 rounded", option.preview.elementBg)} />
                                          <div className={cn("h-2 w-2 rounded-full", option.preview.elementBg)} />
                                        </div>
                                        <div className="space-y-1">
                                          <div className={cn("h-1.5 w-20 rounded", option.preview.elementBg)} />
                                          <div className={cn("h-1.5 w-12 rounded", option.preview.elementBg)} />
                                        </div>
                                        <div className="flex gap-1">
                                          <div className={cn("h-1 w-8 rounded", option.preview.elementBg)} />
                                          <div className={cn("h-1 w-6 rounded", option.preview.elementBg)} />
                                        </div>
                                      </div>
                                    </div>

                                    {/* Theme info */}
                                    <div className="space-y-2">
                                      <div className="flex items-center gap-2">
                                        <Icon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                        <span className="font-medium">{option.label}</span>
                                      </div>
                                      <p className="text-sm text-muted-foreground">
                                        {option.description}
                                      </p>
                                    </div>
                                  </motion.div>
                                </FormLabel>
                              </FormItem>
                            </motion.div>
                          );
                        })}
                      </RadioGroup>
                    </FormItem>
                  )}
                />

                {/* Submit button */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex justify-end pt-4 border-t"
                >
                  <Button 
                    type="submit" 
                    size="lg"
                    className="min-w-[120px]"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? "Đang lưu..." : "Áp dụng"}
                  </Button>
                </motion.div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Additional Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-2">
                <Palette className="h-4 w-4 text-primary" />
              </div>
              <div className="space-y-1">
                <h3 className="font-medium">Mẹo sử dụng</h3>
                <p className="text-sm text-muted-foreground">
                  Chế độ "Hệ thống" sẽ tự động chuyển đổi giữa sáng và tối theo cài đặt của thiết bị. 
                  Điều này giúp bảo vệ mắt và tiết kiệm pin.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}