import { AccountRole, AccountStatus } from "@/data/enum";

export type AddAcccountDto = {
  username: string;
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  phone: string;
  role: AccountRole;
  status: AccountStatus;
}

export type UpdateAccountDto = {
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  phone: string;
  role: AccountRole;
  status: AccountStatus;
}

export type ChangeStatusAccountDto = {
  status: AccountStatus.ACTIVE | AccountStatus.SUSPENDED;
}