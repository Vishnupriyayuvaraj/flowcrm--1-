import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Bell, 
  Building, 
  Layers,
  ArrowUpRight,
  Menu,
  ChevronDown,
  Info
} from 'lucide-react';
import { api } from './services/api';
// Types and Seeds
import { 
  Workspace, 
  WorkspaceMember,
  Lead, 
  Contact, 
  Deal, 
  Task, 
  Activity, 
  LeadStatus, 
  DealStage, 
  TaskStatus, 
  TaskType, 
  PlanType,
  Notification
} from './types';
import { 
  INITIAL_WORKSPACES, 
  INITIAL_LEADS, 
  INITIAL_CONTACTS, 
  INITIAL_DEALS, 
  INITIAL_TASKS 
} from './mockData';

// Subcomponents
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import LeadsView from './components/LeadsView';
import PipelineView from './components/PipelineView';
import TasksView from './components/TasksView';
import CalendarView from './components/CalendarView';
import AICenterView from './components/AICenterView';
import TeamView from './components/TeamView';
import LoginView from './components/LoginView';

export default function App() {
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // User Authentication State
  const [currentUser, setCurrentUser] = useState<any>(() => {
    const saved = localStorage.getItem('flowcrm_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLoginSuccess = (user: any) => {
    setCurrentUser(user);
    localStorage.setItem('flowcrm_current_user', JSON.stringify(user));
    
    // Also log an activity event
    const newActivity = {
      id: `act-login-${Date.now()}`,
      type: 'lead_updated',
      description: `User ${user.name} logged in successfully as ${user.role} of ${user.company}`,
      timestamp: new Date().toISOString(),
      user: user.name
    };
    setActivities(prev => [newActivity, ...prev]);

    // Also send a nice notification
    const newNotif = {
      id: `n-login-${Date.now()}`,
      title: 'Auth Session Mounted',
      message: `Dynamic session key mapped successfully for ${user.email}`,
      type: 'success' as const,
      timestamp: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('flowcrm_current_user');
  };

  const handleUpdateUserProfile = (updatedUser: any) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('flowcrm_current_user', JSON.stringify(updatedUser));
    
    const registered = localStorage.getItem('flowcrm_registered_users');
    if (registered) {
      const uList = JSON.parse(registered);
      const updatedList = uList.map((u: any) => u.email.toLowerCase() === updatedUser.email.toLowerCase() ? { ...u, ...updatedUser } : u);
      localStorage.setItem('flowcrm_registered_users', JSON.stringify(updatedList));
    }

    const newActivity = {
      id: `act-profile-${Date.now()}`,
      type: 'lead_updated',
      description: `Updated profile details: Name is ${updatedUser.name}, Role is ${updatedUser.role}`,
      timestamp: new Date().toISOString(),
      user: updatedUser.name
    };
    setActivities(prev => [newActivity, ...prev]);

    const newNotif = {
      id: `n-prof-${Date.now()}`,
      title: 'Identity Token Updated',
      message: 'Active profile settings saved inside browser index.',
      type: 'info' as const,
      timestamp: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Load initial databases state from localStorage
  const [workspaces, setWorkspaces] = useState<Workspace[]>(() => {
    const saved = localStorage.getItem('flowcrm_workspaces');
    return saved ? JSON.parse(saved) : INITIAL_WORKSPACES;
  });

  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string>(() => {
    const saved = localStorage.getItem('flowcrm_active_workspace_id');
    return saved || 'ws-agency'; // Vortex Agency default
  });

  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem('flowcrm_leads');
    return saved ? JSON.parse(saved) : INITIAL_LEADS;
  });
useEffect(() => {
    async function loadRealData() {
      const liveLeads = await api.getLeads();
      if (liveLeads && liveLeads.length > 0) {
        setLeads(liveLeads);
      }
    }
    loadRealData();
  }, []);
  const [contacts, setContacts] = useState<Contact[]>(() => {
    const saved = localStorage.getItem('flowcrm_contacts');
    return saved ? JSON.parse(saved) : INITIAL_CONTACTS;
  });

  const [deals, setDeals] = useState<Deal[]>(() => {
    const saved = localStorage.getItem('flowcrm_deals');
    return saved ? JSON.parse(saved) : INITIAL_DEALS;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('flowcrm_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [activities, setActivities] = useState<Activity[]>(() => {
    const saved = localStorage.getItem('flowcrm_activities');
    if (saved) return JSON.parse(saved);
    
    // Seed default activities
    return [
      { id: 'act-1', type: 'lead_created', description: 'Lead John Smith created from manual entry', timestamp: '2026-06-05T08:00:00Z', user: 'Alex Johnson' },
      { id: 'act-2', type: 'deal_updated', description: 'Updated Enterprise Global Rebrand commercial status to Negotiation', timestamp: '2026-06-05T07:15:00Z', user: 'David Carter' },
      { id: 'act-3', type: 'task_completed', description: 'Marked Prepare Wayne Enterprises onboarding materials as Completed', timestamp: '2026-06-05T05:30:00Z', user: 'Sarah Miller' }
    ];
  });

  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 'n-1', title: 'New Lead Inbound', message: 'Corporate target Barry Allen registered in space.', type: 'success', timestamp: '10m ago', read: false },
    { id: 'n-2', title: 'Task Alarm', message: 'Introductory consultation call with Robert Downey is pending.', type: 'info', timestamp: '2h ago', read: false }
  ]);
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);

  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('flowcrm_workspaces', JSON.stringify(workspaces));
    localStorage.setItem('flowcrm_active_workspace_id', activeWorkspaceId);
    localStorage.setItem('flowcrm_leads', JSON.stringify(leads));
    localStorage.setItem('flowcrm_contacts', JSON.stringify(contacts));
    localStorage.setItem('flowcrm_deals', JSON.stringify(deals));
    localStorage.setItem('flowcrm_tasks', JSON.stringify(tasks));
    localStorage.setItem('flowcrm_activities', JSON.stringify(activities));
  }, [workspaces, activeWorkspaceId, leads, contacts, deals, tasks, activities]);

  // Isolate current Workspace context
  const activeWorkspace = workspaces.find(w => w.id === activeWorkspaceId) || workspaces[0];

  const currentWorkspaceLeads = leads.filter(l => l.workspaceId === activeWorkspaceId);
  const currentWorkspaceContacts = contacts.filter(c => c.workspaceId === activeWorkspaceId);
  const currentWorkspaceDeals = deals.filter(d => d.workspaceId === activeWorkspaceId);
  const currentWorkspaceTasks = tasks.filter(t => t.workspaceId === activeWorkspaceId);
  const currentWorkspaceActivities = activities; // global log stream for mock simplicity or workspace isolated

  const teamMembersList = activeWorkspace.members.map(m => m.name);

  // LOG AUDIT TRAIL HELPER
  const logActivity = (type: Activity['type'], description: string, user = 'Alex Johnson') => {
    const newAct: Activity = {
      id: `act-${Date.now()}`,
      type,
      description,
      timestamp: new Date().toISOString(),
      user
    };
    setActivities(prev => [newAct, ...prev]);
  };

  const addNotification = (title: string, message: string, type: Notification['type'] = 'info') => {
    const newNotif: Notification = {
      id: `notif-${Date.now()}`,
      title,
      message,
      type,
      timestamp: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // --- CONTROLLERS ---

  // Workspace Switcher / creation
  const handleSwitchWorkspace = (id: string) => {
    setActiveWorkspaceId(id);
    setSelectedLeadId(null);
    logActivity('lead_updated', `Switched active corporate tenant workspace scope to ${id}`);
    addNotification('Tenant Switched', `Isolating database tables for ${workspaces.find(w=>w.id===id)?.name}.`);
  };

  const handleCreateWorkspace = (name: string) => {
    const newWSId = `ws-${Date.now()}`;
    const newWS: Workspace = {
      id: newWSId,
      name,
      plan: 'Free',
      ownerId: 'user-me',
      members: [
        { id: 'user-me', name: 'Alex Johnson', email: 'alex@flowcrm.app', role: 'Owner', status: 'Active', avatar: 'AJ' }
      ]
    };
    setWorkspaces(prev => [...prev, newWS]);
    setActiveWorkspaceId(newWSId);
    setSelectedLeadId(null);
    logActivity('lead_created', `Provisioned fresh Workspace tenant named ${name}`);
    addNotification('Workspace Created', `Welcome to your new "${name}" Sandbox space!`);
  };

  // Add Lead
  const handleAddLead = (
    newLeadData: Omit<Lead, 'id' | 'createdAt' | 'workspaceId' | 'notes' | 'activities'>, 
    initialNoteContent?: string
  ) => {
    const newId = `lead-${Date.now()}`;
    const notesArr = initialNoteContent 
      ? [{ id: `n-init-${Date.now()}`, content: initialNoteContent, author: 'Alex Johnson', createdAt: new Date().toISOString() }]
      : [];

    const newLead: Lead = {
      ...newLeadData,
      id: newId,
      notes: notesArr,
      activities: [],
      createdAt: new Date().toISOString(),
      workspaceId: activeWorkspaceId,
    };

    setLeads(prev => [newLead, ...prev]);

    // Automatically boost/create a corporate Contact card as well
    const newContact: Contact = {
      id: `c-gen-${Date.now()}`,
      name: newLeadData.name,
      email: newLeadData.email,
      phone: newLeadData.phone,
      company: newLeadData.company,
      title: 'Prospect Contact',
      industry: newLeadData.industry,
      tags: newLeadData.tags,
      createdAt: new Date().toISOString(),
      workspaceId: activeWorkspaceId,
      avatar: newLeadData.avatar
    };
    setContacts(prev => [newContact, ...prev]);

    // Automatically register as a Deal path
    const newDeal: Deal = {
      id: `d-auto-${Date.now()}`,
      title: `${newLeadData.company} Engagement Contract`,
      company: newLeadData.company,
      value: newLeadData.value,
      stage: 'New',
      probability: 30,
      closingDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      workspaceId: activeWorkspaceId,
      leadId: newId,
      assignedTo: newLeadData.assignedTo
    };
    setDeals(prev => [newDeal, ...prev]);

    logActivity('lead_created', `Added new client prospect ${newLeadData.name} at ${newLeadData.company}`);
    addNotification('Lead and Opportunity Created', `${newLeadData.name} registered and synced into standard pipeline.`);
  };

  // Update Status
  const handleUpdateLeadStatus = (leadId: string, status: LeadStatus) => {
    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        logActivity('lead_updated', `Transitioned ${l.name} to stage: ${status}`);
        return { ...l, status };
      }
      return l;
    }));

    // Update associated Deal stage as well for perfect correlation!
    setDeals(prev => prev.map(d => {
      if (d.leadId === leadId) {
        let mappedStage: DealStage = 'New';
        let prob = 30;
        if (status === 'Contacted') { mappedStage = 'New'; prob = 40; }
        else if (status === 'Qualified') { mappedStage = 'Qualified'; prob = 60; }
        else if (status === 'Proposal Sent') { mappedStage = 'Proposal'; prob = 75; }
        else if (status === 'Negotiation') { mappedStage = 'Negotiation'; prob = 85; }
        else if (status === 'Won') { mappedStage = 'Won'; prob = 100; }
        else if (status === 'Lost') { mappedStage = 'Lost'; prob = 0; }

        return { ...d, stage: mappedStage, probability: prob };
      }
      return d;
    }));
  };

  // Add Annotations notes
  const handleAddNoteToLead = (leadId: string, noteContent: string) => {
    const newNoteObj = {
      id: `note-${Date.now()}`,
      content: noteContent,
      author: 'Alex Johnson',
      createdAt: new Date().toISOString()
    };

    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        logActivity('note_added', `Logged meeting activity annotation code for ${l.name}`);
        return { ...l, notes: [...l.notes, newNoteObj] };
      }
      return l;
    }));
  };

  // Remove elements
  const handleDeleteLead = (leadId: string) => {
    const matchingLead = leads.find(l => l.id === leadId);
    setLeads(prev => prev.filter(l => l.id !== leadId));
    setDeals(prev => prev.filter(d => d.leadId !== leadId));
    logActivity('lead_updated', `Archived prospect profile ledger tracking code context: ${matchingLead?.name}`);
  };

  // Score lead
  const handleScoreLead = (leadId: string) => {
    const nextScore = Math.floor(Math.random() * 20) + 80; // trigger AI Pro Score booster
    const summaries = [
      "Contact displays excellent engagement parameters. Looking to construct standard modular libraries, targeting closure by June 25.",
      "High intent partner expressing requirements for ISO compliance levels. Ready for contractual signatures.",
      "Vibe matches core expertise pipeline. Budgets are flexible. Recommended touchpoint sequences scheduled."
    ];
    const itemSummary = summaries[Math.floor(Math.random() * summaries.length)];

    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        logActivity('lead_updated', `Recalculated smart model neural scores for ${l.name}: Score ${nextScore}/100.`);
        addNotification('AI Scoring Recalculated', `${l.name}'s scoring changed to high index: ${nextScore}%`);
        return { 
          ...l, 
          score: nextScore,
          summary: `${l.name} at ${l.company} is scored ${nextScore}% priority. ${itemSummary}`
        };
      }
      return l;
    }));
  };

  // Add live Task
  const handleAddTask = (
    title: string, 
    dueDate: string, 
    type: TaskType, 
    associatedId?: string, 
    associatedName?: string,
    assignedTo?: string
  ) => {
    const newTaskObj: Task = {
      id: `t-${Date.now()}`,
      title,
      dueDate,
      status: 'Pending',
      type,
      assignedTo: assignedTo || teamMembersList[0] || 'Alex Johnson',
      workspaceId: activeWorkspaceId,
      associatedWith: associatedId ? { type: 'lead', id: associatedId, name: associatedName || '' } : undefined
    };

    setTasks(prev => [newTaskObj, ...prev]);
    logActivity('meeting_scheduled', `Scheduled action benchmark checklist item: "${title}"`);
    addNotification('Checklist Item Scheduled', `Linked milestone created for close-tracker.`);
  };

  // Complete tasks
  const handleUpdateTaskStatus = (taskId: string, status: TaskStatus) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        logActivity('task_completed', `Completed benchmark checkpoint: ${t.title}`);
        return { ...t, status };
      }
      return t;
    }));
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  // Deal modifications
  const handleAddDeal = (
    title: string, 
    company: string, 
    value: number, 
    stage: DealStage, 
    probability: number, 
    closingDate: string, 
    assignedTo: string, 
    leadId?: string
  ) => {
    const newDeal: Deal = {
      id: `d-${Date.now()}`,
      title,
      company,
      value,
      stage,
      probability,
      closingDate,
      workspaceId: activeWorkspaceId,
      leadId,
      assignedTo
    };
    setDeals(prev => [...prev, newDeal]);
    logActivity('deal_updated', `Registered high priority deal tracking segment "${title}"`);
  };

  const handleUpdateDealStage = (dealId: string, stage: DealStage) => {
    setDeals(prev => prev.map(d => {
      if (d.id === dealId) {
        logActivity('deal_updated', `Shifted pipeline dealstage index to ${stage}`);
        return { ...d, stage };
      }
      return d;
    }));
  };

  const handleDeleteDeal = (dealId: string) => {
    setDeals(prev => prev.filter(d => d.id !== dealId));
  };

  // Workspace settings subscriptions switcher
  const handleUpdateWorkspacePlan = (plan: PlanType) => {
    setWorkspaces(prev => prev.map(w => {
      if (w.id === activeWorkspaceId) {
        return { ...w, plan };
      }
      return w;
    }));
    logActivity('lead_updated', `Upgraded active workspace suite privileges to ${plan}`);
    addNotification('Subscription Tier Modified', `Workspace active status updated to ${plan}!`);
  };

  // Member Management
  const handleAddWorkspaceMember = (name: string, email: string, role: any) => {
    const newM: WorkspaceMember = {
      id: `m-${Date.now()}`,
      name,
      email,
      role,
      status: 'Pending',
      avatar: name.split(' ').map(n=>n[0]).join('')
    };

    setWorkspaces(prev => prev.map(w => {
      if (w.id === activeWorkspaceId) {
        return { ...w, members: [...w.members, newM] };
      }
      return w;
    }));

    logActivity('lead_created', `Dispatched workspace invite dispatch seat to ${name}`);
  };

  const handleRemoveWorkspaceMember = (memberId: string) => {
    setWorkspaces(prev => prev.map(w => {
      if (w.id === activeWorkspaceId) {
        return { ...w, members: w.members.filter(m => m.id !== memberId) };
      }
      return w;
    }));
  };

  if (!currentUser) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#FAF9FC] font-sans tracking-tight">
      {/* Modern Side-Navigation */}
      <Sidebar 
        activeView={activeView}
        setActiveView={(view) => {
          setActiveView(view);
          setSidebarOpen(false); // Auto close sidebar on choice on mobile
        }}
        workspaces={workspaces}
        activeWorkspace={activeWorkspace}
        onSwitchWorkspace={(id) => {
          handleSwitchWorkspace(id);
          setSidebarOpen(false); // Auto close
        }}
        onCreateWorkspace={handleCreateWorkspace}
        currentUser={currentUser}
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Board Viewports */}
      <div className="flex-1 flex flex-col min-w-0 h-screen relative bg-[#FAF9FC]">
        
        {/* Dynamic Global Topbar Utility Indicator */}
        <header id="flowcrm-top-utility-bar" className="h-16 bg-white border-b border-[#EFEBF4] px-4 md:px-6 flex items-center justify-between shrink-0 select-none z-10">
          <div className="flex items-center space-x-2 md:space-x-3.5 min-w-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 md:hidden text-slate-500 hover:text-black hover:bg-slate-55 rounded-xl transition-all cursor-pointer shrink-0"
              title="Open Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-xs bg-[#FAF9FC] text-slate-700 font-bold px-3 py-1.5 rounded-xl flex items-center space-x-1.5 border border-[#EDE9F3] truncate max-w-[160px] xs:max-w-none">
              <Building className="w-3.5 h-3.5 text-violet-500 shrink-0" />
              <span className="truncate">Workspace: <b className="text-violet-700">{activeWorkspace.name}</b></span>
            </span>
          </div>

          <div className="flex items-center space-x-4">
            {/* Quick documentation button */}
            <div className="text-[11px] text-violet-700 font-bold bg-violet-50/70 py-1.5 px-3.5 rounded-xl flex items-center space-x-1.5 border border-violet-100/60 shadow-sm shadow-violet-50/50">
              <Sparkles className="w-3.5 h-3.5 text-violet-600 animate-pulse" />
              <span>Zenz Cloud Active</span>
            </div>

            {/* Notification drop indicator */}
            <div className="relative">
              <button 
                onClick={() => setShowNotificationMenu(!showNotificationMenu)}
                className="p-2 hover:bg-[#FAF9FC] text-slate-500 hover:text-slate-800 rounded-xl transition-all relative cursor-pointer"
              >
                <Bell className="w-4.5 h-4.5 text-slate-600" />
                {notifications.filter(n=>!n.read).length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-violet-600 rounded-full animate-bounce" />
                )}
              </button>

              {showNotificationMenu && (
                <div id="notifications-menu" className="absolute right-0 mt-3 w-80 bg-white border border-[#EDE9F3] rounded-2xl shadow-xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-xs">
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-50 mb-2.5">
                    <span className="font-extrabold text-slate-900">Workspace Activities</span>
                    <button 
                      onClick={() => {
                        setNotifications(prev => prev.map(n=>({...n, read: true})));
                        setShowNotificationMenu(false);
                      }}
                      className="text-[10px] text-[#7C3AED] hover:text-[#5B21B6] font-bold cursor-pointer"
                    >
                      Clear All
                    </button>
                  </div>
                  
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {notifications.length === 0 ? (
                      <p className="text-[11px] text-slate-400 text-center py-4">All clear!</p>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className="p-2.5 hover:bg-[#FAF9FC] rounded-xl leading-relaxed border border-transparent hover:border-[#EDE9F3] transition-all">
                          <p className="font-bold text-slate-850 flex items-center justify-between">
                            <span>{n.title}</span>
                            <span className="text-[9px] text-slate-400 font-normal">{n.timestamp}</span>
                          </p>
                          <p className="text-[11px] text-slate-500 mt-1 leading-normal">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <span className="text-slate-205 font-light">|</span>

            {/* Profile widget */}
            <button 
              onClick={() => setActiveView('team')}
              className="flex items-center space-x-2 text-left hover:opacity-80 transition-opacity cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-605 to-fuchsia-600 border border-white flex items-center justify-center font-bold text-white text-xs uppercase shadow-sm">
                {currentUser?.avatar || 'AJ'}
              </div>
              <span className="text-xs font-bold text-slate-800 hidden sm:inline-block pr-1 group-hover:text-black transition-colors">{currentUser?.name || 'Alex Johnson'}</span>
            </button>
          </div>
        </header>

        {/* Dynamic Inner Viewport Panels router */}
        <main className="flex-1 overflow-hidden h-full relative">
          {activeView === 'dashboard' && (
            <DashboardView 
              leads={currentWorkspaceLeads}
              deals={currentWorkspaceDeals}
              tasks={currentWorkspaceTasks}
              activities={currentWorkspaceActivities}
              setActiveView={setActiveView}
              onSetSelectedLeadId={setSelectedLeadId}
              onCompleteTask={(tid) => handleUpdateTaskStatus(tid, 'Completed')}
              onAddTask={handleAddTask}
            />
          )}

          {activeView === 'leads' && (
            <LeadsView 
              leads={currentWorkspaceLeads}
              contacts={currentWorkspaceContacts}
              onAddLead={handleAddLead}
              onUpdateLeadStatus={handleUpdateLeadStatus}
              onAddNoteToLead={handleAddNoteToLead}
              onDeleteLead={handleDeleteLead}
              onScoreLead={handleScoreLead}
              selectedLeadId={selectedLeadId}
              onSetSelectedLeadId={setSelectedLeadId}
              onAddTask={handleAddTask}
              teamMembers={teamMembersList}
            />
          )}

          {activeView === 'pipeline' && (
            <PipelineView 
              deals={currentWorkspaceDeals}
              leads={currentWorkspaceLeads}
              onAddDeal={handleAddDeal}
              onUpdateDealStage={handleUpdateDealStage}
              onDeleteDeal={handleDeleteDeal}
              teamMembers={teamMembersList}
            />
          )}

          {activeView === 'tasks' && (
            <TasksView 
              tasks={currentWorkspaceTasks}
              leads={currentWorkspaceLeads}
              onAddTask={handleAddTask}
              onUpdateTaskStatus={handleUpdateTaskStatus}
              onDeleteTask={handleDeleteTask}
              teamMembers={teamMembersList}
            />
          )}

          {activeView === 'calendar' && (
            <CalendarView 
              tasks={currentWorkspaceTasks}
              onAddTask={handleAddTask}
            />
          )}

          {activeView === 'aicenter' && (
            <AICenterView 
              leads={currentWorkspaceLeads}
              deals={currentWorkspaceDeals}
              tasks={currentWorkspaceTasks}
              onAddTask={handleAddTask}
            />
          )}

          {activeView === 'mailtemplates' && (
            <AICenterView 
              leads={currentWorkspaceLeads}
              deals={currentWorkspaceDeals}
              tasks={currentWorkspaceTasks}
              onAddTask={handleAddTask}
              defaultTab="email"
            />
          )}

          {activeView === 'aiassistant' && (
            <AICenterView 
              leads={currentWorkspaceLeads}
              deals={currentWorkspaceDeals}
              tasks={currentWorkspaceTasks}
              onAddTask={handleAddTask}
              defaultTab="assistant"
            />
          )}

          {activeView === 'team' && (
            <TeamView 
              activeWorkspace={activeWorkspace}
              onUpdateWorkspacePlan={handleUpdateWorkspacePlan}
              onAddWorkspaceMember={handleAddWorkspaceMember}
              onRemoveWorkspaceMember={handleRemoveWorkspaceMember}
              currentUser={currentUser}
              onUpdateUserProfile={handleUpdateUserProfile}
            />
          )}
        </main>

      </div>
    </div>
  );
}
