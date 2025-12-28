
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ClientManagement from './components/ClientManagement';
import IPTVTools from './components/IPTVTools';
import { ActiveTab, Client } from './types';
import { Bell, Search, User } from 'lucide-react';
import { MOCK_CLIENTS } from './services/mockData';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);

  const handleSaveClient = (client: Client) => {
    setClients(prev => {
      const exists = prev.find(c => String(c.id) === String(client.id));
      if (exists) {
        return prev.map(c => String(c.id) === String(client.id) ? client : c);
      }
      return [client, ...prev];
    });
  };

  const handleRemoveClient = (id: string) => {
    setClients(prev => prev.filter(c => String(c.id) !== String(id)));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard clients={clients} />;
      case 'clients': return <ClientManagement clients={clients} onAddClient={handleSaveClient} onRemoveClient={handleRemoveClient} />;
      case 'tools': return <IPTVTools />;
      case 'settings': 
        return (
          <div className="flex items-center justify-center h-full min-h-[60vh]">
            <div className="text-center space-y-4">
              <div className="text-6xl">⚙️</div>
              <h2 className="text-2xl font-bold">Settings</h2>
              <p className="text-gray-500">Configuration panel is currently under maintenance.</p>
            </div>
          </div>
        );
      default: return <Dashboard clients={clients} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="ml-72 min-h-screen">
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-40 bg-[#FDFBF7]/80 backdrop-blur-md px-12 py-6 flex justify-between items-center">
          <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100">
            <Search size={18} className="text-gray-400" />
            <input 
              type="text" 
              placeholder="Global Search..." 
              className="bg-transparent border-none focus:ring-0 text-sm w-64"
            />
          </div>
          
          <div className="flex items-center gap-6">
            <button className="relative p-2 text-gray-400 hover:text-[#0D1B1E] transition-colors">
              <Bell size={24} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            
            <div className="h-10 w-[1px] bg-gray-200" />
            
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-bold text-[#0D1B1E]">Ayoub</p>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Super Admin</p>
              </div>
              <div className="w-12 h-12 bg-[#0D1B1E] rounded-2xl flex items-center justify-center text-[#E67E22]">
                <User size={24} />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="px-12 pb-12 max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>

      {/* Footer Info */}
      <footer className="ml-72 py-8 px-12 text-center text-xs text-gray-400">
        <p>&copy; 2024 Streamline IPTV Admin Dashboard. Built with React & Tailwind CSS.</p>
      </footer>
    </div>
  );
};

export default App;
