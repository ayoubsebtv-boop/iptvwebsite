
import React, { useState } from 'react';
import { RefreshCw, FileText, CheckCircle2, Clipboard, Zap, MessageSquare, Copy, Shield, Globe, Key, User } from 'lucide-react';

const ToolCard = ({ title, description, icon, children }: any) => (
  <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col gap-6">
    <div className="flex items-center gap-4">
      <div className="p-4 bg-[#E67E22]/10 text-[#E67E22] rounded-2xl">
        {icon}
      </div>
      <div>
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
    <div className="flex-1">
      {children}
    </div>
  </div>
);

const DataRow = ({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) => {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 group transition-all hover:bg-white hover:shadow-sm">
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="text-[#E67E22]">{icon}</div>
        <div className="overflow-hidden">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
          <p className="text-sm font-bold text-[#0D1B1E] truncate">{value || '---'}</p>
        </div>
      </div>
      <button 
        onClick={copy}
        disabled={!value}
        className={`p-2 rounded-lg transition-all ${copied ? 'bg-emerald-50 text-emerald-500' : 'text-gray-300 hover:text-[#E67E22] hover:bg-orange-50'}`}
      >
        {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
      </button>
    </div>
  );
};

const IPTVTools: React.FC = () => {
  const [m3uInput, setM3uInput] = useState('');
  const [xtreamData, setXtreamData] = useState({ host: '', username: '', password: '' });
  const [isChecking, setIsChecking] = useState(false);
  
  // Message Generator State
  const [m3uForMessage, setM3uForMessage] = useState('');
  const [copied, setCopied] = useState(false);

  const handleParseXtream = () => {
    try {
      if (!m3uInput) return;
      const url = new URL(m3uInput);
      const params = new URLSearchParams(url.search);
      
      setXtreamData({
        host: `${url.protocol}//${url.hostname}${url.port ? ':' + url.port : ''}`,
        username: params.get('username') || '',
        password: params.get('password') || ''
      });
    } catch (e) {
      alert('Invalid M3U Link format. Please check the URL.');
    }
  };

  const handleCheck = () => {
    setIsChecking(true);
    setTimeout(() => setIsChecking(false), 2000);
  };

  const generatedMessage = `Hallo! Hier ist dein IPTV-Link: 

${m3uForMessage || '[Link hier einfügen]'}

Gib mir bitte Bescheid, ob alles bei dir funktioniert. Viel Spaß!`;

  const copyToClipboard = () => {
    if (!m3uForMessage) return;
    navigator.clipboard.writeText(generatedMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in zoom-in-95 duration-500">
      <div>
        <h2 className="text-4xl font-bold text-[#0D1B1E] tracking-tight">IPTV Tools</h2>
        <p className="text-gray-500 mt-2">Essential utilities for playlist management and optimization.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Customer Message Generator */}
        <ToolCard 
          title="Customer Message Generator" 
          description="Create a ready-to-send message for your clients."
          icon={<MessageSquare size={24} />}
        >
          <div className="space-y-4">
            <input 
              type="text"
              placeholder="Paste M3U link here..."
              className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#E67E22] transition-shadow"
              value={m3uForMessage}
              onChange={(e) => setM3uForMessage(e.target.value)}
            />
            
            <div className="p-6 bg-[#0D1B1E] text-white rounded-2xl relative group">
              <p className="text-[10px] font-bold text-[#E67E22] uppercase tracking-widest mb-3">Message Preview</p>
              <pre className="text-sm font-medium whitespace-pre-wrap font-sans text-gray-300">
                {generatedMessage}
              </pre>
            </div>

            <button 
              onClick={copyToClipboard}
              disabled={!m3uForMessage}
              className={`w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${
                copied 
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                  : !m3uForMessage 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-[#E67E22] text-white hover:scale-[1.02] active:scale-95 shadow-lg shadow-[#E67E22]/20'
              }`}
            >
              {copied ? (
                <><CheckCircle2 size={18} /> Copied to Clipboard!</>
              ) : (
                <><Copy size={18} /> Copy Message</>
              )}
            </button>
          </div>
        </ToolCard>

        {/* M3U to Xtream Data */}
        <ToolCard 
          title="M3U to Xtream Data" 
          description="Extract Host, Username, and Password from an M3U link."
          icon={<RefreshCw size={24} />}
        >
          <div className="space-y-4">
            <div className="flex gap-2">
              <input 
                type="text"
                placeholder="Paste your M3U link here..."
                className="flex-1 p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#E67E22] transition-shadow"
                value={m3uInput}
                onChange={(e) => setM3uInput(e.target.value)}
              />
              <button 
                onClick={handleParseXtream}
                className="px-6 bg-[#0D1B1E] text-white rounded-2xl font-bold hover:bg-[#1A2E33] transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <Zap size={18} className="text-[#E67E22]" /> Parse
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <DataRow label="Server Host" value={xtreamData.host} icon={<Globe size={16} />} />
              <div className="grid grid-cols-2 gap-3">
                <DataRow label="Username" value={xtreamData.username} icon={<User size={16} />} />
                <DataRow label="Password" value={xtreamData.password} icon={<Key size={16} />} />
              </div>
            </div>
            
            {xtreamData.host && (
              <p className="text-[10px] text-gray-400 italic text-center">Data successfully extracted from link.</p>
            )}
          </div>
        </ToolCard>

        <ToolCard 
          title="Playlist Checker" 
          description="Verify if a playlist URL or host is currently online."
          icon={<CheckCircle2 size={24} />}
        >
          <div className="space-y-4">
            <input 
              type="text"
              placeholder="http://server-address:port"
              className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#E67E22]"
            />
            <button 
              onClick={handleCheck}
              disabled={isChecking}
              className={`w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${
                isChecking ? 'bg-gray-100 text-gray-400' : 'bg-[#E67E22] text-white shadow-lg shadow-[#E67E22]/20'
              }`}
            >
              {isChecking ? (
                <>Verifying Status...</>
              ) : (
                <><CheckCircle2 size={18} /> Check Server Status</>
              )}
            </button>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-2xl text-center">
                <p className="text-[10px] text-gray-400 font-bold uppercase">Latency</p>
                <p className="font-bold text-[#0D1B1E]">- ms</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl text-center">
                <p className="text-[10px] text-gray-400 font-bold uppercase">Status</p>
                <p className="font-bold text-[#0D1B1E]">N/A</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl text-center">
                <p className="text-[10px] text-gray-400 font-bold uppercase">Uptime</p>
                <p className="font-bold text-[#0D1B1E]">-%</p>
              </div>
            </div>
          </div>
        </ToolCard>

        <ToolCard 
          title="Link Formatter" 
          description="Clean and standardize messy playlist strings."
          icon={<FileText size={24} />}
        >
          <div className="space-y-4">
            <textarea 
              rows={3}
              placeholder="Enter bulk links separated by new line..."
              className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#E67E22] resize-none"
            />
            <div className="flex gap-4">
              <button className="flex-1 py-4 border-2 border-gray-100 rounded-2xl font-bold hover:bg-gray-50 transition-colors">
                Clear
              </button>
              <button className="flex-1 py-4 bg-[#0D1B1E] text-white rounded-2xl font-bold hover:bg-[#1A2E33] transition-colors">
                Format List
              </button>
            </div>
          </div>
        </ToolCard>
      </div>
    </div>
  );
};

export default IPTVTools;
