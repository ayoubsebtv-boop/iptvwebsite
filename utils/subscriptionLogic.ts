
import { SubscriptionStatus } from '../types';

export const getStatusFromDate = (expiryDateStr: string): SubscriptionStatus => {
  const expiryDate = new Date(expiryDateStr);
  const now = new Date();
  
  if (expiryDate < now) {
    return SubscriptionStatus.EXPIRED;
  }
  
  const diffTime = Math.abs(expiryDate.getTime() - now.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays <= 7) {
    return SubscriptionStatus.EXPIRING_SOON;
  }
  
  return SubscriptionStatus.ACTIVE;
};

export const getExpiringCount = (clients: any[], days: number) => {
  const now = new Date();
  const targetDate = new Date();
  targetDate.setDate(now.getDate() + days);
  
  return clients.filter(c => {
    const expiry = new Date(c.expiryDate);
    return expiry > now && expiry <= targetDate;
  }).length;
};
