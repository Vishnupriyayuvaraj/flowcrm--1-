import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  CheckSquare, 
  TrendingUp, 
  FileText, 
  Settings, 
  ChevronDown, 
  Plus, 
  Hash, 
  Flame, 
  LogOut,
  Building,
  Layers,
  Sparkles,
  Link2,
  Users,
  X,
  Mail
} from 'lucide-react';
import { Workspace } from '../types';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  workspaces: Workspace[];
  activeWorkspace: Workspace;
  onSwitchWorkspace: (id: string) => void;
  onCreateWorkspace: (name: string) => void;
  currentUser: any;
  onLogout: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({
  activeView,
  setActiveView,
  workspaces,
  activeWorkspace,
  onSwitchWorkspace,
  onCreateWorkspace,
  currentUser,
  onLogout,
  isOpen = false,
  onClose,
}: SidebarProps) {
  const [showWSMenu, setShowWSMenu] = useState(false);
  const [newWSName, setNewWSName] = useState('');
  const [isCreatingWS, setIsCreatingWS] = useState(false);

  // We map the actual views to corresponding mockup names and icons
  const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'leads', name: 'Leads', icon: Flame },
    { id: 'contacts', name: 'Contacts', icon: Users },
    { id: 'calendar', name: 'Calendar', icon: Calendar },
    { id: 'tasks', name: 'My task', icon: CheckSquare },
    { id: 'pipeline', name: 'Deals', icon: TrendingUp },
    { id: 'aicenter', name: 'Document', icon: FileText },
    { id: 'mailtemplates', name: 'Mail Templates', icon: Mail },
    { id: 'aiassistant', name: 'AI Assistant', icon: Sparkles },
    { id: 'team', name: 'Team', icon: Layers },
  ];

  const handleCreateWS = (e: React.FormEvent) => {
    e.preventDefault();
    if (newWSName.trim()) {
      onCreateWorkspace(newWSName.trim());
      setNewWSName('');
      setIsCreatingWS(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 z-40 md:hidden transition-opacity duration-200 backdrop-blur-[1px]"
        />
      )}

      <aside 
        id="growth-sidebar" 
        className={`w-64 bg-white border-r border-[#ECE8F1] flex flex-col h-screen select-none shrink-0 font-sans p-6 text-slate-800 transition-transform duration-300 z-50
          max-md:fixed max-md:top-0 max-md:bottom-0 max-md:left-0 
          ${isOpen ? 'max-md:translate-x-0' : 'max-md:-translate-x-full md:translate-x-0'}
        `}
      >
        
        {/* Brand Header: "Growth" Logo from Figma Mockup */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2">
            {/* Growth brand custom visual G/W-like symbol */}
            <div className="w-8 h-8 rounded-xl bg-black flex items-center justify-center text-white shrink-0 shadow-sm">
              <svg viewBox="0 0 100 100" className="w-5 h-5 fill-none stroke-white stroke-[15]" strokeLinecap="round">
                <path d="M 20 80 C 20 30, 80 30, 80 80 C 80 50, 50 20, 20 20 px" />
                <circle cx="50" cy="50" r="10" className="fill-white" />
              </svg>
            </div>
            <span className="text-xl font-display font-extrabold tracking-tight text-neutral-900 flex items-center gap-1.5">
              Growth
            </span>
          </div>

          <div className="flex items-center space-x-1">
            {/* Toggle/Close button inside drawer header (mobile only) */}
            {onClose && (
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-black rounded-lg md:hidden transition-colors hover:bg-slate-50 cursor-pointer"
                title="Close Navigation"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Tenant/Workspace Switcher Button inside active gear context */}
            <div className="relative">
              <button 
                onClick={() => setShowWSMenu(!showWSMenu)} 
                className="p-1.5 hover:bg-slate-105 rounded-xl text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                title="Switch Workspace Tenant"
              >
                <Settings className="w-4 h-4" />
              </button>
              
              {showWSMenu && (
                <div id="workspace-dropdown" className="absolute left-0 mt-2 w-56 bg-white border border-[#E9E4F0] rounded-2xl shadow-xl p-3 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-2 px-1">Active Space</span>
                  <div className="max-h-48 overflow-y-auto mb-2 space-y-1.5 pr-1">
                    {workspaces.map((ws) => (
                      <button
                        key={ws.id}
                        onClick={() => {
                          onSwitchWorkspace(ws.id);
                          setShowWSMenu(false);
                        }}
                        className={`w-full text-left px-2.5 py-2 rounded-xl flex items-center justify-between text-xs transition-all cursor-pointer ${
                          ws.id === activeWorkspace.id 
                            ? 'bg-black text-white font-bold' 
                            : 'text-slate-600 hover:bg-[#FAF9FC] hover:text-slate-900'
                        }`}
                      >
                        <div className="flex items-center space-x-2 truncate">
                          <Building className="w-3.5 h-3.5" />
                          <span className="truncate font-semibold">{ws.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-slate-100 pt-2.5 mt-2">
                    {!isCreatingWS ? (
                      <button
                        onClick={() => setIsCreatingWS(true)}
                        className="w-full flex items-center justify-center space-x-1.5 py-2 text-center bg-violet-50 hover:bg-violet-100 text-violet-700 text-xs rounded-xl border border-violet-100 transition-all cursor-pointer font-bold"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Create Workspace</span>
                      </button>
                    ) : (
                      <form onSubmit={handleCreateWS} className="space-y-1.5">
                        <input
                          type="text"
                          value={newWSName}
                          onChange={(e) => setNewWSName(e.target.value)}
                          placeholder="Space name..."
                          className="w-full px-2.5 py-1.5 bg-[#FAF9FC] border border-[#EDE9F3] rounded-lg text-slate-800 text-xs focus:outline-none focus:border-violet-600 focus:bg-white"
                          autoFocus
                        />
                        <div className="flex space-x-1.5 justify-end">
                          <button
                            type="button"
                            onClick={() => setIsCreatingWS(false)}
                            className="px-2.5 py-1 text-[10px] text-slate-400 hover:text-slate-600 font-semibold"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-2.5 py-1 text-[10px] bg-black text-white rounded-lg font-bold"
                          >
                            Add
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      {/* Main Navigation links */}
      <nav className="space-y-1.5 mb-8">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-tight transition-all group cursor-pointer ${
                isActive 
                  ? 'bg-black text-white shadow-sm' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-black'
              }`}
            >
              <IconComponent className={`w-4 h-4 transition-colors ${
                isActive ? 'text-white' : 'text-slate-400 group-hover:text-black'
              }`} />
              <span className="flex-1 text-left">{item.name}</span>
            </button>
          );
        })}
      </nav>

      {/* INTEGRATION Section */}
      <div className="mb-6">
        <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block mb-3 px-1">
          INTEGRATION
        </label>
        <div className="space-y-1">
          <button 
            type="button"
            onClick={() => setActiveView('aicenter')}
            className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-50 hover:text-black transition-all cursor-pointer"
          >
            <div className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
            <span className="flex-1 text-left">Slack</span>
          </button>
          <button 
            type="button"
            onClick={() => setActiveView('aicenter')}
            className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-50 hover:text-black transition-all cursor-pointer"
          >
            <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
            <span className="flex-1 text-left">Discord</span>
          </button>
          <button 
            type="button"
            onClick={() => setActiveView('aicenter')}
            className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-bold text-[#7C3AED] hover:bg-violet-50 transition-all text-left cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 shrink-0" />
            <span className="flex-1">Add Plugin</span>
          </button>
        </div>
      </div>

      {/* TEAMS Section */}
      <div className="mb-8">
        <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block mb-3 px-1">
          TEAMS
        </label>
        <div className="space-y-1">
          <button 
            type="button"
            onClick={() => setActiveView('team')}
            className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-50 hover:text-black transition-all cursor-pointer"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span className="flex-1 text-left">Seo</span>
          </button>
          <button 
            type="button"
            onClick={() => setActiveView('team')}
            className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-50 hover:text-black transition-all cursor-pointer"
          >
            <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
            <span className="flex-1 text-left">Marketing</span>
          </button>
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-slate-100 flex flex-col gap-3">
        {/* Workspace Active status metadata pill */}
        <div className="px-3 py-2 bg-[#FAF9FC] border border-[#ECE8F1] rounded-xl flex items-center justify-between text-[10px]">
          <span className="text-slate-400 font-bold">Space: <strong className="text-black">{activeWorkspace.plan}</strong></span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>

        {/* User Identity Details context & Logout button */}
        <button 
          onClick={() => setActiveView('team')}
          className="flex items-center space-x-2.5 p-1 text-left hover:bg-slate-50 rounded-xl transition-all cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-neutral-900 border border-slate-205 flex items-center justify-center font-bold text-white text-xs shrink-0 uppercase">
            {currentUser?.avatar || 'AJ'}
          </div>
          <div className="overflow-hidden flex-1">
            <p className="text-xs font-bold text-slate-800 truncate leading-none">{currentUser?.name || 'Alex Johnson'}</p>
            <p className="text-[10px] text-slate-400 truncate mt-1">{currentUser?.email || 'alex@flowcrm.app'}</p>
          </div>
        </button>

        <button
          onClick={onLogout}
          className="w-full py-2.5 bg-neutral-50 hover:bg-[#FAF9FC] text-slate-500 hover:text-rose-600 border border-[#ECE8F1] rounded-xl font-bold text-[9px] uppercase tracking-wider cursor-pointer text-center transition-all flex items-center justify-center gap-1.5"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Logout Session</span>
        </button>
      </div>
    </aside>
    </>
  );
}
