import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Mail, 
  FileText, 
  Copy, 
  CopyCheck, 
  Plus, 
  RefreshCw, 
  User, 
  Building, 
  AlertCircle,
  HelpCircle,
  ChevronRight,
  MessageSquareCode
} from 'lucide-react';
import { Lead, Deal, Task } from '../types';

interface AICenterViewProps {
  leads: Lead[];
  deals: Deal[];
  tasks: Task[];
  onAddTask: (title: string, dueDate: string, type: 'Call' | 'Meeting' | 'Proposal' | 'Follow-up', associatedId?: string, associatedName?: string) => void;
  defaultTab?: 'assistant' | 'email' | 'summarizer';
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  structuredLeads?: Lead[];
}

export default function AICenterView({
  leads,
  deals,
  tasks,
  onAddTask,
  defaultTab = 'assistant',
}: AICenterViewProps) {
  // Tabs within AI Workspace Tools: Assistant CRM vs Email Gen vs Summarizer
  const [activeTab, setActiveTab] = useState<'assistant' | 'email' | 'summarizer'>(defaultTab);

  // Assistant State
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-init',
      sender: 'assistant',
      content: "Hello! I am FlowCRM's Sales Intelligence Assistant. I can scrape workspace analytics, score deals, generate email communication blueprints, and answer questions. Try a prompt below!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [processingChat, setProcessingChat] = useState(false);

  // Email Generator State
  const [emailModel, setEmailModel] = useState({
    recipientName: '',
    companyName: '',
    tone: 'Cold Outreach' as 'Cold Outreach' | 'Follow-up' | 'Proposal' | 'Thank-you',
    focusTopic: 'Web Design Rebuild',
    valueSize: '5,000'
  });
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [generatingEmail, setGeneratingEmail] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);

  // Meeting Notes Summarizer State
  const [rawNotes, setRawNotes] = useState(
    "Meeting with Robert Downey regarding Stark Clean Energy Grid platform.\n\n" +
    "- Robert wants security first, Vite frontend framework and standard JWT simulation\n" +
    "- Action Item: Prepare customized budget proposal of $9,500 by next Monday\n" +
    "- Action Item: Schedule tech exploration review call with director\n" +
    "- Next Steps: Robert to authorize budget after seeing proof of concept layout"
  );
  const [summaryOutput, setSummaryOutput] = useState<{
    executive: string;
    actionItems: string[];
    riskAssessment: string;
  } | null>(null);
  const [processingSummary, setProcessingSummary] = useState(false);
  const [addedTasks, setAddedTasks] = useState<{[key: string]: boolean}>({});

  // 1. Assistant CRM state execution
  const executeAssistantCommand = (prompt: string) => {
    setProcessingChat(true);
    
    // Add User Message
    const userMsg: Message = {
      id: `m-usr-${Date.now()}`,
      sender: 'user',
      content: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);

    setTimeout(() => {
      let responseText = '';
      let replyLeads: Lead[] | undefined = undefined;

      const normPrompt = prompt.toLowerCase();

      if (normPrompt.includes('hot leads') || normPrompt.includes('lead score')) {
        const topLeads = leads.filter(l => l.score >= 80).sort((a,b)=>b.score - a.score);
        if (topLeads.length > 0) {
          responseText = `I scraped the active database. Here are corporate targets indicating the highest engagement activity (Hot Leads with score >= 80). You should sequence follow-ups immediately:`;
          replyLeads = topLeads;
        } else {
          responseText = "I analyzed the contacts ledger but didn't identify leads with engagement score >= 80. Consider completing checklists and scheduling fresh touchpoints.";
        }
      } else if (normPrompt.includes('summarize') || normPrompt.includes('account')) {
        // summarize active portfolio
        const totalVal = deals.reduce((sum, d) => sum + d.value, 0);
        responseText = `Workspace Summary Profile:\n\n` +
          `• There are ${leads.length} leads in the prospect pipe.\n` +
          `• Cumulative client pipeline valuation is $${totalVal.toLocaleString()}.\n` +
          `• Conversions index averages high. ${deals.filter(d=>d.stage==='Won').length} deals closed won.`;
      } else if (normPrompt.includes('likely to close') || normPrompt.includes('deals')) {
        const activePropDeals = deals.filter(d => d.probability >= 70 && d.stage !== 'Won' && d.stage !== 'Lost');
        if (activePropDeals.length > 0) {
          responseText = `The following high-probability sales opportunities are likely to close within the current cycle (Win probability status >= 70%):\n\n` +
            activePropDeals.map(d => `• **${d.title}** (${d.company}): Valuation $${d.value.toLocaleString()} | Probability ${d.probability}% | Closing target ${d.closingDate}`).join('\n') +
            `\n\nNurture these by delivering clean proposals.`;
        } else {
          responseText = `I scanned your proposals list. Currently no open deals have close probability >= 70%. Move deals into proposal sent phase or adjust parameters.`;
        }
      } else {
        // generic response based on key CRM vectors
        responseText = `I have updated my semantic weights. I see you are tracking ${leads.length} leads in this space. Value metrics look balanced. We have ${tasks.filter(t=>t.status !== 'Completed').length} outstanding checklists due.\n\nType "Show hot leads" or click presets to refine pipeline priorities.`;
      }

      setMessages(prev => [...prev, {
        id: `m-asst-${Date.now()}`,
        sender: 'assistant',
        content: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        structuredLeads: replyLeads
      }]);

      setProcessingChat(false);
    }, 1200);
  };

  const handleSendChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const prompt = chatInput.trim();
    setChatInput('');
    executeAssistantCommand(prompt);
  };

  // 2. Email generator logic
  const handleGenerateEmail = () => {
    setGeneratingEmail(true);
    setTimeout(() => {
      const recipient = emailModel.recipientName || 'Client Specialist';
      const company = emailModel.companyName || 'Corporate Lead';
      const topic = emailModel.focusTopic;
      const val = emailModel.valueSize;

      let body = '';

      if (emailModel.tone === 'Cold Outreach') {
        body = `Subject: Smart Rebuilding Consultation — FlowCRM Insights\n\n` +
          `Dear ${recipient},\n\n` +
          `I noticed ${company} has been expanding its portfolio of ${topic} tools. With digital velocity becoming essential, we specialize in high-efficiency, elegant frameworks.\n\n` +
          `We previously completed a similar prototype modeled around $${val}. If you have 10 minutes next Tuesday, I would love to explore ways we can boost your pipeline optimization.\n\n` +
          `Best regards,\n` +
          `Alex Johnson\n` +
          `Senior Sales Consultant`;
      } else if (emailModel.tone === 'Follow-up') {
        body = `Subject: Quick follow-up regarding Stark Solar Grid proposals\n\n` +
          `Hi ${recipient},\n\n` +
          `I hope your week is off to a fast start. I wanted to check in on the customized ${topic} blueprint proposal I sent over earlier.\n\n` +
          `We are prepared to allocate resources starting next week to hit client timetables safely. Please let me know if any technical questions came up, or if we can jump on a brief 5-minute sync.\n\n` +
          `Warmly,\n` +
          `Alex Johnson`;
      } else if (emailModel.tone === 'Proposal') {
        body = `Subject: Commercial Quote: Secure Tech Blueprint — ${company}\n\n` +
          `Dear ${recipient},\n\n` +
          `Thank you for taking the time to share your core functional milestones. Attached is our customized blueprint proposal for the ${topic} project, budgeted at $${val}.\n\n` +
          `We leverage modern Vite, Tailwind layouts, and robust local caching architectures. This ensures peak performance benchmarks throughout standard utilization cycles.\n\n` +
          `Let me know if we should proceed with drafting the initial contracts.\n\n` +
          `Best regards,\n` +
          `Alex Johnson`;
      } else {
        body = `Subject: Signed agreement confirmation — Smith Design Co.\n\n` +
          `Hi ${recipient},\n\n` +
          `On behalf of the FlowCRM workspace, thank you for authorizing our engagement proposal. We are incredibly excited to build this ${topic} module together.\n\n` +
          `Your contract details look aligned. I scheduled an exploration onboarding meeting on our team calendar. Looking forward to our next strides.\n\n` +
          `Best regards,\n` +
          `Alex Johnson`;
      }

      setGeneratedEmail(body);
      setGeneratingEmail(false);
      setEmailCopied(false);
    }, 1000);
  };

  const copyEmailToClipboard = () => {
    navigator.clipboard.writeText(generatedEmail);
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2000);
  };

  // 3. Meeting Notes Summarization logic
  const handleSummarizeNotes = () => {
    setProcessingSummary(true);
    setTimeout(() => {
      // Parse raw transcript to isolate mock blocks
      setSummaryOutput({
        executive: "The meeting centered on the core functional components for Stark Labs newly commissioned Solar Energy Modeling Dashboard. High performance and offline caching capacity are paramount. Alex proposed a layout leveraging Vite and Tailwind CSS structures for instantaneous data loads.",
        actionItems: [
          "Prepare detailed commercial proposal of $9,500 by next Monday",
          "Draft initial technical blueprint detailing local storage index parameters",
          "Schedule explore review call with lead consultant Sophia Patel"
        ],
        riskAssessment: "Robert Downey requires strict ISO security clearance compliance. Verify backup developer certificates before deployment phases."
      });
      setProcessingSummary(false);
      setAddedTasks({});
    }, 1200);
  };

  const handleConvertToActionTask = (bullet: string, idx: number) => {
    // Generate dates: 2026-06-10 (standard forward milestones)
    const dueOffset = `2026-06-10`;
    
    // Add the task
    onAddTask(
      `AI Onboarding: ${bullet}`,
      dueOffset,
      'Proposal',
      undefined,
      'Meeting Actions'
    );

    setAddedTasks(prev => ({ ...prev, [idx]: true }));
  };

  return (
    <div id="ai-center-master" className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
      
      {/* Top Welcome Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-violet-600 animate-pulse shrink-0 font-light" />
            <span>AI Studio Blueprint Center</span>
          </h2>
          <p className="text-sm text-slate-500">Autonomous sales intelligence, instant communication drafts, and raw translation tools.</p>
        </div>

        {/* View Switches */}
        <div className="flex bg-slate-200/60 p-1 rounded-xl shrink-0">
          <button
            onClick={() => setActiveTab('assistant')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'assistant' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-705'
            }`}
          >
            CRM Chat Assistant
          </button>
          <button
            onClick={() => setActiveTab('email')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'email' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-705'
            }`}
          >
            Email Composer
          </button>
          <button
            onClick={() => setActiveTab('summarizer')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'summarizer' ? 'bg-white text-slate-805 shadow-sm' : 'text-slate-500 hover:text-slate-705'
            }`}
          >
            Meeting Summarizer
          </button>
        </div>
      </div>

      {/* CORE ACTIVE TABS SECTORS */}
      <div className="grid grid-cols-1 gap-6 animate-in fade-in duration-200">
        
        {/* TAB 1: INTERACTIVE CRM ASSISTANT CHAT */}
        {activeTab === 'assistant' && (
          <div className="bg-white border rounded-2xl shadow-sm flex flex-col md:flex-row h-[550px] overflow-hidden">
            
            {/* Presets Column on Left */}
            <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-100 p-4 bg-slate-50 flex flex-col justify-between shrink-0">
              <div className="space-y-4">
                <div>
                  <h4 className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider pl-1">Preset Chat Triggers</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 pl-1">Ask the assistant to parse actual active CRM indices.</p>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => executeAssistantCommand("Show hot leads")}
                    className="w-full text-left p-2.5 bg-white border hover:border-violet-400 text-slate-700 text-xs rounded-xl font-medium cursor-pointer transition-all flex items-center justify-between"
                  >
                    <span>🔥 Show hot leads</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-350" />
                  </button>
                  <button
                    onClick={() => executeAssistantCommand("Summarize workspace accounts")}
                    className="w-full text-left p-2.5 bg-white border hover:border-violet-400 text-slate-700 text-xs rounded-xl font-medium cursor-pointer transition-all flex items-center justify-between"
                  >
                    <span>📊 Scrape CRM status</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-350" />
                  </button>
                  <button
                    onClick={() => executeAssistantCommand("What deals are likely to close soon?")}
                    className="w-full text-left p-2.5 bg-white border hover:border-violet-400 text-slate-700 text-xs rounded-xl font-medium cursor-pointer transition-all flex items-center justify-between"
                  >
                    <span>🎯 Forecast closing deals</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-350" />
                  </button>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 p-2.5 bg-white border rounded-xl leading-relaxed">
                Our model maps active leads, scoring probability dynamically across loaded tenants.
              </div>
            </div>

            {/* Main Conversation Canvas */}
            <div className="flex-1 flex flex-col justify-between bg-slate-900/5">
              {/* Message scroll list */}
              <div id="ai-chat-history" className="flex-1 p-5 overflow-y-auto space-y-4 font-sans text-xs">
                {messages.map((m) => (
                  <div 
                    key={m.id}
                    className={`flex items-start gap-2.5 max-w-[85%] ${m.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
                  >
                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0 shadow-sm ${
                      m.sender === 'user' ? 'bg-violet-600 text-white' : 'bg-[#FAF9FC] text-violet-600 border border-[#EDE9F3]'
                    }`}>
                      {m.sender === 'user' ? 'ME' : 'AI'}
                    </div>

                    <div className="space-y-2">
                      <div className={`p-3.5 rounded-2xl text-[12px] font-sans font-light leading-relaxed ${
                        m.sender === 'user' 
                          ? 'bg-violet-600 text-white rounded-tr-none' 
                          : 'bg-white text-slate-800 border border-[#EFEBF4] rounded-tl-none shadow-sm'
                      }`}>
                        <div className="whitespace-pre-wrap">{m.content}</div>

                        {/* Structured responsive elements (e.g. leads array listing) */}
                        {m.structuredLeads && m.structuredLeads.length > 0 && (
                          <div className="mt-3.5 space-y-2 text-xs border-t border-slate-100 pt-3">
                            {m.structuredLeads.map((lead) => (
                              <div key={lead.id} className="p-2.5 bg-[#FAF9FC] rounded-xl border border-[#EDE9F3] flex items-center justify-between gap-3 text-slate-700 font-sans">
                                <div>
                                  <p className="font-bold text-slate-900">{lead.name}</p>
                                  <p className="text-[10px] text-slate-405 font-bold">{lead.company} — score {lead.score}%</p>
                                </div>
                                <span className="text-[10px] font-extrabold text-violet-700 bg-violet-50 border border-violet-100 px-2 py-0.5 rounded">
                                  ${lead.value.toLocaleString()}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <p className={`text-[9px] text-slate-400 px-1 pl-1.5 ${m.sender === 'user' ? 'text-right' : ''}`}>
                        {m.timestamp}
                      </p>
                    </div>
                  </div>
                ))}

                {processingChat && (
                  <div className="flex items-center space-x-2 text-violet-600 animate-pulse pl-4">
                    <Sparkles className="w-4 h-4 animate-spin shrink-0" />
                    <span>Scraping dataset nodes...</span>
                  </div>
                )}
              </div>

              {/* Chat Input Bar */}
              <form onSubmit={handleSendChatSubmit} className="p-4 bg-white border-t border-slate-100 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Ask a question about database trends to generate ideas..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 text-xs px-3.5 py-3 bg-[#FAF9FC] border border-[#EDE9F3] rounded-xl focus:outline-none focus:bg-white focus:border-violet-600 transition-all font-sans"
                  disabled={processingChat}
                />
                <button
                  type="submit"
                  disabled={processingChat || !chatInput.trim()}
                  className="p-3 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white rounded-xl cursor-pointer shadow transition-transform active:translate-y-px"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>

          </div>
        )}

        {/* TAB 2: EMAIL GENERATOR STUDIO */}
        {activeTab === 'email' && (
          <div className="bg-white border rounded-2xl shadow-sm p-6 grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[500px] md:h-[500px]">
            {/* Parameter selection forms */}
            <div className="space-y-4 text-xs font-semibold text-slate-705">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Parameters</h3>
                <p className="text-[11px] text-slate-400">Sequence custom Outreach follow-ups utilizing smart tokens.</p>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-500 mb-1">Target Recipient Name</label>
                  <input
                    type="text"
                    placeholder="E.g., Sarah Connor"
                    value={emailModel.recipientName}
                    onChange={(e) => setEmailModel({ ...emailModel, recipientName: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-[#EDE9F3] rounded-xl focus:outline-none focus:border-violet-605 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Corporate Entity</label>
                  <input
                    type="text"
                    placeholder="Cyberdyne Systems"
                    value={emailModel.companyName}
                    onChange={(e) => setEmailModel({ ...emailModel, companyName: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-[#EDE9F3] rounded-xl focus:outline-none focus:border-violet-605 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-500 mb-1">Outreach Intent / Tone</label>
                  <select
                    value={emailModel.tone}
                    onChange={(e) => setEmailModel({ ...emailModel, tone: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 border border-[#EDE9F3] rounded-xl focus:outline-none focus:border-violet-605 focus:bg-white cursor-pointer"
                  >
                    <option value="Cold Outreach">Cold Outreach</option>
                    <option value="Follow-up">Nurturing Follow-up</option>
                    <option value="Proposal">Detailed Proposal</option>
                    <option value="Thank-you">Thank You Retainer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Core Topic Focus</label>
                  <input
                    type="text"
                    placeholder="E.g., Web App rebuild"
                    value={emailModel.focusTopic}
                    onChange={(e) => setEmailModel({ ...emailModel, focusTopic: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-[#EDE9F3] rounded-xl focus:outline-none focus:border-violet-605 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Approximate Opportunity Value ($)</label>
                <input
                  type="text"
                  placeholder="5000"
                  value={emailModel.valueSize}
                  onChange={(e) => setEmailModel({ ...emailModel, valueSize: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-[#EDE9F3] rounded-xl focus:outline-none focus:border-violet-605 focus:bg-white"
                />
              </div>

              <button
                onClick={handleGenerateEmail}
                disabled={generatingEmail}
                className="w-full py-3 bg-violet-605 hover:bg-violet-750 disabled:opacity-50 text-white font-bold rounded-xl shadow transition-transform cursor-pointer"
              >
                {generatingEmail ? 'Triggering model parameters...' : 'Generate Sales Blueprint Copy'}
              </button>
            </div>

            {/* Generated results output display */}
            <div className="bg-slate-900 text-slate-100 rounded-2xl p-5 flex flex-col justify-between relative h-full">
              <div className="absolute right-3 top-3 flex items-center space-x-1 font-semibold">
                <span className="text-[8px] bg-violet-600 text-white px-2 py-0.5 rounded tracking-widest uppercase">
                  AI Output
                </span>
              </div>

              <div className="flex-1 mt-4 overflow-y-auto text-xs font-mono font-light leading-relaxed whitespace-pre-wrap pr-1 bg-slate-950 p-4 border border-slate-800 rounded-xl">
                {generatedEmail ? (
                  generatedEmail
                ) : (
                  <p className="text-slate-500 text-center pt-24 font-sans italic p-4">Configure values and trigger computation to view structured output copies.</p>
                )}
              </div>

              {generatedEmail && (
                <button
                  onClick={copyEmailToClipboard}
                  className="mt-4 py-2 bg-violet-605 hover:bg-violet-750 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  {emailCopied ? (
                    <>
                      <CopyCheck className="w-4 h-4" />
                      <span>Copied email to clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Email Output Draft</span>
                    </>
                  )}
                </button>
              )}
            </div>

          </div>
        )}

        {/* TAB 3: MEETING NOTES CONVERTER AND TASK INJECTION SYSTEMS */}
        {activeTab === 'summarizer' && (
          <div className="bg-white border border-[#EDE9F3] rounded-2xl shadow-sm p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left raw transcript inputs */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-850">Input Transcript / Bullet Journals</h3>
                  <p className="text-xs text-slate-450 mt-0.5">Parse meeting audio, transcript fragments or text logs.</p>
                </div>

                <textarea
                  value={rawNotes}
                  onChange={(e) => setRawNotes(e.target.value)}
                  className="w-full h-80 p-4 bg-slate-50/75 border border-[#EDE9F3] focus:outline-none focus:bg-white focus:border-violet-600 rounded-2xl text-xs font-mono leading-relaxed"
                  placeholder="Paste manual call transcription blocks..."
                />

                <button
                  onClick={handleSummarizeNotes}
                  className="w-full py-3 bg-violet-605 hover:bg-violet-750 text-white font-bold text-xs rounded-xl cursor-pointer"
                >
                  {processingSummary ? 'Processing summaries...' : 'Solve Action Items & Next Steps'}
                </button>
              </div>

              {/* Parsed Output Columns */}
              <div className="space-y-4 flex flex-col justify-between">
                
                {summaryOutput ? (
                  <div className="space-y-4 flex-1">
                    {/* Executive summaries */}
                    <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl">
                      <h4 className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mb-1 shadow-none">Parsed Executive Summary</h4>
                      <p className="text-xs text-slate-600 leading-relaxed font-sans">{summaryOutput.executive}</p>
                    </div>

                    {/* Action Items Parser list */}
                    <div className="space-y-2.5">
                      <h4 className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest pl-1">Resolved Task Action Items</h4>
                      <p className="text-[10px] text-violet-600 font-semibold pl-1">Boost these bullet segments as active pending pipeline checkmarks instantly!</p>
                      
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {summaryOutput.actionItems.map((bullet, idx) => (
                           <div 
                            key={idx}
                            className={`p-3 bg-white border rounded-xl flex items-center justify-between gap-3 text-xs shadow-sm transition-all hover:border-violet-300 ${
                              addedTasks[idx] ? 'bg-emerald-50/10 border-emerald-100' : 'border-slate-150'
                            }`}
                          >
                            <span className={`text-slate-700 flex-1 ${addedTasks[idx] ? 'line-through text-slate-400' : ''}`}>
                              {bullet}
                            </span>

                            {addedTasks[idx] ? (
                              <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-200 shrink-0">
                                ✓ Task Scheduled
                              </span>
                            ) : (
                              <button
                                onClick={() => handleConvertToActionTask(bullet, idx)}
                                className="flex items-center space-x-1 text-[9px] bg-violet-50 hover:bg-violet-600 hover:text-white text-violet-700 border border-violet-100 font-bold px-2.5 py-1 rounded transition-colors shrink-0 cursor-pointer"
                              >
                                <Plus className="w-3 h-3" />
                                <span>Boost Task</span>
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Risk Assessments */}
                    <div className="p-3.5 bg-red-50/20 border border-red-100 rounded-2xl flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                      <div>
                        <h4 className="text-[10px] text-red-700 font-extrabold uppercase tracking-wider">Identified Risk Variables</h4>
                        <p className="text-xs text-slate-600 leading-snug mt-1 font-sans">{summaryOutput.riskAssessment}</p>
                      </div>
                    </div>

                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center p-12 text-slate-400 border border-dashed rounded-2xl">
                    <Sparkles className="w-8 h-8 text-violet-500 animate-bounce mb-2" />
                    <p className="font-semibold text-xs text-center text-slate-750">Run transcript to populate summary blocks</p>
                  </div>
                )}

              </div>

            </div>
          </div>
        )}

      </div>

    </div>
  );
}
