import { useAccountDialog } from "@/atoms";
import { AccountActionDialog } from "@/components/dialogs/account";

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
    </>
  )
}