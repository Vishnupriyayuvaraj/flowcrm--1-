import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Mail, 
  Lock, 
  User, 
  Building, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Check, 
  Database,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  Coins,
  Activity,
  Layers,
  CheckCircle,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import { PlanType } from '../types';
import ZenzLogo from './ZenzLogo';

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  company: string;
  role: 'Owner' | 'Admin' | 'Manager' | 'Member';
  plan: PlanType;
  avatar: string;
  themeColor: string;
}

interface LoginViewProps {
  onLoginSuccess: (user: AuthenticatedUser) => void;
}

const PRESET_USERS = [
  {
    id: 'user-alex',
    name: 'Alex Johnson',
    email: 'alex@flowcrm.app',
    password: 'password123',
    company: 'Vortex Digital Agency',
    role: 'Owner' as const,
    plan: 'Pro' as PlanType,
    avatar: 'AJ',
    themeColor: 'violet'
  },
  {
    id: 'user-sarah',
    name: 'Sarah Miller',
    email: 'sarah@vortex.agency',
    password: 'password123',
    company: 'Vortex Digital Agency',
    role: 'Admin' as const,
    plan: 'Pro' as PlanType,
    avatar: 'SM',
    themeColor: 'sky'
  },
  {
    id: 'user-david',
    name: 'David Carter',
    email: 'david@vortex.agency',
    password: 'password123',
    company: 'Vortex Digital Agency',
    role: 'Manager' as const,
    plan: 'Pro' as PlanType,
    avatar: 'DC',
    themeColor: 'emerald'
  },
  {
    id: 'user-marcus',
    name: 'Marcus Sterling',
    email: 'marcus@saasify.io',
    password: 'password123',
    company: 'SaaSify Inc.',
    role: 'Admin' as const,
    plan: 'Business' as PlanType,
    avatar: 'MS',
    themeColor: 'amber'
  }
];

