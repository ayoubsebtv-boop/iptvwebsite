
import React from 'react';
import { LayoutDashboard, Users, Wrench, Settings, LogOut } from 'lucide-react';

export const COLORS = {
  accent: '#E67E22', // Warm Orange
  panel: '#0D1B1E',  // Dark Green/Black
  bg: '#FDFBF7',     // Soft Beige
  card: '#FFFFFF',
  text: '#0D1B1E'
};

export const NAVIGATION_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'clients', label: 'Clients', icon: <Users size={20} /> },
  { id: 'tools', label: 'IPTV Tools', icon: <Wrench size={20} /> },
  { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
];

export const IPTV_APPS = [
  'Smart IPTV',
  'IBO Player',
  'IBO Pro Player',
  'TiviMate',
  'IPTV Smarters',
  'GSE Smart IPTV'
];
