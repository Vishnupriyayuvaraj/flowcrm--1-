import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Sparkles, 
  DollarSign, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Award,
  TrendingUp,
  X
} from 'lucide-react';
import { Deal, DealStage, Lead } from '../types';

interface PipelineViewProps {
  deals: Deal[];
  leads: Lead[];
  onAddDeal: (title: string, company: string, value: number, stage: DealStage, probability: number, closingDate: string, assignedTo: string, leadId?: string) => void;
  onUpdateDealStage: (dealId: string, stage: DealStage) => void;
  onDeleteDeal: (dealId: string) => void;
  teamMembers: string[];
}

export default function PipelineView({
  deals,
  leads,
  onAddDeal,
  onUpdateDealStage,
  onDeleteDeal,
  teamMembers,
}: PipelineViewProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDeal, setNewDeal] = useState({
    title: '',
    company: '',
    value: 5000,
    stage: 'New' as DealStage,
    probability: 50,
    closingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    assignedTo: teamMembers[0] || 'Alex Johnson',
    associatedLeadId: 'none',
  });

  const columns: { stage: DealStage; label: string; bg: string; color: string }[] = [
    { stage: 'New', label: 'Potential New', bg: 'bg-slate-100/50 border-slate-200', color: 'text-cyan-800' },
    { stage: 'Qualified', label: 'Qualified Deal', bg: 'bg-violet-50/20 border-violet-105/70', color: 'text-violet-850' },
    { stage: 'Proposal', label: 'Proposal Sent', bg: 'bg-amber-50/15 border-amber-100/60', color: 'text-amber-805' },
    { stage: 'Negotiation', label: 'In Negotiation', bg: 'bg-pink-50/10 border-pink-100/50', color: 'text-pink-805' },
    { stage: 'Won', label: 'Closed Won', bg: 'bg-emerald-50/20 border-emerald-100/80', color: 'text-emerald-805' },
    { stage: 'Lost', label: 'Closed Lost', bg: 'bg-red-50/10 border-red-100/40', color: 'text-red-805' },
  ];

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeal.title || !newDeal.company) return;

    onAddDeal(
      newDeal.title,
      newDeal.company,
      Number(newDeal.value),
      newDeal.stage,
      Number(newDeal.probability),
      newDeal.closingDate,
      newDeal.assignedTo,
      newDeal.associatedLeadId === 'none' ? undefined : newDeal.associatedLeadId
    );

    // Reset Form
    setNewDeal({
      title: '',
      company: '',
      value: 5000,
      stage: 'New',
      probability: 50,
      closingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      assignedTo: teamMembers[0] || 'Alex Johnson',
      associatedLeadId: 'none',
    });
    setShowAddModal(false);
  };

  const handleStageShift = (deal: Deal, direction: 'left' | 'right') => {
    const stageFlow: DealStage[] = ['New', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost'];
    const currentIndex = stageFlow.indexOf(deal.stage);
    let nextIndex = direction === 'left' ? currentIndex - 1 : currentIndex + 1;
    
    // Boundary lock
    if (nextIndex >= 0 && nextIndex < stageFlow.length) {
      onUpdateDealStage(deal.id, stageFlow[nextIndex]);
    }
  };

  // Calculate sum metric per stage columns
  const getColSum = (stage: DealStage) => {
    return deals
      .filter(d => d.stage === stage)
      .reduce((sum, d) => sum + d.value, 0);
  };

  return (
    <div id="pipeline-container" className="flex-1 overflow-x-auto p-6 flex flex-col h-full bg-slate-50 space-y-6">
      
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Active Deal Pipelines</h2>
          <p className="text-xs text-slate-500">Monitor active contract stages, forecasting capabilities, and closed wins.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:translate-y-px text-white text-xs font-semibold rounded-xl shadow-md cursor-pointer transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Deal</span>
        </button>
      </div>

      {/* Aggregate Bar Summary details */}
      <div className="bg-white p-3 border border-slate-100 rounded-2xl flex items-center justify-between shadow-sm text-xs gap-3 flex-wrap">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-indigo-500" />
          <span className="font-bold text-slate-700">Pipeline Total:</span>
          <span className="font-extrabold text-slate-900">${deals.reduce((sum, d)=>sum+d.value, 0).toLocaleString()}</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 bg-indigo-400 rounded-full" />
            <span className="text-slate-500">Proposal pending: <b>${deals.filter(d=>d.stage==='Proposal').reduce((s,d)=>s+d.value,0).toLocaleString()}</b></span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full" />
            <span className="text-slate-500">Signed contracts: <b>${deals.filter(d=>d.stage==='Won').reduce((s,d)=>s+d.value,0).toLocaleString()}</b></span>
          </div>
        </div>
      </div>

      {/* Kanban Grid Columns Board */}
      <div className="flex-1 flex gap-4 min-h-0 pb-4 pr-1">
        {columns.map((col) => {
          const colDeals = deals.filter(d => d.stage === col.stage);
          const colTotalVal = getColSum(col.stage);

          return (
            <div 
              key={col.stage}
              className={`w-72 rounded-2xl border flex flex-col p-3 shrink-0 ${col.bg}`}
            >
              {/* Column header title */}
              <div className="flex items-center justify-between mb-3.5 px-1.5 shrink-0">
                <div className="flex items-center space-x-2">
                  <span className={`text-xs font-bold ${col.color}`}>{col.label}</span>
                  <span className="bg-slate-200/60 text-slate-700 text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {colDeals.length}
                  </span>
                </div>
                <span className="text-xs font-extrabold text-slate-800">${colTotalVal.toLocaleString()}</span>
              </div>

              {/* Column body cards */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1.5 min-h-[300px]">
                {colDeals.length === 0 ? (
                  <div className="border border-dashed border-slate-200 rounded-xl py-8 text-center text-slate-400 text-[11px]">
                    Empty bucket
                  </div>
                ) : (
                  colDeals.map((deal) => (
                    <div 
                      key={deal.id}
                      className="bg-white p-3.5 rounded-xl border border-slate-150 shadow-sm hover:shadow-md transition-all space-y-2.5 font-sans relative group animate-in zoom-in-95 duration-100"
                    >
                      {/* Deal title company */}
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{deal.title}</h4>
                        <p className="text-[10px] text-indigo-500 font-semibold">{deal.company}</p>
                      </div>

                      {/* Detail row value & probability and assigned */}
                      <div className="flex justify-between items-center text-[11px] text-slate-500">
                        <span className="font-bold text-slate-800 inline-flex items-center">
                          <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                          {deal.value.toLocaleString()}
                        </span>
                        <span className="bg-slate-100 px-1.5 py-0.2 rounded text-[10px] font-bold">
                          {deal.probability}% Win
                        </span>
                      </div>

                      {/* Rep assignment and target date */}
                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100 gap-1.5">
                        <span className="truncate max-w-[100px]" title={`Assigned and closed by ${deal.assignedTo}`}>
                          Rep: <b>{deal.assignedTo}</b>
                        </span>
                        <span className="flex items-center space-x-1 shrink-0 text-amber-600">
                          <Calendar className="w-3 h-3" />
                          <span>{deal.closingDate}</span>
                        </span>
                      </div>

                      {/* Active transition toggles */}
                      <div className="flex items-center justify-between pt-2">
                        {/* Shifter left */}
                        <button
                          onClick={() => handleStageShift(deal, 'left')}
                          className="p-1 border border-slate-200/80 hover:bg-slate-50 text-slate-400 hover:text-indigo-600 rounded cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
                          disabled={col.stage === 'New'}
                          title="Shift backwards"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            if (confirm(`Delete opportunity documentation on ${deal.title}?`)) {
                              onDeleteDeal(deal.id);
                            }
                          }}
                          className="text-[10px] text-slate-400 hover:text-red-500 font-medium transition-colors cursor-pointer"
                        >
                          Delete
                        </button>

                        {/* Shifter right */}
                        <button
                          onClick={() => handleStageShift(deal, 'right')}
                          className="p-1 border border-slate-200/80 hover:bg-slate-50 text-slate-400 hover:text-indigo-600 rounded cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
                          disabled={col.stage === 'Lost'}
                          title="Shift forward"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE NEW DEAL OPPORTUNITY QUICK FORM MODAL */}
      {showAddModal && (
        <div id="add-deal-modal-backdrop" className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50 overflow-y-auto backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-md border border-slate-200 shadow-2xl p-6 relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute right-4 top-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-800 tracking-tight flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <span>Dossier Deal Creation</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">Track sales parameters, setting individual close probabilities.</p>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs font-semibold text-slate-705">
              
              <div>
                <label className="block text-slate-500 mb-1">Deal Title *</label>
                <input
                  type="text"
                  required
                  placeholder="E.g., Web App Design System"
                  value={newDeal.title}
                  onChange={(e) => setNewDeal({ ...newDeal, title: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 mb-1">Company/Partner Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g., Wayne Corp"
                    value={newDeal.company}
                    onChange={(e) => setNewDeal({ ...newDeal, company: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Associate with Existing Lead</label>
                  <select
                    value={newDeal.associatedLeadId}
                    onChange={(e) => {
                      const selectedL = leads.find(l => l.id === e.target.value);
                      if (selectedL) {
                        setNewDeal({
                          ...newDeal,
                          associatedLeadId: selectedL.id,
                          company: selectedL.company,
                          value: selectedL.value,
                        });
                      } else {
                        setNewDeal({ ...newDeal, associatedLeadId: 'none' });
                      }
                    }}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white cursor-pointer font-medium"
                  >
                    <option value="none">[Unattached Offline Deal]</option>
                    {leads.map(lead => (
                      <option key={lead.id} value={lead.id}>{lead.name} ({lead.company})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 mb-1">Deal Amount ($) *</label>
                  <input
                    type="number"
                    required
                    value={newDeal.value}
                    onChange={(e) => setNewDeal({ ...newDeal, value: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Win Probability (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newDeal.probability}
                    onChange={(e) => setNewDeal({ ...newDeal, probability: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 mb-1">Initial Board Stage</label>
                  <select
                    value={newDeal.stage}
                    onChange={(e) => setNewDeal({ ...newDeal, stage: e.target.value as DealStage })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white cursor-pointer"
                  >
                    <option value="New">Potential New</option>
                    <option value="Qualified">Qualified Deal</option>
                    <option value="Proposal">Proposal Sent</option>
                    <option value="Negotiation">In Negotiation</option>
                    <option value="Won">Closed Won</option>
                    <option value="Lost">Closed Lost</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Anticipated Target Close Date</label>
                  <input
                    type="date"
                    value={newDeal.closingDate}
                    onChange={(e) => setNewDeal({ ...newDeal, closingDate: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Responsible Teammate Owner</label>
                <select
                  value={newDeal.assignedTo}
                  onChange={(e) => setNewDeal({ ...newDeal, assignedTo: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white cursor-pointer"
                >
                  {teamMembers.map(tm => (
                    <option key={tm} value={tm}>{tm}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 hover:bg-slate-100 text-slate-500 font-bold rounded-xl cursor-pointer"
                >
                  Annul
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl cursor-pointer"
                >
                  Register Opportunity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
