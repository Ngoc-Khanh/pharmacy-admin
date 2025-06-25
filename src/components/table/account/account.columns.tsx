import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { UserResponse } from "@/data/interfaces";
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { motion, Variants } from 'motion/react';
import { statusTypes, userTypes } from ".";
import { AccountRowActions } from "./account.row-actions";

const hoverAnimation = {
  initial: { y: 0 },
  hover: { y: -2, transition: { duration: 0.2, ease: "easeOut" } }
};

const scaleAnimation = {
  initial: { scale: 1 },
  hover: { scale: 1.08, transition: { duration: 0.2, ease: "easeOut" } },
  tap: { scale: 0.97, transition: { duration: 0.1, ease: "easeOut" } }
};

export const accountColumns: ColumnDef<UserResponse>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "profileImage",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Avatar" />
    ),
    cell: ({ row }) => {
      const { firstname, lastname } = row.original;
      const initials = `${firstname?.[0] || ''}${lastname?.[0] || ''}`.toUpperCase();
      const profileImage = row.getValue("profileImage") as { url: string, publicId: string, alt: string } | undefined;

      const getImageUrl = (url: string | undefined) => {
        if (!url) return undefined;
        if (url.startsWith('http://') || url.startsWith('https://')) return url;
        if (url.startsWith('./')) return url.replace('./', '/');
        if (url.startsWith('avatars/')) return `/${url}`;
        return url;
      };

      return (
        <motion.div
          initial="initial"
          whileHover="hover"
          whileTap="tap"
          variants={scaleAnimation as Variants}
          className="flex items-center justify-center py-1"
        >
          <Avatar className="h-10 w-10 ring-2 ring-cyan-100/50 dark:ring-cyan-700/30 shadow-md">
            <AvatarImage
              src={getImageUrl(profileImage?.url)}
              alt={profileImage?.alt}
              className="object-cover"
            />
            <AvatarFallback className="bg-gradient-to-br from-cyan-50 to-cyan-100 text-cyan-700 font-medium dark:from-cyan-900/40 dark:to-cyan-800/40 dark:text-cyan-300">
              {initials}
            </AvatarFallback>
          </Avatar>
        </motion.div>
      );
    },
    meta: {
      className: `w-16`,
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    id: "fullname",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tên" />
    ),
    cell: ({ row }) => {
      const { firstname, lastname } = row.original;
      const fullName = `${firstname} ${lastname}`;
      return (
        <div className="group py-1.5">
          <div className="font-medium tracking-tight group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
            {fullName}
          </div>
          <div className="text-xs text-muted-foreground/80 truncate max-w-[180px] opacity-80 font-normal">
            {row.original.username}
          </div>
        </div>
      );
    },
    meta: {
      className: `w-48`,
    },
    enableHiding: true,
    enableSorting: true,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => (
      <div className="text-muted-foreground hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors duration-200 py-1.5">
        {row.getValue("email")}
      </div>
    ),
    meta: {
      className: `w-48`,
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Điện thoại" />
    ),
    cell: ({ row }) => (
      <div className="text-muted-foreground py-1.5 font-mono text-sm">
        {row.getValue("phone") || "—"}
      </div>
    ),
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "addresses",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Địa chỉ" />
    ),
    cell: ({ row }) => {
      const addresses = row.getValue("addresses");
      const addressCount = Array.isArray(addresses) ? addresses.length : 0;
      return (
        <motion.div
          initial="initial"
          whileHover="hover"
          variants={hoverAnimation as Variants}
          className="py-1"
        >
          <Badge
            variant="outline"
            className="cursor-pointer hover:bg-cyan-50 hover:text-cyan-700 dark:hover:bg-cyan-900/20 dark:hover:text-cyan-400 transition-all duration-200 border-cyan-200/70 dark:border-cyan-800/30 px-3 py-0.5 text-xs font-medium"
          >
            {addressCount} địa chỉ{addressCount !== 1 ? '' : ''}
          </Badge>
        </motion.div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Trạng thái" />
    ),
    cell: ({ row }) => {
      const { status } = row.original;
      const badgeColor = statusTypes.get(status);
      return (
        <motion.div
          initial="initial"
          whileHover="hover"
          variants={hoverAnimation as Variants}
          className="py-1"
        >
          <Badge
            variant="outline"
            className={cn("capitalize px-3 py-1 text-xs font-medium rounded-md", badgeColor)}
          >
            {row.getValue("status")}
          </Badge>
        </motion.div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Vai trò" />
    ),
    cell: ({ row }) => {
      const { role } = row.original;
      const userType = userTypes.find(({ value }) => value === role);
      if (!userType) return null;
      return (
        <motion.div
          initial="initial"
          whileHover="hover"
          variants={hoverAnimation as Variants}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 w-fit shadow-sm ${userType.color}`}
        >
          {userType.icon && (
            <userType.icon size={15} className="opacity-80" strokeWidth={2.3} />
          )}
          <span className="capitalize text-xs font-semibold">{userType.label}</span>
        </motion.div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "actions",
    cell: AccountRowActions,
    meta: {
      className: "text-right pr-4",
    },
  },
]