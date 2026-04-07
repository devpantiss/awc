// ============================================================
// LOGIN SCREEN
// Modern Split Layout with Theme Toggle & Accent Colors
// ============================================================

import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import type { UserRole } from '../../types';
import { Users, Shield, Settings, Eye, EyeOff, Moon, Sun, Activity } from 'lucide-react';
import AnoAI from '@/components/ui/animated-shader-background';

// Role configuration with dummy credentials
const roles = [
  { id: 'worker' as UserRole, title: 'Worker', email: 'worker@neev.ai', password: 'password123', icon: Users },
  { id: 'supervisor' as UserRole, title: 'Supervisor', email: 'supervisor@neev.ai', password: 'password123', icon: Shield },
  { id: 'admin' as UserRole, title: 'Admin', email: 'admin@neev.ai', password: 'password123', icon: Settings },
];

export function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const navigate = useNavigate();
  const { login, theme, toggleTheme, isAuthenticated, userRole } = useAppStore();

  const handleQuickFill = (roleId: UserRole) => {
    const role = roles.find(r => r.id === roleId);
    if (role) {
      setSelectedRole(role.id);
      setEmail(role.email);
      setPassword(role.password);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    const finalRole = roles.find(r => r.email === email)?.id || selectedRole || 'worker';
    
    setIsLoggingIn(true);
    await new Promise(r => setTimeout(r, 1200));
    login(finalRole);

    switch (finalRole) {
      case 'worker': navigate('/worker', { replace: true }); break;
      case 'supervisor': navigate('/supervisor', { replace: true }); break;
      case 'admin': navigate('/admin', { replace: true }); break;
    }
  };

  const isDark = theme === 'dark';

  if (isAuthenticated && userRole) {
    const targetPath = userRole === 'worker' ? '/worker' : userRole === 'supervisor' ? '/supervisor' : '/admin';
    return <Navigate to={targetPath} replace />;
  }

  return (
    <div className={`min-h-screen relative flex items-center justify-center p-4 sm:p-8 font-sans transition-colors duration-300 overflow-hidden ${isDark ? 'bg-[#0f1110] text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Decorative Professional Background Patterns & Effects */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Subtle dot pattern */}
        <div 
          className={`absolute inset-0 ${isDark ? 'opacity-[0.07] text-white' : 'opacity-[0.06] text-black'}`}
          style={{ 
            backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1.5px, transparent 0)', 
            backgroundSize: '48px 48px' 
          }}
        />
        
        {/* Animated Shader Background */}
        <AnoAI />
      </div>

      {/* Absolute Theme Toggle */}
      <button 
        onClick={toggleTheme}
        className={`absolute top-6 right-6 z-50 p-3 rounded-full backdrop-blur-md transition-all ${isDark ? 'bg-white/10 hover:bg-white/20 text-yellow-400' : 'bg-black/5 hover:bg-black/10 text-slate-700'}`}
      >
        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        
        {/* Left Side: Auth Form */}
        <div className="flex flex-col items-center max-w-md w-full mx-auto px-4">
          
          {/* Logo */}
          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-6 shadow-sm border ${isDark ? 'bg-[#1a1c1b] border-white/10' : 'bg-white border-slate-200'}`}>
            <Activity className={`w-6 h-6 ${isDark ? 'text-white' : 'text-slate-900'}`} />
          </div>

          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className={`text-sm mb-8 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
            Enter your email and password to access your account
          </p>

          {/* Quick Demo Fillers */}
          <div className="flex gap-2 w-full mb-6 overflow-x-auto pb-2 scrollbar-hide">
             {roles.map(r => (
               <button 
                 key={r.id} 
                 type="button" 
                 onClick={() => handleQuickFill(r.id)}
                 className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium border transition-colors
                   ${isDark ? 'bg-[#1a1c1b] border-white/5 text-gray-300 hover:text-white hover:border-white/20' : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300'}
                 `}
               >
                 <r.icon className="w-3.5 h-3.5" /> Demo {r.title}
               </button>
             ))}
          </div>

          <form onSubmit={handleLogin} className="w-full space-y-5">
            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold">Email<span className="text-lime-500">*</span></label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-3.5 rounded-xl border outline-none transition-all text-sm
                  ${isDark ? 'bg-transparent border-white/10 focus:border-lime-500 placeholder-gray-500' : 'bg-white border-slate-300 focus:border-lime-500 placeholder-slate-400'}
                `}
                placeholder="Enter Your Email..."
                required
              />
            </div>

            {/* Password Input */}
            <div className="space-y-1.5 relative">
              <label className="block text-sm font-semibold">Password<span className="text-lime-500">*</span></label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-4 pr-11 py-3.5 rounded-xl border outline-none transition-all text-sm
                    ${isDark ? 'bg-transparent border-white/10 focus:border-lime-500 placeholder-gray-500' : 'bg-white border-slate-300 focus:border-lime-500 placeholder-slate-400'}
                  `}
                  placeholder="Enter Your Password..."
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-500 hover:text-white' : 'text-slate-400 hover:text-slate-700'}`}
                >
                  {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="remember" 
                  className={`w-4 h-4 rounded border appearance-none checked:bg-lime-500 checked:border-lime-500 relative
                    ${isDark ? 'bg-transparent border-white/20' : 'bg-white border-slate-300'}
                    after:content-[''] after:absolute after:hidden checked:after:block after:left-[4px] after:top-[1px] after:w-[6px] after:h-[10px] after:border-r-2 after:border-b-2 after:border-black after:rotate-45
                  `} 
                />
                <label htmlFor="remember" className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>Remember me</label>
              </div>
              <button type="button" className={`text-sm font-medium ${isDark ? 'text-gray-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>
                Forgot Password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoggingIn || !email || !password}
              className="w-full py-3.5 rounded-xl text-sm font-bold text-black bg-gradient-to-r from-yellow-400 to-lime-500 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4 shadow-lg shadow-lime-500/20"
            >
              {isLoggingIn ? (
                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              ) : (
                'Sign in'
              )}
            </button>
          </form>

        </div>

        {/* Right Side: Image Card */}
        <div className="hidden lg:block relative w-full h-[85vh] max-h-[800px] rounded-[2rem] overflow-hidden ml-auto shadow-2xl bg-slate-900">
          {/* Main Background Image - Uploaded Child Image */}
          <img 
            src="/kid.png" 
            alt="Child Development" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
            onError={(e) => {
              // Fallback to the previous image if they haven't saved it yet
              e.currentTarget.src = "https://images.unsplash.com/photo-1544716942-8c10faee50b8?q=80&w=1500&auto=format&fit=crop";
            }}
          />
          
          {/* Subtle gradient overlay to ensure the image text pops */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f1110]/90 via-[#0f1110]/30 to-transparent"></div>

          {/* Glass Overlay Card */}
          <div className="absolute inset-x-0 bottom-0 p-8 pt-24">
            <div className={`relative z-10 text-center p-8 rounded-3xl backdrop-blur-xl border ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-[#0f1110]/60 border-white/10 text-white'} shadow-2xl`}>
              <h2 className="text-3xl lg:text-4xl font-serif font-bold mb-4 tracking-wide">
                Welcome to Smart Access
              </h2>
              <p className="text-gray-300 text-sm max-w-md mx-auto leading-relaxed">
                Sign in to continue your personalized digital experience and unlock all exclusive features for early childhood monitoring.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