export default function LoginView({ onLoginSuccess }: LoginViewProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'presets'>('login');
  
  // Login fields state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadStep, setLoadStep] = useState('');
  
  // Registration fields state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regCompany, setRegCompany] = useState('');
  const [regPlan, setRegPlan] = useState<PlanType>('Pro');
  const [regThemeColor, setRegThemeColor] = useState('violet');

  // Loaded user database index
  const [registeredUsers, setRegisteredUsers] = useState<typeof PRESET_USERS>([]);

  useEffect(() => {
    // Scaffold initial users in localStorage if they do not exist
    const saved = localStorage.getItem('flowcrm_registered_users');
    if (saved) {
      setRegisteredUsers(JSON.parse(saved));
    } else {
      localStorage.setItem('flowcrm_registered_users', JSON.stringify(PRESET_USERS));
      setRegisteredUsers(PRESET_USERS);
    }
  }, []);

  const triggerMockLoading = (stepLabel: string, callback: () => void) => {
    setIsLoading(true);
    setErrorMessage('');
    
    // Step 1
    setLoadStep('Mapping modular network layers...');
    
    setTimeout(() => {
      // Step 2
      setLoadStep('Resolving secure system credentials token...');
      
      setTimeout(() => {
        // Step 3
        setLoadStep(stepLabel);
        
        setTimeout(() => {
          setIsLoading(false);
          setLoadStep('');
          callback();
        }, 500);
      }, 500);
    }, 500);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setErrorMessage('Please fill in authentication credentials.');
      return;
    }

    const matchedUser = registeredUsers.find(
      u => u.email.toLowerCase() === loginEmail.trim().toLowerCase() && u.password === loginPassword
    );

    if (matchedUser) {
      triggerMockLoading('Generating secure session matrices...', () => {
        setSuccessMessage(`Welcome back, ${matchedUser.name}! Initializing Zenz console session...`);
        setTimeout(() => {
          onLoginSuccess({
            id: matchedUser.id,
            name: matchedUser.name,
            email: matchedUser.email,
            company: matchedUser.company,
            role: matchedUser.role,
            plan: matchedUser.plan,
            avatar: matchedUser.avatar,
            themeColor: matchedUser.themeColor
          });
        }, 800);
      });
    } else {
      const hasEmail = registeredUsers.some(u => u.email.toLowerCase() === loginEmail.trim().toLowerCase());
      if (hasEmail) {
        setErrorMessage('Invalid security credentials. Check password index.');
      } else {
        setErrorMessage('Account parameters not found. Select the Pre-loaded teammates tab or register a new one to proceed!');
      }
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regPassword.trim() || !regCompany.trim()) {
      setErrorMessage('Please fill in all registration parameters.');
      return;
    }

    // Check if email already exists
    const emailExists = registeredUsers.some(
      u => u.email.toLowerCase() === regEmail.trim().toLowerCase()
    );
    if (emailExists) {
      setErrorMessage('Email database already has this account registered.');
      return;
    }

    const pLetters = regName.trim().split(' ');
    const calculatedAvatar = pLetters.length > 1 
      ? (pLetters[0].charAt(0) + pLetters[1].charAt(0)).toUpperCase()
      : regName.trim().substring(0, 2).toUpperCase();

    const newUser = {
      id: `user-custom-${Date.now()}`,
      name: regName.trim(),
      email: regEmail.trim().toLowerCase(),
      password: regPassword,
      company: regCompany.trim(),
      role: 'Owner' as const,
      plan: regPlan,
      avatar: calculatedAvatar,
      themeColor: regThemeColor
    };

    triggerMockLoading('Scaffolding workspace volume keys...', () => {
      const updatedList = [...registeredUsers, newUser];
      setRegisteredUsers(updatedList);
      localStorage.setItem('flowcrm_registered_users', JSON.stringify(updatedList));

      setSuccessMessage('Account created and saved in Zenz local database successfully!');
      setTimeout(() => {
        onLoginSuccess({
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          company: newUser.company,
          role: newUser.role,
          plan: newUser.plan,
          avatar: newUser.avatar,
          themeColor: newUser.themeColor
        });
      }, 800);
    });
  };

  const handleInstantConnect = (preset: typeof PRESET_USERS[0]) => {
    triggerMockLoading(`Mapping role context: ${preset.role}...`, () => {
      setSuccessMessage(`Connected as ${preset.name}!`);
      setTimeout(() => {
        onLoginSuccess({
          id: preset.id,
          name: preset.name,
          email: preset.email,
          company: preset.company,
          role: preset.role,
          plan: preset.plan,
          avatar: preset.avatar,
          themeColor: preset.themeColor
        });
      }, 700);
    });
  };

  const getThemeAccentClass = (col: string) => {
    switch (col) {
      case 'violet': return 'bg-violet-600 text-white';
      case 'sky': return 'bg-sky-505 text-white';
      case 'emerald': return 'bg-emerald-500 text-white';
      case 'amber': return 'bg-amber-500 text-amber-950';
      default: return 'bg-violet-600 text-white';
    }
  };

  return (
    <div id="login-container" className="min-h-screen w-screen flex flex-col lg:flex-row bg-[#FAF9FC] text-slate-800 font-sans tracking-tight">
      
      {/* LEFT SIDE: PRECISE ZENZ WEB TEMPLATE VISUAL PREVIEWS & SAAS HERO (matches image completely) */}
      <div className="w-full lg:w-7/12 bg-white border-r border-[#EFEBF4] p-8 lg:p-14 flex flex-col justify-between relative overflow-hidden shrink-0">
        
        {/* Ambient modern gradient radial glow as seen in the Zenz design */}
        <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.06)_0%,transparent_70%)] pointer-events-none select-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.05)_0%,transparent_70%)] pointer-events-none select-none" />
        
        {/* Grid accents */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f3f0f7_1px,transparent_1px),linear-gradient(to_bottom,#f3f0f7_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-25 pointer-events-none select-none" />

        {/* Top Header Row */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ZenzLogo size={36} />
            <div>
              <h2 className="text-2xl font-display font-extrabold text-slate-900 tracking-tight flex items-baseline">
                Zenz<span className="text-violet-600 font-normal">.</span>
              </h2>
              <p className="text-[10px] text-violet-500 font-bold uppercase tracking-widest leading-none">Cloud Platform</p>
            </div>
          </div>
          <div className="flex items-center space-x-6 text-xs font-semibold text-slate-500">
            <span className="hover:text-violet-600 transition-colors pointer-cursor">Home</span>
            <span className="hover:text-violet-600 transition-colors pointer-cursor hidden sm:inline">Pages</span>
            <span className="hover:text-violet-600 transition-colors pointer-cursor hidden sm:inline">About</span>
            <span className="hover:text-violet-600 transition-colors pointer-cursor">Feature</span>
          </div>
        </div>

        {/* Hero Branding Section matching Zenz Mockup */}
        <div className="my-10 lg:my-16 space-y-8 relative z-10 max-w-2xl">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-50 border border-violet-100 text-[11px] font-bold text-violet-700">
              <Sparkles className="w-3 h-3 text-violet-600" />
              <span>SaaS Cloud Platform Website Template</span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-display font-extrabold text-slate-900 leading-[1.1] tracking-tight">
              Crafting the <br />
              future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-fuchsia-553 to-sky-500">SaaS Systems</span>
            </h1>
            
            <p className="text-sm text-slate-505 max-w-lg leading-relaxed font-sans">
              Redefining industry standards and innovating immersive workspace configurations. Securely manage client parameters, visualize conversions, score potential pipelines, and preserve tenant control in localized browser environments.
            </p>
          </div>

          {/* Interactive Bento Preview Widgets mirroring the Zenz mockup layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Widget A: Circular Performance Gauge Card */}
            <div className="bg-white border border-[#EBE7F1] p-5 rounded-2xl shadow-sm space-y-3 relative group hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Performance of last week</h4>
                  <p className="text-sm font-bold text-slate-800">Sales Conversion</p>
                </div>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              <div className="py-2 flex items-center justify-center relative">
                {/* Circular SVG Gauge matching image exactly */}
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="56" cy="56" r="42" stroke="#F1EFF5" strokeWidth="9" fill="transparent" />
                    <circle cx="56" cy="56" r="42" stroke="url(#gradient-purple-blue)" strokeWidth="10" strokeDasharray="264" strokeDashoffset="66" strokeLinecap="round" fill="transparent" />
                    <defs>
                      <linearGradient id="gradient-purple-blue" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#7C3AED" />
                        <stop offset="100%" stopColor="#06B6D4" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute text-center">
                    <p className="text-2xl font-extrabold text-slate-900">75%</p>
                    <p className="text-[9px] text-slate-400 font-semibold uppercase">Progress</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-500 font-medium">Daily conversions:</span>
                <span className="font-bold text-emerald-600 flex items-center">↑ 18.4%</span>
              </div>
            </div>

            {/* Widget B: Client Overview Bento Card */}
            <div className="bg-white border border-[#EBE7F1] p-5 rounded-2xl shadow-sm space-y-3.5 relative group hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-violet-600">Client overviews</span>
                  <ArrowUpRight className="w-4 h-4 text-slate-400" />
                </div>
                <h4 className="text-base font-extrabold text-slate-800 mt-1">11,240 <span className="text-xs font-normal text-slate-400">active items</span></h4>
                <p className="text-xs text-slate-450 mt-1">Discover dynamic user profiles with multi-tenant custom templates.</p>
              </div>

              {/* Horizontal colorful gradient tracker */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono font-medium">
                  <span>Workspace Integration</span>
                  <span>Enterprise Ready</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-violet-600 via-pink-500 to-amber-400 h-full w-[85%] rounded-full" />
                </div>
              </div>

              {/* Minimalist face pile simulator */}
              <div className="flex items-center space-x-1 pt-1">
                {['SM', 'DC', 'SM', 'MS'].map((initials, idx) => (
                  <div 
                    key={idx} 
                    className={`w-6 h-6 rounded-full border border-white text-[9px] font-bold flex items-center justify-center text-white ${
                      idx === 0 ? 'bg-violet-500' :
                      idx === 1 ? 'bg-sky-500' :
                      idx === 2 ? 'bg-pink-500' : 'bg-amber-500'
                    }`}
                  >
                    {initials}
                  </div>
                ))}
                <span className="text-[10px] text-slate-400 font-bold pl-1">+23 teammates</span>
              </div>
            </div>

          </div>
        </div>

        {/* Footer info lockups */}
        <div className="flex items-center space-x-6 text-[11px] text-slate-400 relative z-10 border-t border-slate-100 pt-6">
          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-violet-500" />
            <span>Stateless Browser Session Keys</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Database className="w-4 h-4 text-violet-500" />
            <span>Persisted local db</span>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: BEAUTIFUL WHITE AUTHENTICATION CONTAINER (High-contrast, Zenz branding) */}
      <div className="flex-1 p-6 sm:p-12 lg:p-14 flex items-center justify-center bg-[#FAF9FC]">
        <div className="w-full max-w-md bg-white border border-[#EDE8F4] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          
          {/* Tabs header selector */}
          <div className="flex border-b border-slate-100 pb-px gap-4">
            <button
              onClick={() => {
                setActiveTab('login');
                setErrorMessage('');
              }}
              className={`pb-3 text-xs uppercase font-extrabold tracking-wider transition-colors cursor-pointer relative ${
                activeTab === 'login' ? 'text-violet-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Credentials Login
              {activeTab === 'login' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600" />
              )}
            </button>
            
            <button
              onClick={() => {
                setActiveTab('register');
                setErrorMessage('');
              }}
              className={`pb-3 text-xs uppercase font-extrabold tracking-wider transition-colors cursor-pointer relative ${
                activeTab === 'register' ? 'text-violet-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Sign Up Workspace
              {activeTab === 'register' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600" />
              )}
            </button>

            <button
              onClick={() => {
                setActiveTab('presets');
                setErrorMessage('');
              }}
              className={`pb-3 text-xs uppercase font-extrabold tracking-wider transition-colors cursor-pointer relative ${
                activeTab === 'presets' ? 'text-violet-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Teammate Presets
              {activeTab === 'presets' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600" />
              )}
            </button>
          </div>

          {/* Feedback alerts output block */}
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-100 text-red-650 rounded-xl flex items-start gap-2 text-xs">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-violet-50 border border-violet-100 text-violet-700 rounded-xl flex items-start gap-2 text-xs">
              <Check className="w-4 h-4 text-violet-650 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* LOADING BLOCK VIEW */}
          {isLoading ? (
            <div className="py-16 text-center space-y-4 animate-pulse">
              <div className="w-12 h-12 border-2 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-violet-600">Syncing Zenz Vault Modules</p>
                <p className="text-[10px] text-slate-450 font-mono italic">{loadStep}</p>
              </div>
            </div>
          ) : (
            <div>

              {/* TAB 1: TRADITIONAL LOGIN FORM */}
              {activeTab === 'login' && (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-slate-900">Access Zenz Workspace</h3>
                    <p className="text-xs text-slate-500">Fill in your registered corporate profile credentials below.</p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">Corporate Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                        <input
                          type="email"
                          required
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          placeholder="e.g., alex@flowcrm.app"
                          className="w-full pl-9 pr-4 py-2.5 bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-violet-605 rounded-xl text-slate-850 text-xs focus:outline-none transition-all font-sans"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">Access Token Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-9 pr-10 py-2.5 bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-violet-605 rounded-xl text-slate-850 text-xs focus:outline-none transition-all font-sans"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1 pt-1">
                    <label className="flex items-center space-x-1.5 text-slate-400 cursor-pointer select-none font-medium">
                      <input type="checkbox" defaultChecked className="rounded border-slate-300 bg-slate-50 text-violet-600 focus:ring-0 cursor-pointer" />
                      <span>Remember access key</span>
                    </label>
                    <button 
                      type="button"
                      onClick={() => alert("Zenz features stateless web database engines. Use password 'password123' for preset emails!")}
                      className="text-violet-600 hover:underline font-bold"
                    >
                      Forgot?
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 mt-4 bg-violet-650 hover:bg-violet-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-violet-600/10 cursor-pointer transition-transform active:translate-y-px flex items-center justify-center space-x-1.5"
                  >
                    <span>Authenticate Console</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="pt-4 text-center">
                    <p className="text-[11px] text-slate-450">
                      Want to connect instantly? Let's check out{' '}
                      <button 
                        type="button" 
                        onClick={() => setActiveTab('presets')} 
                        className="text-violet-600 font-bold hover:underline"
                      >
                        Preset Teammates
                      </button>
                    </p>
                  </div>
                </form>
              )}

              {/* TAB 2: USER REGISTRATION / SIGN UP FORM */}
              {activeTab === 'register' && (
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-slate-900">Create Tenant & Profile</h3>
                    <p className="text-xs text-slate-500">Your profile, company name, and plan settings will get stored dynamically.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Your Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                        <input
                          type="text"
                          required
                          placeholder="Clara Oswald"
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          className="w-full pl-8 pr-2 py-2 bg-slate-50 border border-slate-200 focus:bg-white rounded-lg text-slate-850 text-xs focus:outline-none focus:border-violet-600 font-sans"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Personal Key Color</label>
                      <select
                        value={regThemeColor}
                        onChange={(e) => setRegThemeColor(e.target.value)}
                        className="w-full px-2 py-2 bg-slate-50 border border-slate-200 focus:bg-white rounded-lg text-slate-800 text-xs focus:outline-none focus:border-violet-600 cursor-pointer font-bold"
                      >
                        <option value="violet">Zenz Violet</option>
                        <option value="sky">Aqua Sky</option>
                        <option value="emerald">Zen Emerald</option>
                        <option value="amber">Amber Gold</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Corporate Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                        <input
                          type="email"
                          required
                          placeholder="clara@zenz.io"
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          className="w-full pl-8 pr-2 py-2 bg-slate-50 border border-slate-200 focus:bg-white rounded-lg text-slate-850 text-xs focus:outline-none focus:border-violet-600 font-sans"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Account Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                        <input
                          type="password"
                          required
                          placeholder="••••••••"
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          className="w-full pl-8 pr-2 py-2 bg-slate-50 border border-slate-200 focus:bg-white rounded-lg text-slate-850 text-xs focus:outline-none focus:border-violet-600 font-sans"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Workspace Plan</label>
                      <select
                        value={regPlan}
                        onChange={(e) => setRegPlan(e.target.value as PlanType)}
                        className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 focus:bg-white rounded-lg text-slate-800 text-xs focus:outline-none focus:border-violet-600 cursor-pointer font-bold"
                      >
                        <option value="Free">Free Sandbox</option>
                        <option value="Pro">Pro Commercial</option>
                        <option value="Business">Business Enterprise</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Company / Team Entity</label>
                      <div className="relative">
                        <Building className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                        <input
                          type="text"
                          required
                          placeholder="Zenz Digital Co."
                          value={regCompany}
                          onChange={(e) => setRegCompany(e.target.value)}
                          className="w-full pl-8 pr-2 py-2 bg-slate-50 border border-slate-200 focus:bg-white rounded-lg text-slate-850 text-xs focus:outline-none focus:border-violet-600 font-sans"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 mt-3 bg-violet-605 hover:bg-violet-600 text-white text-xs font-bold rounded-xl cursor-pointer transition-colors text-center"
                  >
                    Register Account & Launch Session
                  </button>

                  <p className="text-[10px] text-slate-450 text-center leading-relaxed">
                    By registering, you establish a virtual tenant ledger mapped perfectly to this browser.
                  </p>
                </form>
              )}

              {/* TAB 3: ONE-CLICK QUICK CONNECT PRESET LAB */}
              {activeTab === 'presets' && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-slate-900">Preset Teammates</h3>
                    <p className="text-xs text-slate-500">Deploy as active platform colleagues to test customized authorization boundaries instantly.</p>
                  </div>

                  <div className="grid grid-cols-1 gap-2 max-h-72 overflow-y-auto pr-1">
                    {registeredUsers.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleInstantConnect(preset)}
                        className="p-3 bg-slate-50/60 hover:bg-violet-50/40 border border-slate-100 hover:border-violet-200/80 rounded-xl transition-all cursor-pointer text-left space-y-1 group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2.5">
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-[10px] shrink-0 ${getThemeAccentClass(preset.themeColor)}`}>
                              {preset.avatar}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-800 leading-none group-hover:text-violet-600 transition-colors">{preset.name}</p>
                              <p className="text-[10px] text-slate-450 truncate mt-0.5">{preset.email}</p>
                            </div>
                          </div>
                          <span className="text-[8px] font-extrabold uppercase px-1.5 py-0.5 bg-violet-100/50 text-violet-700 rounded-full">{preset.role}</span>
                        </div>

                        <div className="flex items-center justify-between text-[10px] pt-1.5 mt-1 border-t border-slate-100/60">
                          <span className="text-slate-400 font-medium truncate max-w-[120px]">{preset.company}</span>
                          <span className="text-[9px] font-bold text-slate-450 capitalize">{preset.plan} Plan</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="text-[10px] bg-slate-50/55 p-3 border border-slate-150 rounded-xl leading-relaxed text-slate-500 flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><b>Testing Matrix Note</b>: Fast-connecting allows switching profiles dynamically to test authorizations, update metrics, active boards, and workspaces instantly.</span>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>
      </div>

    </div>
  );
}
