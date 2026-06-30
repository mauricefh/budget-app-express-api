import cache from "@/lib/cache";

export function invalidateAccountCache(userId: number) {
  cache.del(`accounts_${userId}`);
  cache.del(`accounts_summary_${userId}`);
}

export function invalidateTransactionCache(userId: number) {
  cache.del(`transactions_${userId}`);
}
