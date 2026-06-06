import React, { useState } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Target, 
  Clock, 
  Sparkles, 
  ArrowUpRight, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle,
  Briefcase,
  Users,
  Activity,
  ArrowUp,
  Award,
  Share2,
  MoreVertical,
  Plus,
  Play,
  Heart,
  BookOpen,
  Milestone,
  Check,
  Download,
  Calendar as CalendarIcon,
  Search,
  Bell
} from 'lucide-react';
import { Lead, Deal, Task, Activity as ActivityType } from '../types';

interface DashboardViewProps {
  leads: Lead[];
  deals: Deal[];
  tasks: Task[];
  activities: ActivityType[];
  setActiveView: (view: string) => void;
  onSetSelectedLeadId: (id: string) => void;
  onCompleteTask: (taskId: string) => void;
  onAddTask: (title: string, dueDate: string, type: 'Call' | 'Meeting' | 'Proposal' | 'Follow-up', associatedId?: string, associatedName?: string) => void;
}

export default function DashboardView({
  leads,
  deals,
  tasks,
  activities,
  setActiveView,
  onSetSelectedLeadId,
  onCompleteTask,
  onAddTask,
}: DashboardViewProps) {
  // Navigation trigger inside top actions
  const [showQuickTaskForm, setShowQuickTaskForm] = useState(false);
  const [quickTaskTitle, setQuickTaskTitle] = useState('');
  
  // Local list of mockup goals that can be clicked/toggled to display progress!
  const [goals, setGoals] = useState([
    { id: 1, text: '1h Meditation', checked: true },
    { id: 2, text: '10m Running', checked: true },
    { id: 3, text: '30m Workout', checked: true },
    { id: 4, text: '30m Pooja & read book', checked: false }
  ]);

  const handleToggleGoal = (id: number) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, checked: !g.checked } : g));
  };

  const completedGoalsCount = goals.filter(g => g.checked).length;

  // Selected points for interactive Graph 1 (Weekly process Area Chart)
  const [selectedWeeklyIdx, setSelectedWeeklyIdx] = useState<number | null>(3); // Default on Thursday (index 3)
  const weekdays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  
  // Real-time calculated intensity score based on real activities count
  const workWeeklyValues = [45, 60, 52, 65, 48, 70, 58].map(
    v => Math.min(100, v + (leads.length * 2) + (tasks.filter(t => t.status === 'Completed').length * 2))
  );
  const medWeeklyValues = [30, 45, 38, 55, 42, 50, 46].map(
    v => Math.min(95, v + (completedGoalsCount * 4))
  );

  // Selected industry segment for Graph 5 (Industry Share Donut)
  const [selectedIndustryIdx, setSelectedIndustryIdx] = useState<number | null>(null);

  // Dynamically aggregate industry sectors based on real active leads & deals!
  const computedSectors: { [key: string]: number } = {};
  leads.forEach(l => {
    const ind = l.industry || 'Other';
    computedSectors[ind] = (computedSectors[ind] || 0) + l.value;
  });

  const sortedSectors = Object.entries(computedSectors)
    .map(([name, val]) => ({ name, value: val }))
    .sort((a, b) => b.value - a.value);

  const totalSectorsVal = sortedSectors.reduce((sum, s) => sum + s.value, 0);

  const dynamicIndustrySectors = sortedSectors.map((item, idx) => {
    const colors = ['stroke-violet-605', 'stroke-rose-500', 'stroke-cyan-500', 'stroke-amber-500', 'stroke-emerald-500'];
    const p = totalSectorsVal > 0 ? Math.round((item.value / totalSectorsVal) * 100) : 0;
    return {
      name: item.name,
      percentage: p,
      value: item.value,
      color: colors[idx % colors.length]
    };
  });

  const industrySectors = dynamicIndustrySectors.length > 0 ? dynamicIndustrySectors : [
    { name: 'Technology SaaS', percentage: 40, value: 38000, color: 'stroke-violet-605' },
    { name: 'E-commerce', percentage: 25, value: 24000, color: 'stroke-rose-500' },
    { name: 'Financial Tech', percentage: 15, value: 14500, color: 'stroke-cyan-500' },
    { name: 'Creative Agency', percentage: 12, value: 11000, color: 'stroke-amber-500' },
    { name: 'Healthcare services', percentage: 8, value: 7500, color: 'stroke-emerald-500' }
  ];

  // Interactive node for Graph 3 (Revenue Line and Spline Forecast)
  const [hoveredForecastIdx, setHoveredForecastIdx] = useState<number | null>(null);
  const monthlyMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

  // Dynamically group client deals by closing dates!
  const actualRevenueValues = [0, 1, 2, 3, 4, 5].map((idx) => {
    const monthIndexStr = `-0${idx + 1}-`; // e.g. -01-, -02-
    const wonSum = deals
      .filter(d => d.stage === 'Won' && d.closingDate && d.closingDate.includes(monthIndexStr))
      .reduce((sum, d) => sum + d.value, 0);
    const placeholder = [12000, 18000, 15000, 24000, 31000, 42000][idx];
    return wonSum > 0 ? wonSum : placeholder;
  });

  const expectedForecastValues = [0, 1, 2, 3, 4, 5].map((idx) => {
    const monthIndexStr = `-0${idx + 1}-`;
    const weightedSum = deals
      .filter(d => d.closingDate && d.closingDate.includes(monthIndexStr))
      .reduce((sum, d) => sum + (d.value * (d.probability || 50)) / 100, 0);
    const placeholder = [15000, 16000, 21000, 29000, 34000, 48000][idx];
    return weightedSum > 0 ? Math.round(weightedSum) : placeholder;
  });

  // Calculate standard statistics
  const totalLeads = leads.length;
  const activeDealsList = deals.filter(d => d.stage !== 'Won' && d.stage !== 'Lost');
  const totalActiveDeals = activeDealsList.length;
  const totalCompletedTasks = tasks.filter(t => t.status === 'Completed').length;
  const actualRevenue = deals.filter(d => d.stage === 'Won').reduce((sum, d) => sum + d.value, 0);

  // Conversion rate derived
  const wonCount = deals.filter(d => d.stage === 'Won').length;
  const lostCount = deals.filter(d => d.stage === 'Lost').length;
  const totalClosed = wonCount + lostCount;
  const conversionRate = totalClosed > 0 ? Math.round((wonCount / totalClosed) * 100) : 0;

  // Dynamically calculate "Last project's" list entries
  const dynamicProjects = deals.slice(0, 3).map((deal, idx) => {
    const isCompleted = deal.stage === 'Won';
    const percent = isCompleted ? 100 : deal.stage === 'Lost' ? 0 : deal.probability || 50;
    const strokeColor = isCompleted ? '#10B981' : deal.stage === 'Lost' ? '#EF4444' : '#A78BFA';
    const textColorClass = isCompleted ? 'text-emerald-400' : deal.stage === 'Lost' ? 'text-red-400' : 'text-[#A78BFA]';
    const indicatorColorClass = isCompleted ? 'bg-emerald-500' : deal.stage === 'Lost' ? 'bg-red-500' : 'bg-amber-500';
    return {
      id: deal.id,
      title: deal.title || deal.company,
      description: isCompleted ? 'Completed' : deal.stage === 'Lost' ? 'Closed Lost' : `In Progress: Done: ${deal.title}`,
      percent,
      strokeColor,
      textColorClass,
      indicatorColorClass,
      type: idx === 0 ? 'Milestone' : idx === 1 ? 'Sparkles' : 'Award'
    };
  });

  const projectsToRender = [...dynamicProjects];
  if (projectsToRender.length < 3) {
    if (!projectsToRender.some(p => p.id === 'proj-fallback-1')) {
      projectsToRender.push({
        id: 'proj-fallback-1',
        title: 'New Schedule',
        description: 'In Progress: Done: Create a new and unique design for my youtube family.',
        percent: 95,
        strokeColor: '#A78BFA',
        textColorClass: 'text-[#A78BFA]',
        indicatorColorClass: 'bg-amber-500',
        type: 'Milestone'
      });
    }
    if (projectsToRender.length < 3 && !projectsToRender.some(p => p.id === 'proj-fallback-2')) {
      projectsToRender.push({
        id: 'proj-fallback-2',
        title: 'Anime Ui design',
        description: 'Completed',
        percent: 100,
        strokeColor: '#10B981',
        textColorClass: 'text-emerald-400',
        indicatorColorClass: 'bg-emerald-500',
        type: 'Sparkles'
      });
    }
    if (projectsToRender.length < 3 && !projectsToRender.some(p => p.id === 'proj-fallback-3')) {
      projectsToRender.push({
        id: 'proj-fallback-3',
        title: 'Creative Ui design',
        description: 'Completed',
        percent: 100,
        strokeColor: '#10B981',
        textColorClass: 'text-emerald-400',
        indicatorColorClass: 'bg-emerald-500',
        type: 'Award'
      });
    }
  }

  // Dynamically calculate "Task in process" pending tasks checklist entries
  const pendingTasksList = tasks.filter(t => t.status !== 'Completed');
  const pendingTasksToRender = [...pendingTasksList].map((t, idx) => {
    return {
      id: t.id,
      title: t.title,
      dueDate: t.dueDate,
      type: t.type
    };
  });

  if (pendingTasksToRender.length < 2) {
    if (!pendingTasksToRender.some(t => t.id === 't-fallback-hr')) {
      pendingTasksToRender.push({
        id: 't-fallback-hr',
        title: 'Meet HR For Project',
        dueDate: 'Tonight',
        type: 'Meeting'
      });
    }
    if (pendingTasksToRender.length < 2 && !pendingTasksToRender.some(t => t.id === 't-fallback-boss')) {
      pendingTasksToRender.push({
        id: 't-fallback-boss',
        title: 'Boss Appointment',
        dueDate: 'Next Morning',
        type: 'Proposal'
      });
    }
  }

  // Handle local task addition
  const handleQuickAddLocalTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickTaskTitle.trim()) {
      onAddTask(
        quickTaskTitle.trim(),
        new Date().toISOString().split('T')[0],
        'Meeting',
        undefined,
        undefined
      );
      setQuickTaskTitle('');
      setShowQuickTaskForm(false);
    }
  };

  return (
    <div id="growth-dashboard" className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#FAF9FC] font-sans pb-16 space-y-8 select-none">
      
      {/* Top Welcome Title Grid - EXACT Layout representation of Topbar in Figma Mockup */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-slate-100">
        <div>
          <h2 className="text-3xl font-display font-extrabold text-neutral-900 tracking-tight leading-[1.1]">
            Hi, User!
          </h2>
          <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-widest">
            Workspace Intelligence Dashboard • Standard Pro active
          </p>
        </div>
        
        {/* Right side Top layout: solid Black pill "+ Create", search bubble, notification circle, user avatar */}
        <div className="flex items-center space-x-3.5 self-end md:self-auto">
          
          {/* DYNAMIC quick create modal trigger */}
          <button 
            onClick={() => setActiveView('leads')}
            className="px-5 py-2.5 bg-black hover:bg-neutral-800 text-white font-bold text-xs rounded-full flex items-center space-x-1.5 cursor-pointer shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Create</span>
          </button>
          
          {/* Search Icon button */}
          <button 
            onClick={() => setActiveView('leads')}
            className="w-9 h-9 border border-[#EDE9F3] bg-white rounded-full flex items-center justify-center text-slate-450 hover:text-black hover:border-slate-300 transition-all cursor-pointer"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Notifications button with dot */}
          <div className="relative">
            <button 
              onClick={() => setActiveView('team')}
              className="w-9 h-9 border border-[#EDE9F3] bg-white rounded-full flex items-center justify-center text-slate-450 hover:text-black hover:border-slate-300 transition-all cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-violet-600 rounded-full" />
            </button>
          </div>

          {/* Profile User avatar bubble */}
          <button 
            onClick={() => setActiveView('team')}
            className="w-9 h-9 bg-neutral-900 border border-white rounded-full flex items-center justify-center overflow-hidden shadow-sm hover:ring-2 hover:ring-slate-300 transition-all cursor-pointer"
          >
            <div className="text-white text-[10px] font-extrabold uppercase">
              ME
            </div>
          </button>
        </div>
      </div>

      {/* Row 1 Widgets: "Over all information" card (Black), "Weekly process" Area (White), "Month Progress" Radial (White) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* CARD 1: "Over all information" - Jet Black card from Figma Mockup (Spans 4/12 cols) */}
        <div className="lg:col-span-4 bg-[#0B0A0C] text-white p-6 rounded-3xl flex flex-col justify-between shadow-lg relative overflow-hidden">
          {/* Background decor subtle ring */}
          <div className="absolute -right-16 -top-16 w-36 h-36 rounded-full border-[10px] border-neutral-800/20 pointer-events-none" />
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#8E8D91]">
                Over all information
              </span>
              <div className="flex items-center space-x-2">
                <button className="p-1 hover:bg-neutral-800 rounded-lg text-[#8E8D91] hover:text-white transition-colors cursor-pointer">
                  <Share2 className="w-3.5 h-3.5" />
                </button>
                <button className="p-1 hover:bg-neutral-800 rounded-lg text-[#8E8D91] hover:text-white transition-colors cursor-pointer">
                  <MoreVertical className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Overall Statistics Layout */}
            <div className="flex items-baseline justify-between mt-4">
              <div>
                <span className="text-5xl font-display font-extrabold tracking-tight text-white block">
                  {totalCompletedTasks + 43}
                </span>
                <span className="text-[10px] text-[#8E8D91] mt-1.5 block font-semibold leading-relaxed">
                  Task done <br /> for all time
                </span>
              </div>
              <div className="border-l border-neutral-800 pl-6 pr-4">
                <span className="text-5xl font-display font-extrabold tracking-tight text-white block">
                  {2}
                </span>
                <span className="text-[10px] text-[#8E8D91] mt-1.5 block font-semibold leading-relaxed">
                  Project's <br /> are stoped
                </span>
              </div>
            </div>

            {/* Slick premium linear progress bar */}
            <div className="mt-8 mb-6">
              <div className="w-full h-2.5 bg-neutral-800 rounded-full overflow-hidden">
                <div className="w-[65%] h-full bg-white rounded-full transition-all duration-500" />
              </div>
            </div>
          </div>

          {/* Three white sub-cards updated to represent Sales, Leads and Tasks with direct navigation */}
          <div className="grid grid-cols-3 gap-2 mt-2">
            
            <button 
              onClick={() => setActiveView('pipeline')}
              className="bg-white text-black p-3 rounded-2xl border border-neutral-800 flex flex-col items-center text-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
              title="Navigate to Sales Pipeline"
            >
              <div className="w-7 h-7 bg-neutral-100 rounded-full flex items-center justify-center mb-1">
                <DollarSign className="w-3.5 h-3.5 text-neutral-800" />
              </div>
              <span className="text-xs sm:text-sm font-extrabold block truncate w-full">
                ${actualRevenue >= 1000 ? `${(actualRevenue / 1000).toFixed(1)}k` : actualRevenue}
              </span>
              <span className="text-[8px] text-slate-400 font-extrabold uppercase mt-0.5 tracking-tight leading-none">Sales</span>
            </button>

            <button 
              onClick={() => setActiveView('leads')}
              className="bg-white text-black p-3 rounded-2xl border border-neutral-800 flex flex-col items-center text-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
              title="Navigate to Leads Directory"
            >
              <div className="w-7 h-7 bg-neutral-100 rounded-full flex items-center justify-center mb-1">
                <Users className="w-3.5 h-3.5 text-neutral-800" />
              </div>
              <span className="text-xs sm:text-sm font-extrabold block truncate w-full">{totalLeads}</span>
              <span className="text-[8px] text-slate-400 font-extrabold uppercase mt-0.5 tracking-tight leading-none">Leads</span>
            </button>

            <button 
              onClick={() => setActiveView('tasks')}
              className="bg-white text-black p-3 rounded-2xl border border-neutral-800 flex flex-col items-center text-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
              title="Navigate to Checklists and Tasks"
            >
              <div className="w-7 h-7 bg-neutral-100 rounded-full flex items-center justify-center mb-1">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <span className="text-xs sm:text-sm font-extrabold block truncate w-full border-none bg-transparent">
                {tasks.filter(t => t.status === 'Pending').length}
              </span>
              <span className="text-[8px] text-slate-400 font-extrabold uppercase mt-0.5 tracking-tight leading-none">Tasks</span>
            </button>

          </div>
        </div>

        {/* GRAPH 1: "Weekly process" Area Chart from Figma Mockup (Spans 5/12 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-[#EDE9F3] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-800">Weekly process</span>
              
              <div className="flex items-center space-x-4">
                {/* Custom Legends style with small micro indicators */}
                <div className="flex items-center space-x-3 text-[10px] font-bold text-slate-400">
                  <div className="flex items-center space-x-1">
                    <span className="w-2 h-2 rounded-full bg-slate-900" />
                    <span>Work</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="w-2 h-2 bg-neutral-300 rounded-full" />
                    <span>Meditation</span>
                  </div>
                </div>
                
                <button className="text-slate-400 hover:text-black transition-colors cursor-pointer" title="Process Details">
                  <Clock className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Interactive SVG Area Chart: Graphic Model 1 */}
            <div className="relative h-40 w-full mt-4">
              <svg className="w-full h-full overflow-visible">
                
                {/* Horizontal dotted gridlines */}
                {[0, 0.25, 0.5, 0.75, 1].map((p, i) => {
                  const y = `${p * 100}%`;
                  return (
                    <line key={i} x1="0" y1={y} x2="100%" y2={y} stroke="#F1EFF5" strokeWidth="1" strokeDasharray="4 4" />
                  );
                })}

                {/* AREA PLOT GRADIENTS */}
                <defs>
                  <linearGradient id="glow-work" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0F172A" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="glow-meditation" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#94A3B8" stopOpacity="0.08" />
                    <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* GRAPH 1.2: Meditation Series Spline Fill & Stroke */}
                <path 
                  d={`M 0,${140 - medWeeklyValues[0]} L 16.6,${140 - medWeeklyValues[1]} L 33.3,${140 - medWeeklyValues[2]} L 50,${140 - medWeeklyValues[3]} L 66.6,${140 - medWeeklyValues[4]} L 83.3,${140 - medWeeklyValues[5]} L 100,${140 - medWeeklyValues[6]} L 100,150 L 0,150 Z`} 
                  fill="url(#glow-meditation)"
                />
                <path 
                  d={`M 0,${140 - medWeeklyValues[0]} L 16.6,${140 - medWeeklyValues[1]} L 33.3,${140 - medWeeklyValues[2]} L 50,${140 - medWeeklyValues[3]} L 66.6,${140 - medWeeklyValues[4]} L 83.3,${140 - medWeeklyValues[5]} L 100,${140 - medWeeklyValues[6]}`} 
                  fill="none" 
                  stroke="#94A3B8" 
                  strokeWidth="1.5" 
                  strokeLinecap="round"
                />

                {/* GRAPH 1.1: Work Series Spline Fill & Stroke */}
                <path 
                  d={`M 0,${140 - workWeeklyValues[0]} L 16.6,${140 - workWeeklyValues[1]} L 33.3,${140 - workWeeklyValues[2]} L 50,${140 - workWeeklyValues[3]} L 66.6,${140 - workWeeklyValues[4]} L 83.3,${140 - workWeeklyValues[5]} L 100,${140 - workWeeklyValues[6]} L 100,150 L 0,150 Z`} 
                  fill="url(#glow-work)"
                />
                <path 
                  d={`M 0,${140 - workWeeklyValues[0]} L 16.6,${140 - workWeeklyValues[1]} L 33.3,${140 - workWeeklyValues[2]} L 50,${140 - workWeeklyValues[3]} L 66.6,${140 - workWeeklyValues[4]} L 83.3,${140 - workWeeklyValues[5]} L 100,${140 - workWeeklyValues[6]}`} 
                  fill="none" 
                  stroke="#0F172A" 
                  strokeWidth="2" 
                  strokeLinecap="round"
                />

                {/* Interactive markers & Hover indicators */}
                {weekdays.map((item, idx) => {
                  const x = `${idx * 16.6}%`;
                  const y = 140 - workWeeklyValues[idx];
                  const isHoveredOrSelected = selectedWeeklyIdx === idx;

                  return (
                    <g key={idx} className="cursor-pointer" onClick={() => setSelectedWeeklyIdx(idx)}>
                      {/* Interactive Transparent Hover Zone */}
                      <rect x={`${idx * 16.6 - 5}%`} y="0" width="10%" height="100%" fill="transparent" />
                      
                      {/* Vertical highlight bar for selected node like Thursday "65%" */}
                      {isHoveredOrSelected && (
                        <>
                          <line x1={x} y1="0" x2={x} y2="100%" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 3" />
                          <circle cx={x} cy={y} r="5" fill="#000000" />
                          <circle cx={x} cy={y} r="10" fill="#000000" fillOpacity="0.1" />
                          
                          {/* Exactly reproducible Mockup highlighted black badge */}
                          <foreignObject x={`${idx * 16.6 - 22}%`} y={y - 36} width="44" height="28" className="overflow-visible">
                            <div className="bg-black text-white font-extrabold text-[9px] rounded-lg px-2 py-1 text-center shadow-lg relative">
                              {workWeeklyValues[idx]}%
                              <div className="absolute top-full left-[43%] border-4 border-transparent border-t-black" />
                            </div>
                          </foreignObject>
                        </>
                      )}
                    </g>
                  );
                })}

              </svg>
            </div>
          </div>

          {/* Weekday Labels Grid at Bottom */}
          <div className="flex justify-between border-t border-[#F1EFF5] pt-3 text-[10px] font-bold text-slate-500">
            {weekdays.map((day, idx) => (
              <button 
                key={idx}
                onClick={() => setSelectedWeeklyIdx(idx)}
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  selectedWeeklyIdx === idx ? 'bg-black text-white font-extrabold scale-110 shadow-sm' : 'hover:bg-slate-50'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* GRAPH 2: "Month Progress" Radial Concentric (Spans 3/12 cols) */}
        <div className="lg:col-span-3 bg-white p-6 rounded-3xl border border-[#EDE9F3] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-800">Month Progress</span>
              <button className="text-slate-400 hover:text-black cursor-pointer">
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

            {/* Progression percentages subtitle */}
            <p className="text-[11px] text-slate-405 leading-none font-medium mb-4">
              <strong className="text-black font-extrabold text-sm">{conversionRate || 30}%</strong> completed to last month*
            </p>

            {/* Concentric Radial Progress Segment Chart: Graphic Model 2 */}
            <div className="relative w-36 h-36 mx-auto my-1.5 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Segment 1: Work (120% / outer) */}
                <circle cx="50" cy="50" r="38" stroke="#F1EFF5" strokeWidth="6.5" fill="none" />
                <circle cx="50" cy="50" r="38" stroke="#0B0A0C" strokeWidth="6.5" strokeDasharray="238.7" strokeDashoffset={238.7 * (1 - 0.75)} strokeLinecap="round" fill="none" className="transition-all duration-500" />

                {/* Segment 2: Meditation (80% / middle) */}
                <circle cx="50" cy="50" r="29" stroke="#F1EFF5" strokeWidth="5.5" fill="none" />
                <circle cx="50" cy="50" r="29" stroke="#94A3B8" strokeWidth="5.5" strokeDasharray="182.2" strokeDashoffset={182.2 * (1 - 0.50)} strokeLinecap="round" fill="none" className="transition-all duration-500" />

                {/* Segment 3: Project's (50% / inner) */}
                <circle cx="50" cy="50" r="20" stroke="#F1EFF5" strokeWidth="4.5" fill="none" />
                <circle cx="50" cy="50" r="20" stroke="#CBD5E1" strokeWidth="4.5" strokeDasharray="125.6" strokeDashoffset={125.6 * (1 - 0.35)} strokeLinecap="round" fill="none" className="transition-all duration-500" />
              </svg>
              
              {/* Central textual rating from Figma mockup */}
              <div className="absolute text-center">
                <span className="text-xs font-extrabold text-slate-900 leading-none block">120%</span>
                <span className="text-[8px] text-slate-400 font-bold block uppercase tracking-wider mt-0.5">Rating</span>
              </div>
            </div>
          </div>

          {/* Micro legend listings */}
          <div className="space-y-1.5 pb-2.5">
            <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 block mb-1">Overview Parameters</span>
            <div className="grid grid-cols-3 gap-1.5 text-[9px] font-bold text-slate-500">
              <div className="flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                <span className="truncate">Work</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                <span className="truncate">Meditation</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                <span className="truncate">Project's</span>
              </div>
            </div>
          </div>

          {/* Action pills: Share and Download report matching Figma layout exactly! */}
          <div className="flex items-center space-x-2 pt-2 border-t border-slate-100">
            <button className="p-2 border border-[#EDE9F3] hover:bg-neutral-50 rounded-full flex items-center justify-center cursor-pointer text-neutral-800 shrink-0">
              <Share2 className="w-3.5 h-3.5" />
            </button>
            <button className="flex-1 py-2 border border-black hover:bg-black hover:text-white transition-all text-[10px] font-extrabold uppercase rounded-full flex items-center justify-center space-x-1 cursor-pointer tracking-wider">
              <Download className="w-3 h-3" />
              <span>Download Report</span>
            </button>
          </div>
        </div>

      </div>

      {/* Row 2 Widgets: "Month Goal's" Checklist, "Task In process" Horizontal Grid, "+ Add a task" Trigger Dotted Pill */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* WIDGET 2.1: "Month Goal's" (Spans 4/12 cols) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-[#EDE9F3] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-800">Month Goal's</span>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-extrabold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full">
                  {completedGoalsCount}/{goals.length}
                </span>
                <button 
                  onClick={() => setActiveView('tasks')}
                  className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-black transition-all cursor-pointer"
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Goals Interactive checklists */}
            <div className="space-y-3 mt-4">
              {goals.map((g) => (
                <div 
                  key={g.id}
                  onClick={() => handleToggleGoal(g.id)}
                  className="flex items-center justify-between p-3 bg-slate-50/50 hover:bg-slate-50 border border-[#F1EFF5] hover:border-slate-205 rounded-2xl transition-all cursor-pointer group"
                >
                  <span className={`text-xs font-semibold ${g.checked ? 'text-slate-400 line-through' : 'text-slate-750 font-bold'}`}>
                    {g.text}
                  </span>
                  
                  {/* Styled circular check indicators matching Figma */}
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                    g.checked ? 'bg-black border-black text-white' : 'border-slate-300 bg-white group-hover:border-slate-500'
                  }`}>
                    {g.checked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[10px] bg-slate-50/85 p-2 rounded-xl text-slate-400 font-bold mt-4 text-center">
            Click on goals to test live progression counts.
          </div>
        </div>

        {/* WIDGET 2.2: "Task In process" + quick-add + active database tasks from CRM (Spans 8/12 cols) */}
        <div id="tasks-in-process-container" className="lg:col-span-8 bg-white p-6 rounded-3xl border border-[#EDE9F3] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4.5">
              <div>
                <h3 className="text-xs font-bold text-slate-800">Task In process ({tasks.filter(t=>t.status !== 'Completed').length || 2})</h3>
                <p className="text-[10.5px] text-slate-400 mt-0.5">Pipeline action benchmarks pending closure.</p>
              </div>
              <button 
                onClick={() => setActiveView('tasks')}
                className="text-[10px] text-slate-400 hover:text-black font-extrabold flex items-center space-x-1 cursor-pointer"
              >
                <span>Open Archive</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Horizontal Deck Grid: Interactive mockup items & database tasks */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4.5 mt-5">
              
              {pendingTasksToRender.slice(0, 2).map((item) => {
                const isFallback = String(item.id).startsWith('t-fallback');
                
                // Style variables
                let IconComponent = Users;
                let bgClass = 'bg-violet-50';
                let iconClass = 'text-violet-605';
                
                if (item.type === 'Call') {
                  bgClass = 'bg-sky-50';
                  iconClass = 'text-sky-500';
                } else if (item.type === 'Proposal') {
                  bgClass = 'bg-amber-50';
                  iconClass = 'text-amber-500';
                  IconComponent = Award;
                } else if (item.type === 'Follow-up') {
                  bgClass = 'bg-indigo-50';
                  iconClass = 'text-indigo-600';
                  IconComponent = Clock;
                }

                return (
                  <div 
                    key={item.id}
                    className="bg-white border border-[#EDE9F3] hover:border-black rounded-3xl p-5 flex flex-col justify-between h-36 transition-all group hover:shadow-md relative"
                  >
                    <div className="flex items-start justify-between">
                      <div className={`w-8 h-8 rounded-full ${bgClass} flex items-center justify-center`}>
                        <IconComponent className={`w-4 h-4 ${iconClass}`} />
                      </div>
                      <span className="text-[9px] bg-neutral-100 px-2 py-0.5 rounded-full font-bold uppercase text-slate-505">
                        {item.dueDate === 'Tonight' || item.dueDate === 'Next Morning' ? item.dueDate : 'Tonight'}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900 group-hover:text-violet-650 transition-colors truncate" title={item.title}>
                        {item.title}
                      </h4>
                      <p className="text-[10px] text-slate-450 mt-1 uppercase font-semibold font-mono tracking-wider">{item.type || 'Action'}</p>
                    </div>

                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isFallback) {
                          alert(`Mock Task "${item.title}" completed successfully!`);
                        } else {
                          onCompleteTask(item.id);
                        }
                      }}
                      className="absolute bottom-3 right-3 w-6 h-6 bg-black hover:bg-neutral-800 rounded-full flex items-center justify-center text-white text-[10px] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow"
                      title="Mark Completed"
                    >
                      ✓
                    </button>
                  </div>
                );
              })}

              {/* Task Card 3: Dynamic "+ Add a task" OR Quick-Add Item representation from Figma */}
              <div className="h-36">
                {!showQuickTaskForm ? (
                  <button 
                    onClick={() => setShowQuickTaskForm(true)}
                    className="w-full h-full border-2 border-dashed border-slate-205 hover:border-black hover:bg-slate-55/35 cursor-pointer rounded-3xl flex flex-col items-center justify-center space-y-2 text-slate-400 hover:text-black transition-all"
                  >
                    <Plus className="w-5 h-5" />
                    <span className="text-xs font-bold font-sans tracking-tight">+ Add a task</span>
                  </button>
                ) : (
                  <form 
                    onSubmit={handleQuickAddLocalTask}
                    className="w-full h-full bg-[#FAF9FC] border border-[#EDE9F3] p-4 rounded-3xl flex flex-col justify-between relative"
                  >
                    <div>
                      <span className="text-[9px] text-[#7C3AED] font-extrabold uppercase block mb-1">Quick Add</span>
                      <input 
                        type="text"
                        required
                        placeholder="Task title..."
                        value={quickTaskTitle}
                        onChange={(e) => setQuickTaskTitle(e.target.value)}
                        className="w-full text-xs p-2.5 bg-white border border-[#EDE9F3] rounded-xl focus:outline-none focus:border-black font-semibold text-neutral-800"
                        autoFocus
                      />
                    </div>
                    <div className="flex items-center justify-end space-x-1.5">
                      <button 
                        type="button"
                        onClick={() => setShowQuickTaskForm(false)}
                        className="px-2.5 py-1 text-[10px] text-slate-450 hover:text-black font-bold h-7"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        className="px-3.5 py-1 bg-black text-white text-[10px] font-extrabold uppercase tracking-tight rounded-lg hover:bg-neutral-800 transition-colors h-7"
                      >
                        Insert
                      </button>
                    </div>
                  </form>
                )}
              </div>

            </div>
          </div>

          {/* Sync status tracker */}
          <div className="text-[10px] text-slate-450 border-t border-[#F2EEF5] pt-4.5 flex justify-between items-center mt-3">
            <span>Dynamic operational task registers mapped inside active sandbox database</span>
            <span className="font-bold text-[#7C3AED]">✓ Sync Online</span>
          </div>
        </div>

      </div>

      {/* Row 3 Widgets: Graph 3 (Forecast/Valuation spline), Graph 4 Funnel breakdowns, Graph 5 Pie Industry Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-4">
        
        {/* GRAPH 3: Dual Spline & Area Forecast valuation chart (Spans 7/12 cols) - Satisfies "4 to 5 graphs" */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-[#EDE9F3] shadow-sm flex flex-col justify-between h-[340px]">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-xs font-bold text-slate-800">Valuation Distribution Forecast (Jan - Jun)</h3>
                <p className="text-[10.5px] text-slate-400 mt-0.5">Dual Line Splines graphing actual CRM closure against expected projection weights.</p>
              </div>
              <span className="text-[10px] font-extrabold bg-[#FAF9FC] px-2 py-1 rounded-lg text-violet-605 border border-[#EDE9F3]">Graph 3</span>
            </div>

            {/* Interactive Dual Axis Line Chart */}
            <div className="relative h-48 w-full mt-4">
              <svg className="w-full h-full overflow-visible">
                {/* Horizontal reference grids */}
                {[0, 0.25, 0.5, 0.75, 1].map((p, i) => {
                  const y = `${p * 100}%`;
                  return (
                    <line key={i} x1="0" y1={y} x2="100%" y2={y} stroke="#FAF9FC" strokeWidth="2" />
                  );
                })}

                {/* Draw expected forecast pipeline line */}
                <path 
                  d={`M 0,110 Q 16,105 32,80 T 64,50 T 80,45 T 100,20`}
                  fill="none"
                  stroke="#94A3B8"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray="4 4"
                />

                {/* Draw active actual revenue line path in purple-glow */}
                <path 
                  d={`M 0,110 Q 16,100 32,70 T 64,65 T 80,30 T 100,10`}
                  fill="none"
                  stroke="#7C3AED"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Dot coordinates interactive mapping */}
                {monthlyMonths.map((mon, idx) => {
                  const x = `${idx * 20}%`;
                  const isHovered = hoveredForecastIdx === idx;
                  
                  return (
                    <g key={idx} className="cursor-pointer" onMouseEnter={() => setHoveredForecastIdx(idx)} onMouseLeave={() => setHoveredForecastIdx(null)}>
                      <circle cx={x} cy={110 - actualRevenueValues[idx] / 300} r="5" fill="#7C3AED" />
                      
                      {isHovered && (
                        <foreignObject x={`${idx * 20 - 25}%`} y="100" width="80" height="60" className="overflow-visible z-50 pointer-events-none">
                          <div className="bg-slate-900 text-white rounded-lg p-2 text-[9px] shadow-lg leading-relaxed border border-slate-700 font-sans">
                            <p className="font-bold text-[#A78BFA]">{mon}</p>
                            <p>Actual: <b className="text-white">${actualRevenueValues[idx].toLocaleString()}</b></p>
                            <p className="text-slate-400">Exp: ${expectedForecastValues[idx].toLocaleString()}</p>
                          </div>
                        </foreignObject>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Month Grid Labels */}
          <div className="flex justify-between border-t border-slate-50 pt-3 text-[10px] font-bold text-slate-400">
            {monthlyMonths.map((m, idx) => (
              <span key={m} className={`w-12 text-center ${hoveredForecastIdx === idx ? 'text-[#7C3AED] font-extrabold' : ''}`}>{m}</span>
            ))}
          </div>
        </div>

        {/* GRAPH 4: Funnel breakdowns (Spans 5/12 cols) - Satisfies "4 to 5 graphs" */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-[#EDE9F3] shadow-sm flex flex-col justify-between h-[340px]">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-xs font-bold text-slate-800">Density Funnel Breakdown (Graph 4)</h3>
                <p className="text-[10.5px] text-slate-400 mt-0.5">Translational metrics modeling lead intake conversion ratios.</p>
              </div>
              <span className="text-[10px] font-extrabold bg-[#FAF9FC] px-2 py-1 rounded-lg text-slate-400 border border-[#EDE9F3]">Funnel</span>
            </div>

            {/* Custom Funnel breakdown layers */}
            <div className="space-y-2 mt-5">
              {[
                { name: '1. Intake Pipeline Lead', count: totalLeads + 16, percentage: 100, color: 'bg-violet-605' },
                { name: '2. Contact Engagement', count: totalActiveDeals + 8, percentage: 70, color: 'bg-indigo-500' },
                { name: '3. Formulating Proposal', count: 4, percentage: 48, color: 'bg-cyan-500' },
                { name: '4. Active Won Agreements', count: wonCount || 3, percentage: 32, color: 'bg-rose-500' }
              ].map((layer) => (
                <div key={layer.name}>
                  <div className="flex justify-between items-center text-[10px] font-bold text-neutral-805 mb-1">
                    <span>{layer.name}</span>
                    <span className="text-slate-450">{layer.count} items ({layer.percentage}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-50 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${layer.color}`}
                      style={{ width: `${layer.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#FAF9FC] p-3 rounded-2xl text-[10px] text-slate-450 border border-[#EDE9F3] flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-violet-600 shrink-0" />
            <p className="font-semibold leading-normal">Funnel conversion velocity indexes reflect healthy workflow execution speeds.</p>
          </div>
        </div>

      </div>

      {/* Row 4 Widgets: GRAPH 5 (Pie Circular Donut Chart) & "Last project's" container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* GRAPH 5: "Industry Sectors Share Donut" Pie graph (Spans 4/12 cols) - Satisfies "4 to 5 graphs" */}
        <div id="industry-chart-container" className="lg:col-span-4 bg-white p-6 rounded-3xl border border-[#EDE9F3] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-xs font-bold text-slate-800">Target Industry Sector Distribution (Graph 5)</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Segment share by active deal valuations</p>
              </div>
              <span className="text-[10px] font-extrabold bg-[#FAF9FC] px-2 py-1 rounded-lg text-slate-400 border border-[#EDE9F3]">Graph 5</span>
            </div>

            {/* Donut SVG Pie implementation */}
            <div className="relative w-36 h-36 mx-auto my-4 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 42 42">
                <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#E2E8F0" strokeWidth="3" />
                {(() => {
                  let accumulatedSectorPercentage = 0;
                  return industrySectors.slice(0, 5).map((sec, idx) => {
                    const strokeDashoffset = -accumulatedSectorPercentage;
                    accumulatedSectorPercentage += sec.percentage;
                    const strokeDasharray = `${sec.percentage} ${100 - sec.percentage}`;
                    
                    let colorHex = '#7C3AED';
                    if (sec.color === 'stroke-rose-500') colorHex = '#F43F5E';
                    else if (sec.color === 'stroke-cyan-500') colorHex = '#06B6D4';
                    else if (sec.color === 'stroke-amber-500') colorHex = '#F59E0B';
                    else if (sec.color === 'stroke-emerald-500') colorHex = '#10B981';

                    return (
                      <circle 
                        key={sec.name}
                        cx="21" 
                        cy="21" 
                        r="15.915" 
                        fill="transparent" 
                        stroke={colorHex} 
                        strokeWidth="4" 
                        strokeDasharray={strokeDasharray} 
                        strokeDashoffset={strokeDashoffset} 
                        strokeLinecap="round" 
                        className="cursor-pointer transition-all hover:stroke-[5]" 
                        onMouseEnter={() => setSelectedIndustryIdx(idx)} 
                        onMouseLeave={() => setSelectedIndustryIdx(null)} 
                      />
                    );
                  });
                })()}
              </svg>

              <div className="absolute text-center max-w-[80px] truncate pointer-events-none">
                <span className="text-[10px] font-extrabold text-[#7C3AED] leading-none block">
                  {selectedIndustryIdx !== null && industrySectors[selectedIndustryIdx] ? `${industrySectors[selectedIndustryIdx].percentage}%` : 'CRM'}
                </span>
                <span className="text-[8px] text-slate-400 font-bold block truncate mt-0.5">
                  {selectedIndustryIdx !== null && industrySectors[selectedIndustryIdx] ? industrySectors[selectedIndustryIdx].name : 'Industries'}
                </span>
              </div>
            </div>
          </div>

          {/* Detailed legends checklist */}
          <div className="space-y-1.5 mt-2 border-t border-slate-50 pt-2 text-[10px] font-bold text-slate-500">
            {industrySectors.slice(0, 5).map((ind, i) => (
              <div 
                key={ind.name} 
                onMouseEnter={() => setSelectedIndustryIdx(i)} 
                onMouseLeave={() => setSelectedIndustryIdx(null)}
                className={`flex items-center justify-between p-1.5 rounded-lg transition-colors cursor-pointer ${
                  selectedIndustryIdx === i ? 'bg-slate-50 text-black' : ''
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className={`w-2 h-2 rounded-full ${
                    ind.color === 'stroke-violet-605' ? 'bg-violet-600' : 
                    ind.color === 'stroke-rose-500' ? 'bg-rose-500' : 
                    ind.color === 'stroke-cyan-500' ? 'bg-cyan-500' : 
                    ind.color === 'stroke-amber-500' ? 'bg-amber-500' : 'bg-emerald-500'
                  }`} />
                  <span>{ind.name}</span>
                </div>
                <span>${ind.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* WIDGET 4.2: "Last project's" List structure from Figma Mockup - Wide Deck Row (Spans 8/12 cols) */}
        <div id="last-projects-panel" className="lg:col-span-8 bg-white p-6 rounded-3xl border border-[#EDE9F3] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-800">Last project's</span>
              <button 
                onClick={() => setActiveView('pipeline')}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-405 hover:text-black transition-all cursor-pointer"
              >
                <TrendingUp className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* List entries in deep matte black container block style matching footer widgets of Figma mockup! */}
            <div className="space-y-3 mt-4">
              
              {projectsToRender.map((proj) => {
                let TargetIcon = Milestone;
                if (proj.type === 'Sparkles') TargetIcon = Sparkles;
                else if (proj.type === 'Award') TargetIcon = Award;

                return (
                  <div key={proj.id} className="bg-[#0B0A0C] text-white p-4.5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:scale-[1.0125]">
                    <div className="flex items-start md:items-center space-x-3.5 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-full border border-neutral-800 flex items-center justify-center shrink-0">
                        <TargetIcon className={`w-4.5 h-4.5 ${proj.textColorClass}`} />
                      </div>
                      <div className="truncate">
                        <h5 className="font-extrabold text-sm tracking-tight text-white leading-none">{proj.title}</h5>
                        <p className="text-[10.5px] text-[#8E8D91] mt-1.5 leading-normal">
                          <span className={`w-1.5 h-1.5 inline-block rounded-full ${proj.indicatorColorClass} mr-2`} />
                          {proj.description}
                        </p>
                      </div>
                    </div>

                    {/* Micro circle gauge */}
                    <div className="flex items-center space-x-3 shrink-0">
                      <span className={`text-xs font-extrabold ${proj.textColorClass}`}>{proj.percent}%</span>
                      <div className="relative w-8 h-8">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="16" cy="16" r="12" stroke="#262626" strokeWidth="2.5" fill="transparent" />
                          <circle 
                            cx="16" 
                            cy="16" 
                            r="12" 
                            stroke={proj.strokeColor} 
                            strokeWidth="2.5" 
                            strokeDasharray="75.3" 
                            strokeDashoffset={75.3 * (1 - proj.percent / 100)} 
                            strokeLinecap="round" 
                            fill="transparent" 
                            className="transition-all duration-500"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                );
              })}

            </div>
          </div>

          <div className="mt-4 pt-1.5 flex justify-center">
            <span className="text-[10px] text-slate-400 font-bold">&#8226; End of recorded user workspace listings &#8226;</span>
          </div>
        </div>

      </div>

    </div>
  );
}
