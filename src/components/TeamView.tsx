import React, { useState } from 'react';
import { 
  Building, 
  ShieldCheck, 
  UserCircle, 
  Plus, 
  X, 
  Crown, 
  CheckCircle2, 
  Sparkles, 
  Lock,
  Layers,
  ChevronRight,
  TrendingUp,
  AlertOctagon
} from 'lucide-react';
import { Workspace, WorkspaceMember, PlanType } from '../types';

interface TeamViewProps {
  activeWorkspace: Workspace;
  onUpdateWorkspacePlan: (plan: PlanType) => void;
  onAddWorkspaceMember: (name: string, email: string, role: 'Owner' | 'Admin' | 'Manager' | 'Member') => void;
  onRemoveWorkspaceMember: (memberId: string) => void;
  currentUser: any;
  onUpdateUserProfile: (updatedUser: any) => void;
}

export default function TeamView({
  activeWorkspace,
  onUpdateWorkspacePlan,
  onAddWorkspaceMember,
  onRemoveWorkspaceMember,
  currentUser,
  onUpdateUserProfile,
}: TeamViewProps) {
  const [activeTab, setActiveTab] = useState<'members' | 'billing'>('members');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    role: 'Member' as 'Owner' | 'Admin' | 'Manager' | 'Member'
  });

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.name || !newMember.email) return;

    onAddWorkspaceMember(newMember.name, newMember.email, newMember.role);
    setNewMember({ name: '', email: '', role: 'Member' });
    setShowInviteModal(false);
  };

  const getPlanDetails = (plan: PlanType) => {
    switch (plan) {
      case 'Free': return {
        title: 'Free Sandbox',
        price: '$0',
        desc: 'Ideal for independent developers or starting freelancers.',
        features: ['1 Workspace admin seat', '100 Lead limit Cap', 'Offline Manual Logs', 'Standard Core Dashboards'],
        color: 'border-slate-200 hover:border-slate-350',
        badge: 'bg-slate-100 text-slate-700'
      };
      case 'Pro': return {
        title: 'Pro Commercial Studio',
        price: '$35 / mo',
        desc: 'Perfect for growing agencies, digital studios and consultants.',
        features: ['Up to 5 Workspace seats', 'Unlimited Lead Intake files', 'Self-serve AI Assistant', 'Advanced SVG Reporting Insights', 'Hourly Calendar synchronization'],
        color: 'border-violet-500 ring-2 ring-violet-500/10 bg-violet-50/5 hover:border-violet-600',
        badge: 'bg-violet-600 text-white'
      };
      case 'Business': return {
        title: 'Enterprise Business Velocity',
        price: '$99 / mo',
        desc: 'Premium cloud clusters with role assignment matrices.',
        features: ['Unlimited Workspace seats', 'AI Scoring Engine Pro', 'Automated Bulk Email copyers', 'Live team performance logs', 'Role matrix settings', '99.9% uptime SLA guarantee'],
        color: 'border-amber-400 hover:border-amber-500 hover:ring-2 hover:ring-amber-100',
        badge: 'bg-amber-500 text-amber-950 font-black'
      };
    }
  };

  return (
    <div id="team-container" className="flex-1 overflow-y-auto p-4 md:p-6 space-y-7 bg-[#FAF9FC]">
      
      {/* Top Welcome Title Grid */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Workspace Management & SaaS</h2>
          <p className="text-sm text-slate-500">Configure corporate tenants, upgrade subscription plans, and invite teammates.</p>
        </div>
      </div>

      {/* Two working sub-views tabs switcher */}
      <div className="flex border-b border-slate-220">
        <button
          onClick={() => setActiveTab('members')}
          className={`px-5 py-2.5 font-bold text-xs tracking-wider uppercase border-b-2 transition-all cursor-pointer ${
            activeTab === 'members' 
              ? 'border-violet-600 text-violet-700 font-extrabold' 
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          👤 Teammates & Profiles
        </button>
        <button
          onClick={() => setActiveTab('billing')}
          className={`px-5 py-2.5 font-bold text-xs tracking-wider uppercase border-b-2 transition-all cursor-pointer ${
            activeTab === 'billing' 
              ? 'border-violet-600 text-violet-700 font-extrabold' 
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          💳 Subscription Plans
        </button>
      </div>

      {activeTab === 'billing' ? (
        /* THREE TIER SUBSCRIPTION PLANS UPGRADE SECTORS */
        <div className="space-y-4 animate-in fade-in duration-200">
          <div>
            <h3 className="text-sm font-bold text-slate-800">SaaS Subscription Models</h3>
            <p className="text-xs text-slate-400">Scale database volumes and unlock AI capabilities as your company grows.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {(['Free', 'Pro', 'Business'] as PlanType[]).map((plan) => {
              const details = getPlanDetails(plan);
              const isActive = activeWorkspace.plan === plan;

              return (
                <div 
                  key={plan}
                  className={`p-5 bg-white rounded-2xl border transition-all flex flex-col justify-between relative h-full ${details.color} ${
                    isActive ? 'shadow-lg' : 'hover:shadow-sm'
                  }`}
                >
                  {/* Active banner */}
                  {isActive && (
                    <span className={`absolute -top-3 left-4 text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-black/10 ${details.badge}`}>
                      ★ ACTIVE SUITE
                    </span>
                  )}

                  <div>
                    <h4 className="font-extrabold text-sm text-slate-800 leading-none">{details.title}</h4>
                    <div className="flex items-baseline space-x-1.5 mt-3 mb-1">
                      <span className="text-2xl font-black text-slate-900">{details.price}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-sans">{details.desc}</p>
                    
                    <ul className="space-y-2 mt-5 text-[11px] text-slate-650 font-medium">
                      {details.features.map((f, idx) => (
                        <li key={idx} className="flex items-start space-x-1.5 leading-tight">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100">
                    {isActive ? (
                      <button
                        className="w-full py-2 bg-slate-100 text-slate-600 border border-slate-200 cursor-not-allowed font-bold text-xs rounded-xl"
                        disabled
                      >
                        Active Service Package
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          onUpdateWorkspacePlan(plan);
                          alert(`Successfully configured active tenant workspace plan to ${plan}!`);
                        }}
                        className="w-full py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-sm text-center"
                      >
                        Switch Corporate Tier
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* TEAM MEMBERS & PERSONAL PROFILE CONNECTIONS */
        <div className="space-y-7 animate-in fade-in duration-200">
          
          {/* TEAM MEMBERS PERMISSIONS LOGS SECTORS */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Workspace Teammates Ledger</h3>
                <p className="text-xs text-slate-400">Invite personnel, manage client assignments and authorize permissions roles.</p>
              </div>

              <button
                onClick={() => {
                  if (activeWorkspace.plan === 'Free') {
                    alert("Teammate invites require a Pro or Business subscription. Upgrade your workspace tier on the Subscription tab!");
                  } else {
                    setShowInviteModal(true);
                  }
                }}
                className="flex items-center space-x-1.5 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold rounded-xl cursor-pointer shadow-sm transition-all"
              >
                {activeWorkspace.plan === 'Free' ? (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Upgrade Teammates UI</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Invite Workspace Teammate</span>
                  </>
                )}
              </button>
            </div>

            {/* Member list rendering */}
            <div className="divide-y divide-slate-100 max-h-[350px] overflow-y-auto pr-1">
              {activeWorkspace.members.map((member) => (
                <div key={member.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center space-x-3.5 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center font-bold text-slate-200 text-xs shrink-0 shadow">
                      {member.avatar || member.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="text-xs font-bold text-slate-800 truncate">{member.name}</p>
                        {member.role === 'Owner' && (
                          <span className="text-[8px] bg-violet-550 text-white font-extrabold px-1.5 py-0.2 rounded flex items-center gap-0.5">
                            <Crown className="w-2.5 h-2.5 text-amber-300" /> OWNER
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 truncate">{member.email}</p>
                    </div>
                  </div>

                  {/* Status and Action Buttons */}
                  <div className="flex items-center space-x-3.5 shrink-0">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                        member.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}>
                      {member.status}
                    </span>

                    <span className="text-xs text-slate-600 font-bold underline bg-slate-50 border px-2 py-0.5 rounded-lg border-slate-150">
                      {member.role}
                    </span>

                    {member.role !== 'Owner' && (
                      <button
                        onClick={() => {
                          if (confirm(`Revoke team seat access for ${member.name}?`)) {
                            onRemoveWorkspaceMember(member.id);
                          }
                        }}
                        className="p-1 px-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-[10px] rounded border border-red-100 cursor-pointer"
                      >
                        Revoke View
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 📬 PERSONAL USER CONNECTIONS */}
          {currentUser && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <UserCircle className="w-5 h-5 text-violet-600" />
                  <span>Personal Profile Node Credentials</span>
                </h3>
                <p className="text-xs text-slate-400 font-sans leading-relaxed">Manage your active logged-in profile details and save changes immediately to our local client vault.</p>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                const targetName = (e.currentTarget.elements.namedItem('profName') as HTMLInputElement).value;
                const targetCompany = (e.currentTarget.elements.namedItem('profCompany') as HTMLInputElement).value;
                const targetRole = (e.currentTarget.elements.namedItem('profRole') as HTMLSelectElement).value;

                if (!targetName.trim() || !targetCompany.trim()) {
                  alert('Profile parameters cannot be empty.');
                  return;
                }

                const pLetters = targetName.trim().split(' ');
                const calculatedAvatar = pLetters.length > 1 
                  ? (pLetters[0].charAt(0) + pLetters[1].charAt(0)).toUpperCase()
                  : targetName.trim().substring(0, 2).toUpperCase();

                const updated = {
                  ...currentUser,
                  name: targetName.trim(),
                  company: targetCompany.trim(),
                  role: targetRole,
                  avatar: calculatedAvatar
                };

                onUpdateUserProfile(updated);
              }} className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs font-semibold text-slate-705">
                <div>
                  <label className="block text-slate-500 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    name="profName"
                    defaultValue={currentUser.name}
                    className="w-full p-2.5 bg-slate-50 border border-[#EDE9F3] rounded-xl focus:outline-none focus:border-violet-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 mb-1">Active Corporate Entity</label>
                  <input
                    type="text"
                    name="profCompany"
                    defaultValue={currentUser.company}
                    className="w-full p-2.5 bg-slate-50 border border-[#EDE9F3] rounded-xl focus:outline-none focus:border-violet-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 mb-1">Corporate Authority Level</label>
                  <select
                    name="profRole"
                    defaultValue={currentUser.role}
                    className="w-full p-2.5 bg-slate-50 border border-[#EDE9F3] rounded-xl focus:outline-none focus:border-violet-600 focus:bg-white cursor-pointer font-bold"
                  >
                    <option value="Owner">Owner (Primary Workspace License)</option>
                    <option value="Admin">Administrator (Complete controls)</option>
                    <option value="Manager">Workspace Manager</option>
                    <option value="Member">Basic Member (Limited editing)</option>
                  </select>
                </div>

                <div className="md:col-span-3 flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition-transform"
                  >
                    Commit Profile Update to DB
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* TEAM PROFILE MODAL INVITES */}
      {showInviteModal && (
        <div id="add-member-modal-backdrop" className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm animate-in fade-in duration-100">
          <div className="bg-white rounded-2xl w-full max-w-sm border border-slate-200 shadow-2xl p-6 relative">
            <button
              onClick={() => setShowInviteModal(false)}
              className="absolute right-4 top-4 p-1 rounded-lg text-slate-400 hover:text-slate-605 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-800 tracking-tight flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-violet-600" />
              <span>Seat Invite Matrix</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">Assign role authorization models to workspace assets.</p>

            <form onSubmit={handleInviteSubmit} className="space-y-4 text-xs font-semibold text-slate-705">
              
              <div>
                <label className="block text-slate-505 mb-1">Collaborator Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="E.g., Clara Oswald"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-[#EDE9F3] rounded-xl focus:outline-none focus:border-violet-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-505 mb-1">Corporate Email *</label>
                <input
                  type="email"
                  required
                  placeholder="clara@vortex.com"
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-[#EDE9F3] rounded-xl focus:outline-none focus:border-violet-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-505 mb-1">Privilege Role Seat</label>
                <select
                  value={newMember.role}
                  onChange={(e) => setNewMember({ ...newMember, role: e.target.value as any })}
                  className="w-full p-2.5 bg-slate-50 border border-[#EDE9F3] rounded-xl focus:outline-none focus:border-violet-600 focus:bg-white cursor-pointer text-xs font-bold text-slate-705"
                >
                  <option value="Admin">Administrator (Complete controls)</option>
                  <option value="Manager">Workspace Manager</option>
                  <option value="Member">Basic Member (Limited editing)</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 hover:bg-slate-100 text-slate-500 font-bold rounded-xl cursor-pointer"
                >
                  Abort
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-violet-605 hover:bg-violet-750 text-white font-bold rounded-xl cursor-pointer"
                >
                  Dispatch Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
