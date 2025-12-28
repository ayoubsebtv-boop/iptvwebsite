
import React, { useState, useRef, useEffect } from 'react';
import { Search, Plus, Filter, Edit2, Trash2, Smartphone, CheckCircle2, X, ChevronDown, AlertTriangle } from 'lucide-react';
import { SubscriptionStatus, Client, PackageType } from '../types';
import AddClientModal from './AddClientModal';

interface ClientManagementProps {
  clients: Client[];
  onAddClient: (client: Client) => void;
  onRemoveClient: (id: string) => void;
}

const ClientManagement: React.FC<ClientManagementProps> = ({ clients, onAddClient, onRemoveClient }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [packageFilter, setPackageFilter] = useState<string>('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  const filterRef = useRef<HTMLDivElement>(null);

  // Close filter dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredClients = clients.filter(c => {
    const matchesSearch = 
      c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    const matchesPackage = packageFilter === 'All' || c.packageType === packageFilter;
    
    return matchesSearch && matchesStatus && matchesPackage;
  });

  const getStatusColor = (status: SubscriptionStatus) => {
    switch (status) {
      case SubscriptionStatus.ACTIVE: return 'bg-emerald-100 text-emerald-700';
      case SubscriptionStatus.EXPIRED: return 'bg-red-100 text-red-700';
      case SubscriptionStatus.EXPIRING_SOON: return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleOpenAddModal = () => {
    setEditingClient(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (client: Client) => {
    setEditingClient(client);
    setIsModalOpen(true);
  };

  const handleSaveClient = (newClient: Client) => {
    onAddClient(newClient);
    setIsModalOpen(false);
    setToastMessage(editingClient ? 'Client updated successfully!' : 'Client added successfully!');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    setEditingClient(null);
  };

  const confirmDelete = () => {
    if (clientToDelete) {
      onRemoveClient(clientToDelete.id);
      setClientToDelete(null);
      setToastMessage('Client removed successfully!');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const isAnyFilterActive = statusFilter !== 'All' || packageFilter !== 'All';

  const resetFilters = () => {
    setStatusFilter('All');
    setPackageFilter('All');
    setSearchTerm('');
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 relative">
      {/* Success Toast */}
      {showToast && (
        <div className="fixed top-8 right-8 z-[100] bg-emerald-500 text-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-right-4">
          <CheckCircle2 size={20} />
          <p className="font-bold">{toastMessage}</p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {clientToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#0D1B1E]/80 backdrop-blur-sm animate-in fade-in" onClick={() => setClientToDelete(null)} />
          <div className="relative bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mb-6">
                <AlertTriangle size={40} />
              </div>
              <h3 className="text-2xl font-bold text-[#0D1B1E] mb-2">Remove Client?</h3>
              <p className="text-gray-500 mb-8">
                Are you sure you want to delete <span className="font-bold text-[#0D1B1E]">{clientToDelete.fullName}</span>? This action cannot be undone and will update all revenue analytics.
              </p>
              <div className="flex w-full gap-4">
                <button 
                  onClick={() => setClientToDelete(null)}
                  className="flex-1 py-4 bg-gray-50 text-gray-600 font-bold rounded-2xl hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 py-4 bg-red-500 text-white font-bold rounded-2xl hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-bold text-[#0D1B1E] tracking-tight">Clients</h2>
          <p className="text-gray-500 mt-2">Manage your customer database and subscriptions.</p>
        </div>
        <button 
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-6 py-3 bg-[#E67E22] text-white rounded-2xl font-semibold shadow-lg shadow-[#E67E22]/20 hover:scale-[1.02] transition-transform"
        >
          <Plus size={20} /> Add New Client
        </button>
      </div>

      {/* Main Table Container - Note: overflow-hidden removed to prevent filter dropdown clipping */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100">
        <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text"
              placeholder="Search name, email, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#E67E22] transition-shadow"
            />
          </div>
          
          <div className="flex gap-3 relative" ref={filterRef}>
            {isAnyFilterActive && (
              <button 
                onClick={resetFilters}
                className="flex items-center gap-2 px-4 py-3 text-[#E67E22] font-bold text-xs uppercase tracking-wider hover:bg-orange-50 rounded-2xl transition-colors"
              >
                <X size={14} /> Reset
              </button>
            )}
            
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${
                isFilterOpen || isAnyFilterActive 
                ? 'bg-[#0D1B1E] text-white' 
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Filter size={18} /> 
              Filters
              {isAnyFilterActive && <span className="w-2 h-2 bg-[#E67E22] rounded-full" />}
              <ChevronDown size={16} className={`transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Filter Dropdown */}
            {isFilterOpen && (
              <div className="absolute top-full right-0 mt-2 w-72 bg-[#0D1B1E] text-white rounded-3xl shadow-2xl p-6 z-[60] animate-in fade-in zoom-in-95 duration-200">
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 block text-left">By Status</label>
                    <div className="flex flex-wrap gap-2">
                      {['All', ...Object.values(SubscriptionStatus)].map(status => (
                        <button
                          key={status}
                          onClick={() => setStatusFilter(status)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            statusFilter === status 
                            ? 'bg-[#E67E22] text-white' 
                            : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 block text-left">By Package</label>
                    <div className="flex flex-wrap gap-2">
                      {['All', ...Object.values(PackageType)].map(pkg => (
                        <button
                          key={pkg}
                          onClick={() => setPackageFilter(pkg)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            packageFilter === pkg 
                            ? 'bg-[#E67E22] text-white' 
                            : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          {pkg}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="overflow-x-auto rounded-b-[2.5rem]">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase font-bold">
                <th className="px-8 py-4">Client</th>
                <th className="px-6 py-4">Package</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">App</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div>
                      <p className="font-bold text-[#0D1B1E]">{client.fullName}</p>
                      <p className="text-xs text-gray-500">{client.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-lg">
                      {client.packageType}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-xl ${getStatusColor(client.status)}`}>
                      {client.status}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Smartphone size={14} className="text-[#E67E22]" />
                      {client.iptvApp}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <p className="font-bold text-[#0D1B1E]">€{client.price}</p>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleOpenEditModal(client)}
                        className="p-2 hover:bg-white rounded-xl text-gray-400 hover:text-[#E67E22] shadow-sm transition-all"
                        title="Edit Client"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => setClientToDelete(client)}
                        className="p-2 hover:bg-white rounded-xl text-gray-400 hover:text-red-500 shadow-sm transition-all"
                        title="Remove Client"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredClients.length === 0 && (
            <div className="p-20 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={24} className="text-gray-300" />
              </div>
              <p className="text-gray-400 font-medium">No clients found matching your current filters.</p>
              {isAnyFilterActive && (
                <button onClick={resetFilters} className="text-[#E67E22] font-bold text-sm mt-4 hover:underline">
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <AddClientModal 
          isOpen={isModalOpen} 
          onClose={() => {
            setIsModalOpen(false);
            setEditingClient(null);
          }} 
          onSave={handleSaveClient}
          existingClients={clients}
          clientToEdit={editingClient || undefined}
        />
      )}
    </div>
  );
};

export default ClientManagement;
