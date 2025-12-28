
import { Client, PackageType, SubscriptionStatus, SalesMetric } from '../types';

const generateDate = (offsetDays: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

export const MOCK_CLIENTS: Client[] = [
  {
    id: '1',
    fullName: 'John Smith',
    email: 'john@example.com',
    phone: '+1 234 567 890',
    startDate: generateDate(-180),
    expiryDate: generateDate(5),
    duration: 12,
    packageType: PackageType.VIP,
    iptvApp: 'IBO Player',
    status: SubscriptionStatus.EXPIRING_SOON,
    price: 49.99,
    macAddress: '00:1A:2B:3C:4D:5E',
    deviceKey: '123456'
  },
  {
    id: '2',
    fullName: 'Maria Garcia',
    email: 'maria@example.com',
    phone: '+34 600 000 000',
    startDate: generateDate(-30),
    expiryDate: generateDate(335),
    duration: 12,
    packageType: PackageType.DIAMOND,
    iptvApp: 'Smart IPTV',
    status: SubscriptionStatus.ACTIVE,
    price: 39.99
  },
  {
    id: '3',
    fullName: 'Robert Wilson',
    email: 'robert@example.com',
    phone: '+44 7700 900000',
    startDate: generateDate(-400),
    expiryDate: generateDate(-35),
    duration: 12,
    packageType: PackageType.LION,
    iptvApp: 'TiviMate',
    status: SubscriptionStatus.EXPIRED,
    price: 29.99
  }
];

export const MOCK_SALES: SalesMetric[] = [
  { date: 'Mon', amount: 120, clients: 2 },
  { date: 'Tue', amount: 340, clients: 5 },
  { date: 'Wed', amount: 210, clients: 3 },
  { date: 'Thu', amount: 450, clients: 7 },
  { date: 'Fri', amount: 680, clients: 9 },
  { date: 'Sat', amount: 900, clients: 12 },
  { date: 'Sun', amount: 750, clients: 10 },
];

export const MOCK_HOURLY_SALES = [
  { time: '08:00', amount: 45 },
  { time: '10:00', amount: 120 },
  { time: '12:00', amount: 80 },
  { time: '14:00', amount: 210 },
  { time: '16:00', amount: 340 },
  { time: '18:00', amount: 190 },
  { time: '20:00', amount: 280 },
  { time: '22:00', amount: 150 },
];
