
import React from 'react';
import { NAVIGATION_ITEMS, COLORS } from '../constants';
import { ActiveTab } from '../types';
import { LogOut, MonitorPlay } from 'lucide-react';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="w-72 bg-[#0D1B1E] h-screen text-white flex flex-col fixed left-0 top-0 z-50">
      <div className="p-8 flex items-center gap-3">
        <div className="bg-[#E67E22] p-2 rounded-xl">
          <MonitorPlay size={24} className="text-white" />
        </div>
        <h1 className="text-xl font-bold tracking-tight">Streamline<span className="text-[#E67E22]">IPTV</span></h1>
      </div>
      
      <nav className="flex-1 px-4 mt-4 space-y-2">
        {NAVIGATION_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as ActiveTab)}
            className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 ${
              activeTab === item.id 
                ? 'bg-[#E67E22] text-white shadow-lg shadow-[#E67E22]/20' 
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-6">
        <div className="bg-white/5 rounded-3xl p-6 mb-6">
          <p className="text-xs text-gray-500 uppercase font-bold mb-2">Plan Details</p>
          <p className="text-sm font-medium mb-1">Reseller Pro</p>
          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mt-2">
            <div className="bg-[#E67E22] w-3/4 h-full" />
          </div>
          <p className="text-[10px] text-gray-400 mt-2">750 / 1000 Credits used</p>
        </div>

        <button className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-red-400 hover:bg-red-500/10 transition-colors">
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
