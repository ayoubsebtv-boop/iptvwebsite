
import React, { useState, useEffect } from 'react';
// Added Edit2 to the imports from lucide-react to fix the error on line 156
import { X, Smartphone, Mail, Calendar, Package, Clock, User, AlertCircle, Plus, ChevronLeft, Euro, ShieldCheck, Key, Edit2 } from 'lucide-react';
import { Client, PackageType, SubscriptionStatus } from '../types';
import { getStatusFromDate } from '../utils/subscriptionLogic';
import { IPTV_APPS } from '../constants';

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (client: Client) => void;
  existingClients: Client[];
  clientToEdit?: Client;
}

const AddClientModal: React.FC<AddClientModalProps> = ({ isOpen, onClose, onSave, existingClients, clientToEdit }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    packageType: PackageType.DIAMOND,
    iptvApp: IPTV_APPS[0],
    customIptvApp: '',
    startDate: new Date().toISOString().split('T')[0],
    duration: '12',
    price: 39.99,
    customPrice: '',
    isCustomPrice: false,
    macAddress: '',
    deviceKey: ''
  });

  const [isAddingCustomApp, setIsAddingCustomApp] = useState(false);
  const [expiryDate, setExpiryDate] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (clientToEdit) {
      const isCustomApp = !IPTV_APPS.includes(clientToEdit.iptvApp);
      setFormData({
        fullName: clientToEdit.fullName,
        email: clientToEdit.email,
        phone: clientToEdit.phone,
        packageType: clientToEdit.packageType,
        iptvApp: isCustomApp ? IPTV_APPS[0] : clientToEdit.iptvApp,
        customIptvApp: isCustomApp ? clientToEdit.iptvApp : '',
        startDate: clientToEdit.startDate,
        duration: clientToEdit.duration.toString(),
        price: clientToEdit.price,
        customPrice: [29.99, 39.99, 49.99].includes(clientToEdit.price) ? '' : clientToEdit.price.toString(),
        isCustomPrice: ![29.99, 39.99, 49.99].includes(clientToEdit.price),
        macAddress: clientToEdit.macAddress || '',
        deviceKey: clientToEdit.deviceKey || ''
      });
      setIsAddingCustomApp(isCustomApp);
    } else {
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        packageType: PackageType.DIAMOND,
        iptvApp: IPTV_APPS[0],
        customIptvApp: '',
        startDate: new Date().toISOString().split('T')[0],
        duration: '12',
        price: 39.99,
        customPrice: '',
        isCustomPrice: false,
        macAddress: '',
        deviceKey: ''
      });
      setIsAddingCustomApp(false);
    }
  }, [clientToEdit, isOpen]);

  useEffect(() => {
    if (formData.startDate && formData.duration) {
      const date = new Date(formData.startDate);
      date.setMonth(date.getMonth() + parseInt(formData.duration));
      setExpiryDate(date.toISOString().split('T')[0]);
    }
  }, [formData.startDate, formData.duration]);

  const isIBO = formData.iptvApp.includes('IBO') || (isAddingCustomApp && formData.customIptvApp.toUpperCase().includes('IBO'));

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    
    if (!formData.phone.trim()) newErrors.phone = 'WhatsApp number is required';
    
    if (isAddingCustomApp && !formData.customIptvApp.trim()) {
      newErrors.iptvApp = 'App name required';
    }

    if (isIBO) {
      if (!formData.macAddress.trim()) newErrors.macAddress = 'MAC required';
      if (!formData.deviceKey.trim()) newErrors.deviceKey = 'Key required';
    }

    // Duplicate checks (skip if editing the same client)
    if (existingClients.some(c => c.id !== clientToEdit?.id && c.email.toLowerCase() === formData.email.toLowerCase())) {
      newErrors.email = 'Email already exists';
    }
    if (existingClients.some(c => c.id !== clientToEdit?.id && c.phone === formData.phone)) {
      newErrors.phone = 'Phone already exists';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      const finalPrice = formData.isCustomPrice ? parseFloat(formData.customPrice) || 0 : formData.price;
      const newClient: Client = {
        id: clientToEdit ? clientToEdit.id : Math.random().toString(36).substr(2, 9),
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        startDate: formData.startDate,
        expiryDate: expiryDate,
        duration: parseInt(formData.duration),
        packageType: formData.packageType,
        iptvApp: isAddingCustomApp ? formData.customIptvApp : formData.iptvApp,
        status: getStatusFromDate(expiryDate),
        price: finalPrice,
        macAddress: isIBO ? formData.macAddress : undefined,
        deviceKey: isIBO ? formData.deviceKey : undefined
      };
      onSave(newClient);
    }
  };

  if (!isOpen) return null;

  const inputClasses = "w-full pl-12 pr-4 py-4 bg-[#FDFBF7] text-[#0D1B1E] border-none rounded-2xl focus:ring-2 focus:ring-[#E67E22] transition-all font-medium placeholder:text-gray-300 shadow-sm";
  const labelClasses = "text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2";

  const isFormValid = formData.fullName && formData.email && formData.phone && (!isIBO || (formData.macAddress && formData.deviceKey));

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-[#0D1B1E]/80 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      <div className="relative bg-[#0D1B1E] w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-8 pb-4 flex justify-between items-start border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#E67E22] text-white rounded-2xl shadow-lg shadow-[#E67E22]/30">
              {clientToEdit ? <Edit2 size={24} /> : <Plus size={24} />}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{clientToEdit ? 'Edit Client' : 'Add New Client'}</h2>
              <p className="text-gray-400 text-sm tracking-tight">{clientToEdit ? 'Modify existing subscription details.' : 'Setup a fresh subscription instantly.'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white bg-white/5 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 space-y-8 overflow-y-auto">
          {/* Section 1: Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClasses}>Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input type="text" placeholder="John Doe" className={inputClasses} value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
              </div>
              {errors.fullName && <p className="text-red-400 text-[10px] mt-1 font-bold uppercase">{errors.fullName}</p>}
            </div>
            <div>
              <label className={labelClasses}>Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input type="email" placeholder="john@example.com" className={inputClasses} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              {errors.email && <p className="text-red-400 text-[10px] mt-1 font-bold uppercase">{errors.email}</p>}
            </div>
            <div>
              <label className={labelClasses}>WhatsApp Number</label>
              <div className="relative">
                <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input type="tel" placeholder="+1 234 567 890" className={inputClasses} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
              {errors.phone && <p className="text-red-400 text-[10px] mt-1 font-bold uppercase">{errors.phone}</p>}
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">IPTV App</label>
                <button onClick={() => setIsAddingCustomApp(!isAddingCustomApp)} className="text-[10px] font-bold text-[#E67E22] hover:underline">
                  {isAddingCustomApp ? 'Standard Apps' : '+ Custom'}
                </button>
              </div>
              <div className="relative">
                <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                {isAddingCustomApp ? (
                  <input type="text" placeholder="Enter App Name" className={inputClasses} value={formData.customIptvApp} onChange={e => setFormData({...formData, customIptvApp: e.target.value})} />
                ) : (
                  <select className={inputClasses + " appearance-none"} value={formData.iptvApp} onChange={e => setFormData({...formData, iptvApp: e.target.value})}>
                    {IPTV_APPS.map(app => <option key={app} value={app}>{app}</option>)}
                  </select>
                )}
              </div>
            </div>
          </div>

          {/* Conditional IBO Fields */}
          {isIBO && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white/5 rounded-[2rem] border border-[#E67E22]/20 animate-in slide-in-from-top-2 duration-300">
              <div>
                <label className={labelClasses}>MAC Address</label>
                <div className="relative">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-[#E67E22]" size={20} />
                  <input type="text" placeholder="00:1A:..." className={inputClasses} value={formData.macAddress} onChange={e => setFormData({...formData, macAddress: e.target.value})} />
                </div>
              </div>
              <div>
                <label className={labelClasses}>Device Key</label>
                <div className="relative">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-[#E67E22]" size={20} />
                  <input type="text" placeholder="123456" className={inputClasses} value={formData.deviceKey} onChange={e => setFormData({...formData, deviceKey: e.target.value})} />
                </div>
              </div>
            </div>
          )}

          {/* Section 2: Plan & Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClasses}>Package Type</label>
              <div className="relative">
                <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <select className={inputClasses + " appearance-none"} value={formData.packageType} onChange={e => setFormData({...formData, packageType: e.target.value as PackageType})}>
                  <option value={PackageType.DIAMOND}>Diamond Plan</option>
                  <option value={PackageType.LION}>Lion Plan</option>
                  <option value={PackageType.VIP}>VIP Plan</option>
                </select>
              </div>
            </div>
            <div>
              <label className={labelClasses}>Duration</label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <select className={inputClasses + " appearance-none"} value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})}>
                  <option value="1">1 Month</option>
                  <option value="3">3 Months</option>
                  <option value="6">6 Months</option>
                  <option value="12">12 Months (Pro)</option>
                </select>
              </div>
            </div>
            
            {/* Pricing Controls */}
            <div className="md:col-span-2 space-y-4">
              <label className={labelClasses}>Price Tier</label>
              <div className="flex gap-4">
                {[29.99, 39.99, 49.99].map(p => (
                  <button 
                    key={p} 
                    onClick={() => setFormData({...formData, price: p, isCustomPrice: false})} 
                    className={`flex-1 py-4 rounded-2xl font-bold transition-all border-2 ${formData.price === p && !formData.isCustomPrice ? 'bg-[#E67E22] text-white border-[#E67E22]' : 'bg-white/5 text-gray-400 border-transparent hover:bg-white/10'}`}
                  >
                    €{p}
                  </button>
                ))}
                <button 
                  onClick={() => setFormData({...formData, isCustomPrice: true})} 
                  className={`flex-1 py-4 rounded-2xl font-bold transition-all border-2 ${formData.isCustomPrice ? 'bg-[#E67E22] text-white border-[#E67E22]' : 'bg-white/5 text-gray-400 border-transparent hover:bg-white/10'}`}
                >
                  Custom
                </button>
              </div>
              {formData.isCustomPrice && (
                <div className="relative animate-in slide-in-from-left-4">
                  <Euro className="absolute left-4 top-1/2 -translate-y-1/2 text-[#E67E22]" size={20} />
                  <input type="number" placeholder="Enter Custom Price" className={inputClasses} value={formData.customPrice} onChange={e => setFormData({...formData, customPrice: e.target.value})} />
                </div>
              )}
            </div>

            <div>
              <label className={labelClasses}>Start Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input type="date" className={inputClasses} value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
              </div>
            </div>
            <div>
              <label className={labelClasses}>Expiry Date (Calculated)</label>
              <div className="relative opacity-60">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input type="text" readOnly className={inputClasses + " cursor-not-allowed"} value={new Date(expiryDate).toLocaleDateString()} />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 bg-white/5 border-t border-white/5 flex gap-4 justify-end items-center">
          <button onClick={onClose} className="px-6 py-3 text-white/60 hover:text-white font-bold transition-colors">Cancel</button>
          <button 
            onClick={handleSave} 
            disabled={!isFormValid}
            className="px-10 py-4 bg-[#E67E22] text-white rounded-2xl font-bold shadow-xl shadow-[#E67E22]/30 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
          >
            {clientToEdit ? 'Update Client' : 'Save Client'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddClientModal;
