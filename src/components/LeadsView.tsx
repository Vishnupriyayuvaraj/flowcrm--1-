import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Sparkles, 
  Plus, 
  X, 
  Trash2, 
  Phone, 
  Mail, 
  Globe, 
  Building, 
  User, 
  DollarSign, 
  MapPin, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Tag,
  Clock,
  CheckCircle,
  FileText
} from 'lucide-react';
import { Lead, Contact, LeadStatus, Note } from '../types';

interface LeadsViewProps {
  leads: Lead[];
  contacts: Contact[];
  onAddLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'workspaceId' | 'notes' | 'activities'>, initialNote?: string) => void;
  onUpdateLeadStatus: (leadId: string, status: LeadStatus) => void;
  onAddNoteToLead: (leadId: string, noteContent: string) => void;
  onDeleteLead: (leadId: string) => void;
  onScoreLead: (leadId: string) => void;
  selectedLeadId: string | null;
  onSetSelectedLeadId: (id: string | null) => void;
  onAddTask: (title: string, dueDate: string, type: 'Call' | 'Meeting' | 'Proposal' | 'Follow-up', associatedId?: string, associatedName?: string) => void;
  teamMembers: string[];
  viewMode?: 'leads' | 'contacts';
}

export default function LeadsView({
  leads,
  contacts,
  onAddLead,
  onUpdateLeadStatus,
  onAddNoteToLead,
  onDeleteLead,
  onScoreLead,
  selectedLeadId,
  onSetSelectedLeadId,
  onAddTask,
  teamMembers,
  viewMode,
}: LeadsViewProps) {
  // Navigation tabs within view
  const [activeTab, setActiveTab] = useState<'leads' | 'contacts'>(viewMode || 'leads');

  React.useEffect(() => {
    if (viewMode) {
      setActiveTab(viewMode);
    }
  }, [viewMode]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [industryFilter, setIndustryFilter] = useState<string>('all');

  // New Lead state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLead, setNewLead] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    website: '',
    industry: 'Technology',
    address: '',
    status: 'New' as LeadStatus,
    tagsString: '',
    value: 5000,
    assignedTo: teamMembers[0] || 'Alex Johnson',
    avatar: '',
  });
  const [initialNote, setInitialNote] = useState('');

  // Add notes state
  const [newNoteText, setNewNoteText] = useState('');

  // Quick task adding state linked to lead
  const [quickTaskTitle, setQuickTaskTitle] = useState('');
  const [quickTaskType, setQuickTaskType] = useState<'Call' | 'Meeting' | 'Proposal' | 'Follow-up'>('Call');
  const [quickTaskDate, setQuickTaskDate] = useState('');

  // AI Loading animations state
  const [loadingAI, setLoadingAI] = useState<{[key: string]: boolean}>({});

  const handleCreateLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLead.name || !newLead.company) return;

    const tags = newLead.tagsString
      ? newLead.tagsString.split(',').map(t => t.trim()).filter(Boolean)
      : [];

    onAddLead({
      name: newLead.name,
      email: newLead.email,
      phone: newLead.phone,
      company: newLead.company,
      website: newLead.website,
      industry: newLead.industry,
      address: newLead.address,
      status: newLead.status,
      tags: tags,
      value: Number(newLead.value),
      score: Math.floor(Math.random() * 30) + 40, // baseline AI score
      summary: `${newLead.name} is a contact from ${newLead.company}, categorized under ${newLead.industry}.`,
      assignedTo: newLead.assignedTo,
      avatar: newLead.avatar,
    }, initialNote);

    // Reset Form
    setNewLead({
      name: '',
      email: '',
      phone: '',
      company: '',
      website: '',
      industry: 'Technology',
      address: '',
      status: 'New',
      tagsString: '',
      value: 5000,
      assignedTo: teamMembers[0] || 'Alex Johnson',
      avatar: '',
    });
    setInitialNote('');
    setShowAddModal(false);
  };

  const handleAddNoteSubmit = (e: React.FormEvent, leadId: string) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    onAddNoteToLead(leadId, newNoteText.trim());
    setNewNoteText('');
  };

  const handleQuickTaskAdd = (e: React.FormEvent, lead: Lead) => {
    e.preventDefault();
    if (!quickTaskTitle.trim() || !quickTaskDate) return;
    
    // Add task
    onAddTask(quickTaskTitle, quickTaskDate, quickTaskType, lead.id, lead.name);
    
    // Reset inputs
    setQuickTaskTitle('');
    setQuickTaskDate('');
    setQuickTaskType('Call');
  };

  // Perform client-side simulated high-fidelity AI Action
  const triggerAIScoringAndSummary = (leadId: string) => {
    setLoadingAI(prev => ({ ...prev, [leadId]: true }));

    setTimeout(() => {
      onScoreLead(leadId);
      setLoadingAI(prev => ({ ...prev, [leadId]: false }));
    }, 1500); // simulated compilation
  };

  const getStatusBadgeClass = (status: LeadStatus) => {
    switch (status) {
      case 'New': return 'bg-cyan-50 text-cyan-700 border-cyan-100';
      case 'Contacted': return 'bg-violet-50 text-violet-700 border-violet-100';
      case 'Qualified': return 'bg-purple-50 text-purple-700 border-purple-100';
      case 'Proposal Sent': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Negotiation': return 'bg-pink-50 text-pink-700 border-pink-100';
      case 'Won': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Lost': return 'bg-red-50 text-red-700 border-red-100';
    }
  };

  // Filter criteria
  const filteredLeads = leads.filter(l => {
    const matchesSearch = l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          l.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          l.industry.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || l.status === statusFilter;
    const matchesIndustry = industryFilter === 'all' || l.industry === industryFilter;

    return matchesSearch && matchesStatus && matchesIndustry;
  });

  const filteredContacts = contacts.filter(c => {
    return c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           c.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
           c.industry.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const selectedLead = leads.find(l => l.id === selectedLeadId);

  // Industries list for filters
  const uniqueIndustries = Array.from(new Set(leads.map(l => l.industry))).filter(Boolean);

  return (
    <div id="leads-container-master" className="flex-1 flex overflow-hidden bg-slate-50 relative h-full">
      
      {/* Primary Grid List Column */}
      <div className={`flex-1 flex flex-col min-w-0 h-full overflow-y-auto p-4 md:p-6 space-y-6 ${selectedLeadId ? 'hidden md:flex md:max-w-[55%] border-r border-slate-200' : 'flex'}`}>
        
        {/* Header toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Workspace Directory</h2>
            <p className="text-sm text-slate-500">Manage pipeline leads, corporate accounts, and automated AI insights.</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-1.5 px-4 py-2.5 bg-violet-605 hover:bg-violet-750 active:translate-y-px text-white text-xs font-semibold rounded-xl tracking-wide shadow-md shadow-violet-600/10 cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Live Lead</span>
          </button>
        </div>

        {/* Search and Advanced Filters Panel */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3.5">
          {/* Tabs */}
          <div className="flex border-b border-slate-100 pb-2.5">
            <button
              onClick={() => setActiveTab('leads')}
              className={`pb-2 px-4 text-xs font-bold border-b-2 tracking-wide cursor-pointer transition-colors ${
                activeTab === 'leads' ? 'border-[#7C3AED] text-[#7C3AED]' : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              Leads Pipeline ({filteredLeads.length})
            </button>
            <button
              onClick={() => setActiveTab('contacts')}
              className={`pb-2 px-4 text-xs font-bold border-b-2 tracking-wide cursor-pointer transition-colors ${
                activeTab === 'contacts' ? 'border-[#7C3AED] text-[#7C3AED]' : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              Corporate Contacts ({filteredContacts.length})
            </button>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-3">
            {/* Find search bar */}
            <div className="flex-1 relative">
              <span className="absolute inset-y-0 left-3 flex items-center pr-2">
                <Search className="w-4 h-4 text-slate-400" />
              </span>
              <input
                type="text"
                placeholder={`Search by name, company, or industry tags...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs py-2.5 pl-9 pr-4 bg-[#FAF9FC] hover:bg-slate-50 text-slate-700 border border-[#EDE9F3] rounded-xl focus:outline-none focus:border-violet-600 transition-colors"
              />
            </div>

            {activeTab === 'leads' && (
              <>
                {/* Status select filter */}
                <div className="w-full md:w-36">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-[#EDE9F3] rounded-xl focus:outline-none focus:border-violet-600 cursor-pointer"
                  >
                    <option value="all">All Stages</option>
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Proposal Sent">Proposal Sent</option>
                    <option value="Negotiation">Negotiation</option>
                    <option value="Won">Won</option>
                    <option value="Lost">Lost</option>
                  </select>
                </div>

                {/* Industry select filter */}
                <div className="w-full md:w-40">
                  <select
                    value={industryFilter}
                    onChange={(e) => setIndustryFilter(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-[#EDE9F3] rounded-xl focus:outline-none focus:border-violet-600 cursor-pointer"
                  >
                    <option value="all">All Industries</option>
                    {uniqueIndustries.map(ind => (
                      <option key={ind} value={ind}>{ind}</option>
                    ))}
                  </select>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Data List Display */}
        {activeTab === 'leads' ? (
          <div className="space-y-3">
            {filteredLeads.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-2xl border border-slate-100 shadow-sm text-slate-400">
                <p className="font-semibold text-sm">No workspace leads match these settings</p>
                <p className="text-xs text-slate-400 mt-1">Refine your active filters or clear search query.</p>
              </div>
            ) : (
              filteredLeads.map((lead) => {
                const isSelected = selectedLeadId === lead.id;
                return (
                  <div
                    key={lead.id}
                    onClick={() => onSetSelectedLeadId(isSelected ? null : lead.id)}
                    className={`p-4 bg-white rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      isSelected 
                        ? 'border-violet-500 ring-2 ring-violet-500/10 bg-violet-50/5' 
                        : 'border-slate-150 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start space-x-3.5">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-600 shrink-0 overflow-hidden border border-slate-200">
                        {lead.avatar ? (
                          <img src={lead.avatar} alt={lead.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          lead.name.split(' ').map(n=>n[0]).join('')
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                          <h4 className="text-sm font-bold text-slate-800">{lead.name}</h4>
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadgeClass(lead.status)}`}>
                            {lead.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 flex items-center space-x-1">
                          <Building className="w-3.5 h-3.5 text-slate-400" />
                          <span>{lead.company}</span>
                          <span className="text-slate-300">•</span>
                          <span>{lead.industry}</span>
                        </p>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {lead.tags.map((tag, idx) => (
                            <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-medium">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 sm:self-center self-end shrink-0">
                      <div className="text-right">
                        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Opportunity</p>
                        <p className="text-sm font-extrabold text-slate-800">${lead.value.toLocaleString()}</p>
                      </div>

                      {/* Score Badge */}
                      <div className="text-center">
                        <p className="text-[9px] text-violet-405 font-bold uppercase tracking-wider">AI Score</p>
                        <div className={`w-8.5 h-8.5 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                          lead.score >= 80 ? 'border-emerald-500 text-emerald-600 bg-emerald-50' :
                          lead.score >= 60 ? 'border-amber-400 text-amber-600 bg-amber-50' :
                          'border-slate-300 text-slate-500 bg-slate-100'
                        }`}>
                          {lead.score}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300" />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        ) : (
          /* Contacts Directory list */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredContacts.length === 0 ? (
              <div className="col-span-full bg-white p-12 text-center rounded-2xl border border-[#EDE9F3] shadow-sm text-slate-400">
                <p className="font-semibold text-sm">No corporate contacts recorded in this space.</p>
              </div>
            ) : (
              filteredContacts.map((contact) => (
                <div key={contact.id} className="p-4 bg-white rounded-2xl border border-[#EDE9F3] hover:border-slate-350 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-start space-x-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-600 shrink-0 overflow-hidden border border-slate-200">
                        {contact.avatar ? (
                          <img src={contact.avatar} alt={contact.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          contact.name.split(' ').map(n=>n[0]).join('')
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="text-sm font-bold text-slate-900 truncate">{contact.name}</h4>
                            <p className="text-xs text-violet-600 font-semibold">{contact.title}</p>
                          </div>
                          <span className="text-[10px] text-slate-400 font-medium shrink-0">Created {new Date(contact.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1.5 mt-3 text-xs text-slate-500">
                      <p className="flex items-center space-x-1.5 leading-none">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        <span>{contact.company} — {contact.industry}</span>
                      </p>
                      <p className="flex items-center space-x-1.5 leading-none">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{contact.email}</span>
                      </p>
                      <p className="flex items-center space-x-1.5 leading-none">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{contact.phone}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-3.5">
                    {contact.tags.map((tag, idx) => (
                      <span key={idx} className="text-[9px] bg-violet-50 text-violet-700 border border-violet-100/30 px-2 py-0.2 rounded font-semibold">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Slide-out detail column on selection */}
      {selectedLead && (
         <div className="w-full md:w-[45%] h-full border-l border-[#EDE9F3] bg-white flex flex-col overflow-y-auto animate-in slide-in-from-right duration-200">
          {/* Panel Header */}
          <div className="p-5 border-b border-[#EFEBF4] flex items-center justify-between bg-[#FAF9FC]">
            <div className="flex items-center space-x-2.5">
              <Sparkles className="w-4.5 h-4.5 text-violet-600" />
              <div>
                <h3 className="text-sm font-bold text-slate-800">Lead Intelligence Insight</h3>
                <p className="text-[11px] text-slate-400">Contextual client profiles and scoring loops</p>
              </div>
            </div>
            <button
              onClick={() => onSetSelectedLeadId(null)}
              className="p-1 px-1.5 hover:bg-slate-200 text-slate-400 hover:text-slate-605 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            
            {/* Primary Demographics */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 leading-none">{selectedLead.name}</h2>
                  <p className="text-xs text-violet-600 font-bold mt-1 uppercase tracking-wider">{selectedLead.company}</p>
                </div>
                <button
                  onClick={() => {
                    if (confirm(`Remove lead ${selectedLead.name}? This action cannot be undone.`)) {
                      onDeleteLead(selectedLead.id);
                      onSetSelectedLeadId(null);
                    }
                  }}
                  className="p-2 text-slate-400 hover:text-red-500 rounded-xl hover:bg-red-50 transition-colors shrink-0 cursor-pointer"
                  title="Remove Lead Profile"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Status Update Quick dropdown */}
              <div className="flex items-center space-x-2 bg-slate-50 p-2.5 border border-slate-100 rounded-2xl">
                <span className="text-[11px] text-slate-400 font-semibold uppercase shrink-0 pl-1.5">Lead Stage:</span>
                <select
                  value={selectedLead.status}
                  onChange={(e) => onUpdateLeadStatus(selectedLead.id, e.target.value as LeadStatus)}
                  className="bg-white border text-xs leading-none p-1.5 px-3 rounded-lg flex-1 focus:outline-none focus:border-indigo-500 font-bold text-slate-700 font-sans tracking-wide cursor-pointer"
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Proposal Sent">Proposal Sent</option>
                  <option value="Negotiation">Negotiation</option>
                  <option value="Won">Won</option>
                  <option value="Lost">Lost</option>
                </select>
              </div>

              {/* Grid detail stats */}
              <div className="grid grid-cols-2 gap-3.5 text-xs">
                {/* Value */}
                <div className="p-3 bg-slate-50/70 border border-slate-100 rounded-2xl">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <DollarSign className="w-3 h-3 text-slate-400" /> Contract Opportunity
                  </span>
                  <p className="text-base font-extrabold text-slate-800 mt-1">${selectedLead.value.toLocaleString()}</p>
                </div>
                {/* Teammate */}
                <div className="p-3 bg-slate-50/70 border border-slate-100 rounded-2xl">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <User className="w-3 h-3 text-slate-400" /> Assigned Rep
                  </span>
                  <p className="text-sm font-semibold text-slate-800 mt-1 truncate">{selectedLead.assignedTo}</p>
                </div>
              </div>

              {/* Technical Contacts variables */}
              <div className="space-y-2 bg-slate-55/40 p-4 border border-slate-120 rounded-2xl">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1.5 mb-1.5">Corporate Meta</h4>
                <div className="space-y-2.5 text-xs text-slate-600">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="truncate">{selectedLead.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{selectedLead.phone || 'No phone number declared'}</span>
                  </div>
                  {selectedLead.website && (
                    <div className="flex items-center space-x-2">
                       <Globe className="w-4 h-4 text-slate-400 shrink-0" />
                       <a href={`https://${selectedLead.website}`} target="_blank" rel="noreferrer" className="text-violet-600 hover:underline inline-flex items-center gap-1 truncate font-medium">
                         <span>{selectedLead.website}</span>
                         <ExternalLink className="w-3 h-3" />
                       </a>
                    </div>
                  )}
                  {selectedLead.address && (
                    <div className="flex items-start space-x-2">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <span className="leading-snug">{selectedLead.address}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* AI Automated Scoring & Summarization Module */}
            <div className="bg-slate-900 bg-gradient-to-tr from-slate-950 to-violet-950 p-5 rounded-2xl text-slate-200 border border-violet-900/40 shadow-lg relative overflow-hidden">
              <div className="absolute right-0 top-0 w-24 h-24 bg-violet-500/10 rounded-full filter blur-xl" />
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-violet-400 shrink-0" />
                  <h4 className="text-xs font-bold text-violet-300 uppercase tracking-widest leading-none">Automated Intelligence Studio</h4>
                </div>
                {/* AI Scoring Indicator */}
                <span className="text-[10px] text-emerald-450 font-extrabold bg-emerald-500/12 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  AI Lead Score: {selectedLead.score}/100
                </span>
              </div>

              {/* Score breakdown metrics description */}
              <div className="space-y-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full border-2 border-violet-400 flex items-center justify-center font-extrabold text-white text-base">
                    {selectedLead.score}%
                  </div>
                  <div className="text-xs text-slate-350 leading-snug">
                    <p className="font-semibold text-slate-205">
                      {selectedLead.score >= 80 ? 'Highly Engaged Target Profile' : 
                       selectedLead.score >= 60 ? 'Warm Business Opportunity' : 'Nurturing Opportunity Phase'}
                    </p>
                    <p className="text-[11px] text-violet-300 font-light mt-0.5">Parameters: Note activity frequency, Industry velocity alignment, and pipeline progression stats look robust.</p>
                  </div>
                </div>

                <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
                  <h5 className="text-[10px] text-violet-300 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-violet-300" /> Automated Smart Summary
                  </h5>
                  <p className="text-[11px] text-slate-350 leading-relaxed font-sans font-light">
                    {loadingAI[selectedLead.id] ? (
                      <span className="flex items-center space-x-1.5 animate-pulse text-violet-300 py-2">
                        <span className="w-1.5 h-1.5 bg-violet-400 rounded-full" />
                        <span className="w-1.5 h-1.5 bg-violet-400 rounded-full" />
                        <span className="w-1.5 h-1.5 bg-violet-400 rounded-full" />
                        <span>Recompiling lead dossier insights...</span>
                      </span>
                    ) : (
                      selectedLead.summary || 'Summary not processed yet. Click button below to compile smart summary'
                    )}
                  </p>
                </div>

                <button
                  onClick={() => triggerAIScoringAndSummary(selectedLead.id)}
                  disabled={loadingAI[selectedLead.id]}
                  className="w-full py-2 flex items-center justify-center space-x-1.5 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer border border-violet-400/40 disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  <span>{loadingAI[selectedLead.id] ? 'Processing AI models...' : 'Recalculate AI Score & Summary'}</span>
                </button>
              </div>
            </div>

            {/* Quick Task Scheduler associated to lead */}
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-indigo-500" /> Schedule Custom Checkpoint
              </h4>
              <form onSubmit={(e) => handleQuickTaskAdd(e, selectedLead)} className="space-y-2.5">
                <input
                  type="text"
                  placeholder="Task title (e.g. Discuss tech blueprints)..."
                  value={quickTaskTitle}
                  onChange={(e) => setQuickTaskTitle(e.target.value)}
                  className="w-full text-xs p-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                  required
                />
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={quickTaskType}
                    onChange={(e) => setQuickTaskType(e.target.value as any)}
                    className="text-xs p-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Call">Phone Call</option>
                    <option value="Meeting">Meeting</option>
                    <option value="Proposal">Proposal</option>
                    <option value="Follow-up">Follow-up</option>
                  </select>
                  <input
                    type="date"
                    value={quickTaskDate}
                    onChange={(e) => setQuickTaskDate(e.target.value)}
                    className="text-xs p-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-slate-875 hover:bg-indigo-600 hover:text-white text-slate-700 border border-slate-220 font-bold text-xs rounded-xl transition-all cursor-pointer text-center"
                >
                  Link Deadline to Lead Tasks list
                </button>
              </form>
            </div>

            {/* Client Activity logs / notes timeline */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center justify-between">
                <span>Client Timeline</span>
                <span className="text-[10px] text-slate-400 font-semibold">{selectedLead.notes.length} log notes</span>
              </h4>

              {/* Note Logging form */}
              <form onSubmit={(e) => handleAddNoteSubmit(e, selectedLead.id)} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Annotate customer activity or meeting feedback..."
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  className="flex-1 text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
                <button
                  type="submit"
                  className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl cursor-pointer"
                  title="Add timeline annotation"
                >
                  Add
                </button>
              </form>

              {/* Historical timeline */}
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {selectedLead.notes.length === 0 ? (
                  <p className="text-xs text-slate-400 pt-2 text-center">No notes annotated on client dossier yet.</p>
                ) : (
                  [...selectedLead.notes].reverse().map((note) => (
                    <div key={note.id} className="p-3 bg-slate-50/80 rounded-xl border border-slate-100/80 text-xs">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-slate-700">{note.author}</span>
                        <span className="text-[9px] text-slate-400">{new Date(note.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-slate-600 font-light leading-relaxed">{note.content}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* CREATE NEW LEAD MODAL DRAWER */}
      {showAddModal && (
        <div id="add-lead-modal-backdrop" className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50 overflow-y-auto backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-lg border border-slate-200 shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute right-4 top-4 p-1 rounded-lg text-slate-400 hover:text-slate-605 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-850 tracking-tight flex items-center space-x-2">
              <Plus className="w-5 h-5 text-violet-600" />
              <span>Record Lead Prospect Profile</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-5">Instantiate database records. AI metrics are bootstrapped automatically.</p>

            <form onSubmit={handleCreateLeadSubmit} className="space-y-4 text-xs font-medium">
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-500 mb-1">Contact Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter full name"
                    value={newLead.name}
                    onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-[#EDE9F3] rounded-xl focus:outline-none focus:border-violet-600 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Company/Entity Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g., Smith Design"
                    value={newLead.company}
                    onChange={(e) => setNewLead({ ...newLead, company: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-[#EDE9F3] rounded-xl focus:outline-none focus:border-violet-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-500 mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="example@co.com"
                    value={newLead.email}
                    onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-[#EDE9F3] rounded-xl focus:outline-none focus:border-violet-600 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+1 (555) 000-0000"
                    value={newLead.phone}
                    onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-[#EDE9F3] rounded-xl focus:outline-none focus:border-violet-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-500 mb-1">Website URL</label>
                  <input
                    type="text"
                    placeholder="E.g., example.com"
                    value={newLead.website}
                    onChange={(e) => setNewLead({ ...newLead, website: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-[#EDE9F3] rounded-xl focus:outline-none focus:border-violet-600 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Core Industry</label>
                  <input
                    type="text"
                    placeholder="E.g., Creative design, SaaS"
                    value={newLead.industry}
                    onChange={(e) => setNewLead({ ...newLead, industry: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-[#EDE9F3] rounded-xl focus:outline-none focus:border-violet-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-500 mb-1">Opening Opportunity Value ($)</label>
                  <input
                    type="number"
                    value={newLead.value}
                    onChange={(e) => setNewLead({ ...newLead, value: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-[#EDE9F3] rounded-xl focus:outline-none focus:border-violet-600 focus:bg-white font-extrabold"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Initial Lead Stage</label>
                  <select
                    value={newLead.status}
                    onChange={(e) => setNewLead({ ...newLead, status: e.target.value as LeadStatus })}
                    className="w-full p-2.5 bg-slate-50 border border-[#EDE9F3] rounded-xl focus:outline-none focus:border-violet-600 focus:bg-white cursor-pointer font-bold text-slate-705"
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Proposal Sent">Proposal Sent</option>
                    <option value="Negotiation">Negotiation</option>
                    <option value="Won">Won</option>
                    <option value="Lost">Lost</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Physical Address</label>
                <input
                  type="text"
                  placeholder="Address, city, zipcode"
                  value={newLead.address}
                  onChange={(e) => setNewLead({ ...newLead, address: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-[#EDE9F3] rounded-xl focus:outline-none focus:border-violet-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Profile Picture / Avatar URL (Optional)</label>
                <input
                  type="url"
                  placeholder="E.g., https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
                  value={newLead.avatar}
                  onChange={(e) => setNewLead({ ...newLead, avatar: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-[#EDE9F3] rounded-xl focus:outline-none focus:border-violet-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  placeholder="Web, High Priority, Rebrand"
                  value={newLead.tagsString}
                  onChange={(e) => setNewLead({ ...newLead, tagsString: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-[#EDE9F3] rounded-xl focus:outline-none focus:border-violet-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Teammate Handler</label>
                <select
                  value={newLead.assignedTo}
                  onChange={(e) => setNewLead({ ...newLead, assignedTo: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-[#EDE9F3] rounded-xl focus:outline-none focus:border-violet-600 focus:bg-white cursor-pointer"
                >
                  {teamMembers.map(tm => (
                    <option key={tm} value={tm}>{tm}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-505 mb-1">Timeline Annotation Note (Optional)</label>
                <textarea
                  placeholder="Provide context regarding how you got this lead..."
                  value={initialNote}
                  onChange={(e) => setInitialNote(e.target.value)}
                  className="w-full h-16 p-2.5 bg-slate-50 border border-[#EDE9F3] rounded-xl focus:outline-none focus:border-violet-600 focus:bg-white"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 hover:bg-slate-100 text-slate-500 font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-violet-605 hover:bg-violet-750 text-white font-bold rounded-xl transition-all cursor-pointer"
                >
                  Instantiate Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
