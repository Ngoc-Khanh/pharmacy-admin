import { useAccountDialog } from "@/atoms";
import { AccountActionDialog, AccountChangeStatusDialog, AccountDeleteDialog, ViewAccountSheet } from "@/components/dialogs/account";

export default function AccountDialog() {
  const { open, setOpen, currentAccount, setCurrentAccount } = useAccountDialog();

  return (
    <>
      <AccountActionDialog
        key="account-add"
        open={open === "add"}
        onOpenChange={(isOpen) => {
          if (!isOpen) setOpen(null);
          else setOpen("add");
        }}
      />

      {currentAccount && (
        <>
          <AccountActionDialog
            key={`account-edit-${currentAccount.id}`}
            open={open === "edit"}
            onOpenChange={(isOpen) => {
              if (!isOpen) {
                setOpen(null);
                setTimeout(() => {
                  setCurrentAccount(null);
                }, 300);
              }
            }}
            currentAccount={currentAccount}
          />

          <ViewAccountSheet
            key={`account-detail-${currentAccount.id}`}
            open={open === "detail"}
            onOpenChange={(isOpen: boolean) => {
              if (!isOpen) {
                setOpen(null);
                setTimeout(() => {
                  setCurrentAccount(null);
                }, 300);
              }
            }}
            currentAccount={currentAccount}
          />

          <AccountDeleteDialog
            key={`account-delete-${currentAccount.id}`}
            open={open === "delete"}
            onOpenChange={(isOpen) => {
              if (!isOpen) {
                setOpen(null);
                setTimeout(() => {
                  setCurrentAccount(null);
                }, 300);
              }
            }}
            currentAccount={currentAccount}
          />

          <AccountChangeStatusDialog
            key={`account-suspend-${currentAccount.id}`}
            open={open === "suspend"}
            onOpenChange={(isOpen) => {
              if (!isOpen) {
                setOpen(null);
                setTimeout(() => {
                  setCurrentAccount(null);
                }, 300);
              }
            }}
            currentAccount={currentAccount}
            mode="suspend"
          />

          <AccountChangeStatusDialog
            key={`account-activate-${currentAccount.id}`}
            open={open === "activate"}
            onOpenChange={(isOpen) => {
              if (!isOpen) {
                setOpen(null);
                setTimeout(() => {
                  setCurrentAccount(null);
                }, 300);
              }
            }}
            currentAccount={currentAccount}
            mode="activate"
          />
        </>
      )}
    </>
  )
}