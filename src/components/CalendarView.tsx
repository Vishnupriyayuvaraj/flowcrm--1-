import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Phone,
  Video,
  FileSpreadsheet,
  CheckCircle,
  Plus,
  Compass,
  Clock,
  User,
  X
} from 'lucide-react';
import { Task, TaskType } from '../types';

interface CalendarViewProps {
  tasks: Task[];
  onAddTask: (title: string, dueDate: string, type: TaskType, associatedId?: string, associatedName?: string) => void;
}

export default function CalendarView({
  tasks,
  onAddTask,
}: CalendarViewProps) {
  const [currentView, setCurrentView] = useState<'month' | 'week' | 'day'>('month');
  
  // Pivot reference date inside June 2026 (based on 2026 local time!)
  const [pivotDate, setPivotDate] = useState<Date>(new Date(2026, 5, 5)); // June 5, 2026
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Month structure helpers
  const year = pivotDate.getFullYear();
  const month = pivotDate.getMonth(); // 0-indexed

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Total days in active month
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
  // Day of the week active month starts (0 = Sunday, 1 = Monday...)
  const firstDayIndex = new Date(year, month, 1).getDay();

  const handlePrev = () => {
    if (currentView === 'month') {
      setPivotDate(new Date(year, month - 1, 1));
    } else if (currentView === 'week') {
      setPivotDate(new Date(pivotDate.getTime() - 7 * 24 * 60 * 60 * 1000));
    } else {
      setPivotDate(new Date(pivotDate.getTime() - 24 * 60 * 60 * 1000));
    }
  };

  const handleNext = () => {
    if (currentView === 'month') {
      setPivotDate(new Date(year, month + 1, 1));
    } else if (currentView === 'week') {
      setPivotDate(new Date(pivotDate.getTime() + 7 * 24 * 60 * 60 * 1000));
    } else {
      setPivotDate(new Date(pivotDate.getTime() + 24 * 60 * 60 * 1000));
    }
  };

  // Convert date string of task back to ISO comparisons
  const getTasksForDay = (dayNum: number) => {
    // format to YYYY-MM-DD
    const paddedMonth = String(month + 1).padStart(2, '0');
    const paddedDay = String(dayNum).padStart(2, '0');
    const compareStr = `${year}-${paddedMonth}-${paddedDay}`;
    return tasks.filter(t => t.dueDate === compareStr);
  };

  const getTaskIconColor = (type: TaskType) => {
    switch (type) {
      case 'Call': return 'bg-sky-500 hover:bg-sky-600 text-white';
      case 'Meeting': return 'bg-purple-500 hover:bg-purple-600 text-white';
      case 'Proposal': return 'bg-amber-500 hover:bg-amber-600 text-white';
      default: return 'bg-violet-600 hover:bg-violet-700 text-white';
    }
  };

  // Rendering month box items
  const renderMonthGrid = () => {
    const days: React.ReactNode[] = [];
    
    // Empty padded columns before first day of month
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(
        <div key={`empty-${i}`} className="min-h-[90px] border border-[#EFEBF4] bg-[#FAF9FC]" />
      );
    }

    // Days list
    for (let day = 1; day <= totalDaysInMonth; day++) {
      const dayTasks = getTasksForDay(day);
      const isToday = day === 5 && month === 5 && year === 2026; // June 5, 2026 is today!

      days.push(
        <div 
          key={`day-${day}`}
          className={`min-h-[90px] p-1.5 border border-[#EDE9F3] bg-white flex flex-col justify-between transition-colors group relative ${
            isToday ? 'ring-2 ring-violet-500 bg-violet-50/10' : ''
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-bold w-5.5 h-5.5 rounded-full flex items-center justify-center ${
              isToday ? 'bg-violet-600 text-white shadow-sm' : 'text-slate-750'
            }`}>
              {day}
            </span>
          </div>

          {/* Planned task event tags inside day box */}
          <div className="flex-1 mt-1.5 space-y-1 overflow-y-auto max-h-[64px] scrollbar-thin">
            {dayTasks.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTask(t)}
                className={`w-full text-left truncate text-[9px] px-1.5 py-0.5 rounded font-semibold transition-all cursor-pointer leading-tight ${getTaskIconColor(t.type)}`}
              >
                {t.type === 'Call' && '📞 '}
                {t.type === 'Meeting' && '👥 '}
                {t.type === 'Proposal' && '✍️ '}
                {t.type === 'Follow-up' && '🔁 '}
                {t.title}
              </button>
            ))}
          </div>
        </div>
      );
    }

    return days;
  };

  // Week view helpers
  const renderWeekDaysList = () => {
    const weekStart = new Date(pivotDate);
    const dayOfWeek = weekStart.getDay();
    weekStart.setDate(weekStart.getDate() - dayOfWeek); // set to sunday

    const result: React.ReactNode[] = [];

    for (let i = 0; i < 7; i++) {
      const activeWDay = new Date(weekStart);
      activeWDay.setDate(weekStart.getDate() + i);

      // find tasks
      const paddedMonth = String(activeWDay.getMonth() + 1).padStart(2, '0');
      const paddedDay = String(activeWDay.getDate()).padStart(2, '0');
      const compareStr = `${activeWDay.getFullYear()}-${paddedMonth}-${paddedDay}`;
      const dayTasks = tasks.filter(t => t.dueDate === compareStr);

      const isToday = activeWDay.getDate() === 5 && activeWDay.getMonth() === 5 && activeWDay.getFullYear() === 2026;

      result.push(
        <div key={i} className={`flex-1 min-h-[160px] md:min-h-[350px] bg-white p-3 flex flex-col justify-start space-y-4 ${
          isToday ? 'bg-indigo-50/10 ring-2 ring-indigo-500/10' : ''
        }`}>
          <div className="text-center pb-2 border-b border-slate-100">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i]}
            </p>
            <p className={`text-base font-extrabold mt-0.5 inline-block w-8 h-8 rounded-full flex items-center justify-center mx-auto ${
              isToday ? 'bg-indigo-600 text-white' : 'text-slate-700'
            }`}>
              {activeWDay.getDate()}
            </p>
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto font-sans pr-0.5">
            {dayTasks.length === 0 ? (
              <p className="text-[10px] text-slate-350 text-center pt-8">No milestones</p>
            ) : (
              dayTasks.map(t => (
                <div 
                  key={t.id}
                  onClick={() => setSelectedTask(t)}
                  className={`p-2.5 rounded-xl border text-[10px] cursor-pointer transition-all shadow-sm flex flex-col justify-between h-20 ${
                    t.type === 'Call' ? 'bg-sky-50/50 border-sky-100 text-sky-850 hover:bg-sky-50' :
                    t.type === 'Meeting' ? 'bg-purple-50/50 border-purple-100 text-purple-850 hover:bg-purple-50' :
                    t.type === 'Proposal' ? 'bg-amber-50/50 border-amber-100 text-amber-850 hover:bg-amber-50' :
                    'bg-slate-50 border-slate-100 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div>
                    <span className="font-extrabold uppercase text-[8px] tracking-widest block opacity-70 mb-0.5">{t.type}</span>
                    <p className="font-bold line-clamp-2 leading-tight">{t.title}</p>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-105/10 text-[8.5px] text-slate-400">
                    <span>{t.assignedTo.split(' ')[0]}</span>
                    <span>📞 {t.type}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      );
    }

    return result;
  };

  // Day view helpers
  const renderDayHourlyList = () => {
    const paddedMonth = String(pivotDate.getMonth() + 1).padStart(2, '0');
    const paddedDay = String(pivotDate.getDate()).padStart(2, '0');
    const compareStr = `${pivotDate.getFullYear()}-${paddedMonth}-${paddedDay}`;
    const dayTasks = tasks.filter(t => t.dueDate === compareStr);

    return (
      <div className="bg-white border rounded-2xl p-6 shadow-sm flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-6 flex flex-col justify-center text-center md:text-left">
          <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest pl-0.5">Focus Date Profile</p>
          <h3 className="text-3xl font-black text-indigo-650 mt-1">
            {pivotDate.getDate()} {monthNames[month]}
          </h3>
          <p className="text-sm font-semibold text-slate-600 mt-2">{pivotDate.getFullYear()} Calendar Cycle</p>
          <p className="text-xs text-slate-400 mt-1">Tasks scheduled for this date list on current drawer feed.</p>
        </div>

        <div className="flex-1 space-y-3">
          <h4 className="text-xs font-bold text-slate-505 uppercase tracking-wider mb-2">Schedule Activity ({dayTasks.length})</h4>
          {dayTasks.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 border border-dashed rounded-xl text-slate-400 text-xs">
              No milestones, follow-ups or call checklists listed for this day. Ready for customer intakes.
            </div>
          ) : (
            dayTasks.map(t => (
              <div 
                key={t.id}
                onClick={() => setSelectedTask(t)}
                className={`p-4 rounded-xl border flex items-center justify-between gap-4 cursor-pointer transition-colors ${
                  t.type === 'Call' ? 'bg-sky-50/50 border-sky-100' :
                  t.type === 'Meeting' ? 'bg-purple-50/50 border-purple-100' :
                  t.type === 'Proposal' ? 'bg-amber-50/50 border-amber-100' :
                  'bg-slate-50 border-slate-100'
                }`}
              >
                <div className="flex items-center space-x-3.5">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-lg select-none text-white ${getTaskIconColor(t.type)}`}>
                    {t.type[0]}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">{t.title}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Teammate Handler: <b>{t.assignedTo}</b></p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[9px] uppercase tracking-wider font-extrabold block text-slate-400 mb-0.5">Status</span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 border rounded-full ${
                    t.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}>
                    {t.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <div id="calendar-container" className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
      
      {/* Top action controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Integrated Calendar Schedule</h2>
          <p className="text-sm text-slate-500">Day, Week, and Month trackers syncing CRM goals across workspaces.</p>
        </div>
        
        {/* Toggle View switches */}
        <div className="flex bg-slate-200/60 p-1 rounded-xl shrink-0">
          {(['month', 'week', 'day'] as const).map(v => (
            <button
              key={v}
              onClick={() => setCurrentView(v)}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-all capitalize ${
                currentView === v 
                  ? 'bg-white text-slate-800 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {v} View
            </button>
          ))}
        </div>
      </div>

      {/* Date navigation panel */}
      <div className="bg-white p-4 border border-slate-100 shadow-sm rounded-2xl flex items-center justify-between shrink-0">
        <button
          onClick={handlePrev}
          className="p-2 border border-slate-205 border-slate-150 hover:bg-slate-50 rounded-xl cursor-pointer transition-all text-slate-600 shrink-0"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2.5">
          <CalendarIcon className="w-5 h-5 text-indigo-500" />
          <h3 className="text-sm font-extrabold text-slate-800 font-sans">
            {currentView === 'month' && `${monthNames[month]} ${year}`}
            {currentView === 'week' && `Week of June 2026`}
            {currentView === 'day' && `${pivotDate.getDate()} ${monthNames[month]} ${year}`}
          </h3>
        </div>

        <button
          onClick={handleNext}
          className="p-2 border border-slate-205 border-slate-150 hover:bg-slate-50 rounded-xl cursor-pointer transition-all text-slate-600 shrink-0"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Main Core Render Grid block */}
      <div className="animate-in fade-in zoom-in-98 duration-100">
        {currentView === 'month' && (
          <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            {/* Headers row */}
            <div className="grid grid-cols-7 bg-slate-100 border-b border-slate-200">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="text-center py-2.5 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  {d}
                </div>
              ))}
            </div>
            {/* Day cells grid */}
            <div className="grid grid-cols-7 gap-px bg-slate-200">
              {renderMonthGrid()}
            </div>
          </div>
        )}

        {currentView === 'week' && (
          <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm grid grid-cols-1 sm:grid-cols-3 md:grid-cols-7 divide-y sm:divide-y-0 md:divide-x divide-slate-100">
            {renderWeekDaysList()}
          </div>
        )}

        {currentView === 'day' && renderDayHourlyList()}
      </div>

      {/* DETAILED DIALOG POPOVER FOR CLICKED CALENDAR EVENTS */}
      {selectedTask && (
        <div id="calendar-event-modal-backdrop" className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm animate-in fade-in duration-100">
          <div className="bg-white rounded-2xl w-full max-w-sm border border-slate-200 shadow-2xl p-5 relative">
            <button
              onClick={() => setSelectedTask(null)}
              className="absolute right-4 top-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <span className={`text-[8px] font-extrabold uppercase px-2 py-0.5 rounded border tracking-wider bg-slate-50 max-w-[80px] text-center mb-2.5 block ${
              selectedTask.type === 'Call' ? 'bg-sky-50 text-sky-700 border-sky-100' :
              selectedTask.type === 'Meeting' ? 'bg-purple-50 text-purple-700 border-purple-100' :
              selectedTask.type === 'Proposal' ? 'bg-amber-50 text-amber-700 border-amber-100' :
              'bg-slate-150 text-slate-700 border-slate-200'
            }`}>
              {selectedTask.type} Category
            </span>

            <h4 className="text-sm font-bold text-slate-800 pr-4 leading-snug">{selectedTask.title}</h4>

            {/* Event Meta specifications */}
            <div className="space-y-3 mt-4 text-xs text-slate-600 font-medium">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Target Action: <b>{selectedTask.dueDate}</b></span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Teammate Handler: <b>{selectedTask.assignedTo}</b></span>
              </div>
              {selectedTask.associatedWith && (
                <div className="flex items-center space-x-2 text-indigo-650">
                  <Compass className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Linked Client Account: <b>{selectedTask.associatedWith.name}</b></span>
                </div>
              )}
              <div className="flex items-center space-x-2 transition-all p-2 bg-slate-50 border border-slate-100 rounded-xl leading-none">
                <CheckCircle className={`w-4 h-4 ${selectedTask.status === 'Completed' ? 'text-emerald-500' : 'text-slate-300'}`} />
                <span className="text-[11px]">Workflow Milestone Stage: <b>{selectedTask.status}</b></span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedTask(null)}
                className="px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Dismiss Event Details
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
