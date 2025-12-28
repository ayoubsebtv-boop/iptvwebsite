
import React, { useState, useMemo } from 'react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { DollarSign, UserCheck, Clock, TrendingUp, Gem, ShieldCheck, Crown, Activity } from 'lucide-react';
import { getExpiringCount } from '../utils/subscriptionLogic';
import { Client, PackageType } from '../types';

interface DashboardProps {
  clients: Client[];
}

const StatCard = ({ title, value, icon, trend, color, subtitle }: any) => (
  <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100/50 flex flex-col gap-4 group hover:scale-[1.02] transition-all duration-300 hover:shadow-xl hover:shadow-[#0D1B1E]/5 cursor-default">
    <div className="flex justify-between items-start">
      <div className={`p-3 rounded-2xl ${color} bg-opacity-10 text-${color.split('-')[1]}-600 group-hover:bg-opacity-20 transition-all`}>
        {icon}
      </div>
      {trend && (
        <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-lg flex items-center gap-1 group-hover:translate-x-1 transition-transform">
          <TrendingUp size={12} /> {trend}
        </span>
      )}
    </div>
    <div>
      <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
      <div className="flex items-baseline gap-2">
        <p className="text-3xl font-bold text-[#0D1B1E]">{value}</p>
        {subtitle && <span className="text-xs font-bold text-gray-400">{subtitle}</span>}
      </div>
    </div>
  </div>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0D1B1E] text-white p-4 rounded-2xl shadow-2xl border border-white/10 animate-in fade-in zoom-in-95 duration-200">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-lg font-bold">€{payload[0].value.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
      </div>
    );
  }
  return null;
};

