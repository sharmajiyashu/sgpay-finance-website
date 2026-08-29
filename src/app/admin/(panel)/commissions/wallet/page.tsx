"use client";

import {
  getCommissionTransactions,
  getCommissionWallet,
  getCommissionWithdrawals,
  requestCommissionWithdrawal,
} from "@/sg-admin/lib/services/commissionService";
import { ADMIN_API_PATHS } from "@/lib/config/env";
import { CommissionWalletPanel } from "@/components/commissions/CommissionWalletPanel";

export default function AdminCommissionWalletPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Wallet</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your approved commission balance, withdrawals, and transaction history
        </p>
      </div>
      <CommissionWalletPanel
        queryScope="admin"
        api={{
          getWallet: getCommissionWallet,
          requestWithdrawal: requestCommissionWithdrawal,
          getTransactions: (page) =>
            getCommissionTransactions(
              `${ADMIN_API_PATHS.commissionTransactions}?page=${page}&limit=20`
            ),
          getMyWithdrawals: (page) =>
            getCommissionWithdrawals(
              `${ADMIN_API_PATHS.commissionWithdrawals}?page=${page}&limit=20&userId=me`
            ),
        }}
      />
    </div>
  );
}
