import React, { useState } from 'react';
import { 
  Plus, 
  CheckCircle2, 
  Circle, 
  Trash2, 
  Clock, 
  Briefcase, 
  User, 
  Calendar, 
  X,
  AlertCircle
} from 'lucide-react';
import { Task, TaskStatus, TaskType, Lead } from '../types';

interface TasksViewProps {
  tasks: Task[];
  leads: Lead[];
  onAddTask: (title: string, dueDate: string, type: TaskType, associatedId?: string, associatedName?: string, assignedTo?: string) => void;
  onUpdateTaskStatus: (taskId: string, status: TaskStatus) => void;
  onDeleteTask: (taskId: string) => void;
  teamMembers: string[];
}

export default function TasksView({
  tasks,
  leads,
  onAddTask,
  onUpdateTaskStatus,
  onDeleteTask,
  teamMembers,
}: TasksViewProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all');

  const [newTask, setNewTask] = useState({
    title: '',
    dueDate: new Date().toISOString().split('T')[0],
    type: 'Call' as TaskType,
    assignedTo: teamMembers[0] || 'Alex Johnson',
    associatedLeadId: 'none',
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    let assocId: string | undefined = undefined;
    let assocName: string | undefined = undefined;

    if (newTask.associatedLeadId !== 'none') {
      const matchLead = leads.find(l => l.id === newTask.associatedLeadId);
      if (matchLead) {
        assocId = matchLead.id;
        assocName = matchLead.name;
      }
    }

    onAddTask(
      newTask.title.trim(),
      newTask.dueDate,
      newTask.type,
      assocId,
      assocName,
      newTask.assignedTo
    );

    // Reset Form
    setNewTask({
      title: '',
      dueDate: new Date().toISOString().split('T')[0],
      type: 'Call',
      assignedTo: teamMembers[0] || 'Alex Johnson',
      associatedLeadId: 'none',
    });
    setShowAddModal(false);
  };

  const getTaskTypeBadge = (type: TaskType) => {
    switch (type) {
      case 'Call': return 'bg-sky-50 text-sky-700 border-sky-100';
      case 'Meeting': return 'bg-purple-50 text-purple-700 border-purple-100';
      case 'Proposal': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Follow-up': return 'bg-violet-50 text-violet-700 border-violet-100';
    }
  };

  // Filters logic
  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status overdue logic
    let matchesStatus = true;
    if (statusFilter !== 'all') {
      if (statusFilter === 'Overdue') {
        const isOverdue = new Date(t.dueDate) < new Date() && t.status !== 'Completed';
        matchesStatus = isOverdue;
      } else {
        matchesStatus = t.status === statusFilter;
      }
    }

    const matchesAssignee = assigneeFilter === 'all' || t.assignedTo === assigneeFilter;

    return matchesSearch && matchesStatus && matchesAssignee;
  });

  return (
    <div id="tasks-container" className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-slate-50">
      
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Milestone Task Reminders</h2>
          <p className="text-sm text-slate-500">Track client meetings, follow-up calls, drafts deadlines and schedule checks.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-550 text-white text-xs font-semibold rounded-xl shadow-md cursor-pointer transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Action reminder</span>
        </button>
      </div>

      {/* Numerical quick parameters bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Completed Tasks</span>
            <span className="text-xl font-bold text-slate-800">{tasks.filter(t=>t.status==='Completed').length}</span>
          </div>
          <CheckCircle2 className="w-8 h-8 text-emerald-500/80" />
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Pending Tasks</span>
            <span className="text-xl font-bold text-slate-800">{tasks.filter(t=>t.status !== 'Completed').length}</span>
          </div>
          <Clock className="w-8 h-8 text-indigo-505/80" />
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Overdue Alarms</span>
            <span className="text-xl font-bold text-red-550">
              {tasks.filter(t => t.status === 'Overdue' || (t.status !== 'Completed' && new Date(t.dueDate) < new Date())).length}
            </span>
          </div>
          <AlertCircle className="w-8 h-8 text-red-400/80" />
        </div>
      </div>

      {/* Inline controls details filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        {/* Search */}
        <input 
          type="text" 
          placeholder="Filter milestones by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:flex-1 text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:outline-none focus:bg-white focus:border-indigo-500 rounded-xl transition-all"
        />

        {/* Status */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none cursor-pointer w-full md:w-40"
        >
          <option value="all">All States</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Overdue">Overdue</option>
        </select>

        {/* Teammate */}
        <select
          value={assigneeFilter}
          onChange={(e) => setAssigneeFilter(e.target.value)}
          className="text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none cursor-pointer w-full md:w-48"
        >
          <option value="all">All Owners</option>
          {teamMembers.map(tm => (
            <option key={tm} value={tm}>{tm}</option>
          ))}
        </select>
      </div>

      {/* Main rendering list */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
        <div className="divide-y divide-slate-100">
          {filteredTasks.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <p className="font-semibold text-sm">No action reminders found in workspace</p>
              <p className="text-xs mt-1">Nurture leads or trigger emails using the AI Center.</p>
            </div>
          ) : (
            filteredTasks.map((task) => {
              const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'Completed';
              return (
                <div 
                  key={task.id} 
                  className={`p-4 flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors ${
                    task.status === 'Completed' ? 'opacity-60 bg-slate-50/30' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3.5 flex-1 min-w-0">
                    {/* Circle checklist indicator */}
                    <button
                      onClick={() => {
                        const nextStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
                        onUpdateTaskStatus(task.id, nextStatus);
                      }}
                      className="mt-0.5 text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer shrink-0"
                    >
                      {task.status === 'Completed' ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300 hover:border-slate-400" />
                      )}
                    </button>
                    
                    <div className="min-w-0">
                      <p className={`text-sm font-bold text-slate-800 truncate ${task.status === 'Completed' ? 'line-through text-slate-400 font-light' : ''}`}>
                        {task.title}
                      </p>
                      
                      <div className="flex items-center space-x-3.5 text-xs text-slate-400 mt-1 flex-wrap gap-y-1">
                        {/* Owner assignment */}
                        <span className="flex items-center space-x-1">
                          <User className="w-3.5 h-3.5" />
                          <span>Owner: <b>{task.assignedTo}</b></span>
                        </span>
                        
                        {/* Related Lead entity */}
                        {task.associatedWith && (
                          <span className="flex items-center space-x-1 text-indigo-500 font-medium">
                            <Briefcase className="w-3.5 h-3.5" />
                            <span>Linked: {task.associatedWith.name}</span>
                          </span>
                        )}

                        {/* Calendar close-date label */}
                        <span className={`flex items-center space-x-1 ${isOverdue ? 'text-red-500 font-bold bg-red-50 px-1.5 py-0.2 rounded' : ''}`}>
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Target: {task.dueDate}</span>
                          {isOverdue && <span className="text-[9px] uppercase tracking-wider pl-1 font-extrabold">Overdue</span>}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getTaskTypeBadge(task.type)}`}>
                      {task.type}
                    </span>

                    <button
                      onClick={() => {
                        if (confirm(`Remove this milestone task?`)) {
                          onDeleteTask(task.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
                      title="Delete reminder metadata"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* CREATE NEW TASK MODAL */}
      {showAddModal && (
        <div id="add-task-backdrop" className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-md border border-slate-200 shadow-2xl p-6 relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute right-4 top-4 p-1 rounded-lg text-slate-400 hover:text-slate-605 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-800 tracking-tight flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              <span>Bootstrap Action Reminder</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">Assign individual deadlines and link corporate leads.</p>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs font-semibold text-slate-705">
              
              <div>
                <label className="block text-slate-500 mb-1">Task Landmark Title *</label>
                <input
                  type="text"
                  required
                  placeholder="E.g., Call Barry Allen to review SaaS cluster SLAs"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 mb-1">Mark Category Type</label>
                  <select
                    value={newTask.type}
                    onChange={(e) => setNewTask({ ...newTask, type: e.target.value as TaskType })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white cursor-pointer font-medium"
                  >
                    <option value="Call">Phone Call</option>
                    <option value="Meeting">Co-op Meeting</option>
                    <option value="Proposal">Proposal Submission</option>
                    <option value="Follow-up">Nurturing Follow-up</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Target Action Deadline</label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 mb-1">Link Lead profile</label>
                  <select
                    value={newTask.associatedLeadId}
                    onChange={(e) => setNewTask({ ...newTask, associatedLeadId: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white cursor-pointer font-medium text-slate-705"
                  >
                    <option value="none">[Do not associate with lead]</option>
                    {leads.map(l => (
                      <option key={l.id} value={l.id}>{l.name} ({l.company})</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-slate-500 mb-1">Teammate Handler Owner</label>
                  <select
                    value={newTask.assignedTo}
                    onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white cursor-pointer"
                  >
                    {teamMembers.map(tm => (
                      <option key={tm} value={tm}>{tm}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 hover:bg-slate-100 text-slate-500 font-bold rounded-xl cursor-pointer"
                >
                  Abort
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl cursor-pointer"
                >
                  Create Live Checklist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
