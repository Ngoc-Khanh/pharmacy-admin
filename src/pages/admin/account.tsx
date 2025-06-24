import { useAccountDialog } from "@/atoms";
import AccountDialog from "@/components/dialogs/account.dialog";
import { AccountPrimaryButtons, AccountStats } from "@/components/pages/account";
import { accountColumns, AccountDataTable } from "@/components/table/account";
import { Skeleton } from "@/components/ui/skeleton";
import { routeNames, routes, siteConfig } from "@/config";
import { UserResponse, UserStatsResponse } from "@/data/interfaces";
import { usePaginatedData, usePagination } from "@/hooks";
import { AccountAPI } from "@/services/v1";
import { ShieldCheck, Users } from "lucide-react";
import { motion } from 'motion/react';
import { Helmet } from "react-helmet-async";

export default function AccountPage() {
  // Dialog state management
  const { setOpen, setSelectedAccountsForBulkDelete } = useAccountDialog();

  // Pagination state management
  const [paginationState, paginationActions] = usePagination<UserResponse>({
    defaultLimit: 10,
    loadMoreData: async (page: number, limit: number) => {
      const result = await AccountAPI.AccountList({ page, limit });
      return { data: result.data };
    },
  });

  // Data fetching with pagination
  const {
    data: accountData,
    isLoading: isTableLoading,
    paginationInfo,
    statsData,
    isStatsLoading,
    isLoadingMore,
    isChangingPage,
  } = usePaginatedData<UserResponse, UserStatsResponse>(
    {
      queryKey: (page, limit) => ["accounts", page, limit],
      queryFn: async (page, limit) => {
        const result = await AccountAPI.AccountList({ page, limit });
        return {
          data: result.data,
          total: result.total,
          lastPage: result.lastPage,
          currentPage: result.currentPage,
        };
      },
      searchQueryKey: (searchTerm) => ["accounts-search", searchTerm],
      searchQueryFn: async (searchTerm) => {
        const result = await AccountAPI.AccountList({ s: searchTerm });
        return {
          data: result.data,
          total: result.total,
          lastPage: result.lastPage,
          currentPage: result.currentPage,
        };
      },
      statsQueryKey: ["accounts-stats"],
      statsQueryFn: async () => {
        const result = await AccountAPI.AccountStats();
        return result;
      },
    },
    paginationState,
    paginationActions
  );

  const { searchTerm } = paginationState;
  const { setSearchTerm, handlePageChange, handlePageSizeChange } = paginationActions;

  // Handle bulk delete
  const handleBulkDelete = (selectedAccounts: UserResponse[]) => {
    setSelectedAccountsForBulkDelete(selectedAccounts);
    setOpen("bulk-delete");
  };

  return (
    <div className="flex-col md:flex">
      <Helmet>
        <title>{routeNames[routes.admin.account]} | {siteConfig.name}</title>
      </Helmet>
      <div className="flex-1 space-y-6 p-6 md:p-8 pt-6">
        {/* Header with pharmacy themed styling */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-r from-cyan-50 to-sky-50 dark:from-cyan-950/40 dark:to-sky-950/40 rounded-xl p-6 shadow-sm border border-cyan-100 dark:border-cyan-800/20"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-cyan-100 dark:bg-cyan-800/30 p-2.5 rounded-lg">
              <Users size={28} className="text-cyan-600 dark:text-cyan-400" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-cyan-800 dark:text-cyan-300">
              Quản lý Người dùng
            </h2>
          </div>
          <p className="text-cyan-600/90 dark:text-cyan-400/80 ml-[52px]">
            Quản lý tài khoản người dùng, dược sĩ và quyền truy cập trong hệ thống Pharmacity Store
          </p>
        </motion.div>

        {/* Statistics Cards */}
        <AccountStats statsData={statsData} isLoading={isStatsLoading} />

        <div className="grid gap-4 grid-cols-1">
          {isTableLoading && !isLoadingMore ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3"
            >
              <Skeleton className="h-16 w-full rounded-lg" />
              <Skeleton className="h-[400px] w-full rounded-lg" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </motion.div>
          ) : (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <ShieldCheck size={18} className="text-cyan-500" />
                    Danh sách tài khoản người dùng
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Quản lý và phân quyền người dùng trong hệ thống
                  </p>
                </motion.div>
                <AccountPrimaryButtons />
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="bg-white dark:bg-slate-950 rounded-xl shadow-sm border border-emerald-100 dark:border-emerald-900/30"
              >
                <div className="p-4 md:p-6">
                  <AccountDataTable 
                    columns={accountColumns} 
                    data={accountData} 
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    isLoading={isTableLoading}
                    isLoadingMore={isLoadingMore}
                    isChangingPage={isChangingPage}
                    onBulkDelete={handleBulkDelete}
                    statsData={statsData}
                    pagination={searchTerm ? undefined : {
                      currentPage: paginationInfo.currentPage,
                      totalPages: paginationInfo.totalPages,
                      onPageChange: handlePageChange,
                      onPageSizeChange: handlePageSizeChange,
                      pageSize: paginationState.limit,
                      totalItems: paginationInfo.totalItems
                    }}
                  />
                </div>
              </motion.div>
            </div>
          )}
        </div>
        <AccountDialog />
      </div>
    </div>
  );
}