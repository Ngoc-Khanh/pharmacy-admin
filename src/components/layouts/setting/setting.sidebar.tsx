import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

interface SettingSidebarProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    title: string
    icon: LucideIcon
    href: string
  }[]
}

export function SettingSidebar({
  className,
  items,
  ...props
}: SettingSidebarProps) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [val, setVal] = useState(pathname ?? '/settings')

  const handleSelect = (e: string) => {
    setVal(e)
    navigate(e)
  }

  // Tìm item hiện tại để hiển thị title
  const currentItem = items.find(item => item.href === pathname)
  const currentTitle = currentItem?.title || 'Chọn cài đặt'

  return (
    <>
      {/* Mobile Select */}
      <div className='lg:hidden'>
        <Select value={val} onValueChange={handleSelect}>
          <SelectTrigger className='h-10'>
            <SelectValue placeholder={currentTitle} />
          </SelectTrigger>
          <SelectContent>
            {items.map((item) => (
              <SelectItem key={item.href} value={item.href}>
                <div className='flex items-center gap-2'>
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Desktop Navigation */}
      <div className='hidden lg:block'>
        <ScrollArea className='h-fit'>
          <nav className={cn('space-y-1', className)} {...props}>
            {items.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  pathname === item.href
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            ))}
          </nav>
        </ScrollArea>
      </div>
    </>
  )
}