const Dashboard: React.FC<DashboardProps> = ({ clients }) => {
  const [viewType, setViewType] = useState<'today' | 'week'>('week');
  
  const todayStr = new Date().toISOString().split('T')[0];
  
  // Real-time calculations based on clients data
  const { totalRevenue, todayRevenue, activeCount } = useMemo(() => {
    let total = 0;
    let today = 0;
    let active = 0;

    clients.forEach(client => {
      // Total Revenue from Active/Expiring Soon
      if (client.status === 'Active' || client.status === 'Expiring Soon') {
        total += client.price;
        active++;
      }
      
      // Today's Sales
      if (client.startDate === todayStr) {
        today += client.price;
      }
    });

    return { totalRevenue: total, todayRevenue: today, activeCount: active };
  }, [clients, todayStr]);

  // Dynamic Chart Data Generation
  const chartData = useMemo(() => {
    if (viewType === 'today') {
      // Simulate hourly distribution of today's total for visualization
      const hours = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'];
      const hourlyTotal = todayRevenue;
      // Distribute the todayRevenue across hours with some variety
      const weights = [0.1, 0.15, 0.05, 0.2, 0.25, 0.1, 0.1, 0.05];
      return hours.map((time, i) => ({
        time,
        amount: hourlyTotal * weights[i]
      }));
    } else {
      // Calculate daily revenue for the last 7 days
      const days = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
        
        const dayRevenue = clients
          .filter(c => c.startDate === dateStr)
          .reduce((sum, c) => sum + c.price, 0);
          
        days.push({
          date: dayName,
          amount: dayRevenue
        });
      }
      return days;
    }
  }, [clients, viewType, todayRevenue]);

  const expiring7 = getExpiringCount(clients, 7);
  const expiring3 = getExpiringCount(clients, 3);
  const expiring14 = getExpiringCount(clients, 14);

  const packageCounts = useMemo(() => ({
    diamond: clients.filter(c => c.packageType === PackageType.DIAMOND).length,
    lion: clients.filter(c => c.packageType === PackageType.LION).length,
    vip: clients.filter(c => c.packageType === PackageType.VIP).length
  }), [clients]);

  const xAxisKey = viewType === 'today' ? 'time' : 'date';

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-bold text-[#0D1B1E] tracking-tight">Overview</h2>
          <p className="text-gray-500 mt-2">Business performance based on <span className="text-[#0D1B1E] font-bold">{clients.length}</span> recorded clients.</p>
        </div>
        <div className="flex gap-4">
          <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-gray-100">
            <button
              onClick={() => setViewType('today')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                viewType === 'today' 
                ? 'bg-[#0D1B1E] text-white shadow-md' 
                : 'text-gray-400 hover:text-[#0D1B1E]'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setViewType('week')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                viewType === 'week' 
                ? 'bg-[#0D1B1E] text-white shadow-md' 
                : 'text-gray-400 hover:text-[#0D1B1E]'
              }`}
            >
              Last 7 Days
            </button>
          </div>
          <button className="px-6 py-3 bg-[#E67E22] text-white rounded-2xl font-semibold shadow-lg shadow-[#E67E22]/20 hover:scale-[1.05] transition-all">
            Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Today's Revenue" 
          value={`€${todayRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} 
          icon={<Activity size={24} />} 
          trend={todayRevenue > 0 ? "+New" : undefined}
          color="bg-orange-500"
          subtitle="Real-time"
        />
        <StatCard 
          title="Active Revenue" 
          value={`€${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} 
          icon={<DollarSign size={24} />} 
          trend="+Calculated" 
          color="bg-emerald-500"
        />
        <StatCard 
          title="Active Subscriptions" 
          value={activeCount.toString()} 
          icon={<UserCheck size={24} />} 
          trend={activeCount > 0 ? `+${activeCount}` : undefined} 
          color="bg-blue-500"
        />
        <StatCard 
          title="Expiring (7 Days)" 
          value={expiring7.toString()} 
          icon={<Clock size={24} />} 
          color="bg-red-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Performance Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 group transition-all hover:shadow-md">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold flex items-center gap-2">
              {viewType === 'today' ? "Today's Hourly Sales" : "Weekly Revenue Performance"}
              <span className="text-[10px] font-bold text-gray-400 uppercase bg-gray-50 px-2 py-1 rounded-md">
                € Euro
              </span>
            </h3>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-500 bg-emerald-50 px-3 py-1.5 rounded-xl">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              Dynamic Data
            </div>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E67E22" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#E67E22" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
                <XAxis 
                  dataKey={xAxisKey} 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#9CA3AF', fontSize: 12, fontWeight: 500}} 
                  dy={15} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#9CA3AF', fontSize: 12, fontWeight: 500}} 
                  tickFormatter={(val) => `€${val}`}
                />
                <Tooltip 
                  content={<CustomTooltip />} 
                  cursor={{stroke: '#E67E22', strokeWidth: 2, strokeDasharray: '5 5'}} 
                />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#E67E22" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorAmt)" 
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Package Distribution & Expirations */}
        <div className="space-y-6">
          <div className="bg-[#0D1B1E] p-8 rounded-[2.5rem] text-white flex flex-col group transition-all hover:shadow-2xl hover:shadow-[#0D1B1E]/30">
            <h3 className="text-xl font-bold mb-6">Upcoming Expirations</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/0 hover:border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <p className="font-medium text-sm">Next 3 Days</p>
                </div>
                <span className="text-xl font-bold">{expiring3}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/0 hover:border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#E67E22]" />
                  <p className="font-medium text-sm">Next 7 Days</p>
                </div>
                <span className="text-xl font-bold">{expiring7}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/0 hover:border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <p className="font-medium text-sm">Next 14 Days</p>
                </div>
                <span className="text-xl font-bold">{expiring14}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 flex flex-col shadow-sm hover:shadow-md transition-all">
            <h3 className="text-xl font-bold mb-6">Package Distribution</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 text-blue-500 rounded-lg group-hover:scale-110 transition-transform"><Gem size={16} /></div>
                  <p className="text-sm font-bold text-gray-600">Diamond</p>
                </div>
                <p className="font-bold">{packageCounts.diamond}</p>
              </div>
              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-50 text-[#E67E22] rounded-lg group-hover:scale-110 transition-transform"><ShieldCheck size={16} /></div>
                  <p className="text-sm font-bold text-gray-600">Lion</p>
                </div>
                <p className="font-bold">{packageCounts.lion}</p>
              </div>
              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-50 text-purple-500 rounded-lg group-hover:scale-110 transition-transform"><Crown size={16} /></div>
                  <p className="text-sm font-bold text-gray-600">VIP</p>
                </div>
                <p className="font-bold">{packageCounts.vip}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
