
export enum SubscriptionStatus {
  ACTIVE = 'Active',
  EXPIRED = 'Expired',
  SUSPENDED = 'Suspended',
  EXPIRING_SOON = 'Expiring Soon'
}

export enum PackageType {
  DIAMOND = 'Diamond',
  LION = 'Lion',
  VIP = 'VIP'
}

export interface Client {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  startDate: string;
  expiryDate: string;
  duration: number; // in months
  packageType: PackageType;
  iptvApp: string;
  status: SubscriptionStatus;
  price: number;
  macAddress?: string;
  deviceKey?: string;
}

export interface SalesMetric {
  date: string;
  amount: number;
  clients: number;
}

export type ActiveTab = 'dashboard' | 'clients' | 'tools' | 'settings';
